import { Button, Form, Input } from 'antd';
import { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from '../reducers/post';


const PostForm = () => {
    const { imagePaths } = useSelector((state) => state.post);
    const [ text, setText ] = useState('');
    const onChangeText = useCallback((e) => {
        setText(e.target.value);
    })
    const dispatch = useDispatch();
    const onSubmit = useCallback(()=>{
        // ADD_POST 액션실행
        dispatch(addPost);
        setText('');
    }, [])
    //이미지 업로드
    const imageInput = useRef();
    const onClickImageUpload = useCallback(() => {
        imageInput.current.click();
    }, [imageInput.current])
    return (
        <Form style={{ margin : '10px 0 20px'}} encType='multipart/form-data' onFinish ={onSubmit}>
            <Input.TextArea
                value={text}
                onChange={onChangeText}
                maxLength={140}
                placeholder="어떤 일이 있었나요?"
            />
            <div>
                <input type="file" multiple hidden ref={imageInput}/>
                <Button onClick={onClickImageUpload} >이미지 업로드</Button>
                <Button type='primary' style={{ float: 'right'}} htmlType='submit'>짹짹저장</Button>
            </div>
            {/* 이미지 미리보기 */}
            <div>
                {imagePaths.map((v)=>{
                    <div key={v} style= {{ display: 'inline-block'}}>
                        <img src={v} style={{width:'200px'}} alt={v}/> 
                        <div>
                            <Button>제거</Button>
                        </div>
                    </div>
                })}
            </div>
        </Form>
    )
};

export default PostForm;