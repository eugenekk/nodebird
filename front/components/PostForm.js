import { Button, Form, Input } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { ADD_POST_REQUEST, addPostAction, UPLOAD_IMAGES_REQUEST  } from '../reducers/post';


const PostForm = () => {
    const dispatch = useDispatch();
    const { imagePaths, addPostDone, addPostLoading } = useSelector((state) => state.post);
    const [ text, onChangeText, setText] = useInput('')
    
    useEffect(()=>{
        if(addPostDone){
            setText('')
        }
    }, [addPostDone]);

    const onSubmit = useCallback(() => {
        dispatch(addPostAction(text))
      }, [text]);

    //이미지 업로드
    const imageInput = useRef();
    const onClickImageUpload = useCallback(() => {
        imageInput.current.click();
    }, [imageInput.current]);

    const onChangeImages = useCallback((e) => {
        console.log('images', e.target.files);
        const imageFormData = new FormData();
        [].forEach.call(e.target.files, (f) => {
            imageFormData.append('image', f);
        });
        dispatch({
            type: UPLOAD_IMAGES_REQUEST,
            data: imageFormData,
        });
    }, []);

    return (
        <Form style={{ margin : '10px 0 20px'}} encType='multipart/form-data' onFinish ={onSubmit}>
            <Input.TextArea
                value={text}
                onChange={onChangeText}
                maxLength={140}
                placeholder="어떤 일이 있었나요?"
            />
            <div>
                <input type="file" name="image" multiple hidden ref={imageInput} onChange={onChangeImages}/>
                <Button onClick={onClickImageUpload} >이미지 업로드</Button>
                <Button type='primary' style={{ float: 'right'}} htmlType='submit' loading={addPostLoading}>짹짹저장</Button>
            </div>
            {/* 이미지 미리보기 */}
            <div>
                {imagePaths.map((v, i)=>(
                    <div key={v} style= {{ display: 'inline-block'}}>
                        <img src={`http://localhost:3065/${v}`} style={{width:'200px'}} alt={v}/> 
                        <div>
                            <Button>제거</Button>
                        </div>
                    </div>
                ))}
            </div>
        </Form>
    )
};

export default PostForm;