import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import PostForm from '../components/PostForm';
import PostCard from "../components/PostCard";
import { useEffect } from "react";
import { LOAD_POST_REQUEST } from "../reducers/post";

const Home = () => {
    const dispatch = useDispatch();
    const { me } = useSelector((state)=>state.user);
    const { mainPosts, hasMorePost, loadPostLoading } = useSelector((state) => state.post);

    useEffect(() => {
        dispatch({
            type : LOAD_POST_REQUEST,
        })
    }, []);

    // 스크롤 로딩
    useEffect(()=>{
        function onScroll() {
            if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300){
                if(hasMorePost && !loadPostLoading){
                    dispatch({
                        type : LOAD_POST_REQUEST,
                    });
                }
            }
        }
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll); // 메모리 해제(useEffect)
        }
    }, [loadPostLoading, hasMorePost])
    
    return (
        <AppLayout>
            {me && <PostForm />}
            {mainPosts.map((post) => <PostCard key={post.id} post={post}/>)}
        </AppLayout>
    )
}

export default Home;