import { makeRequest } from "../../axios";
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from 'react-query';


const Posts = () => {

  //React Query
  const { isLoading, error, data } = useQuery(['posts'], () =>

    makeRequest.get("/posts").then(res => {
      return res.data;
    })
  );
  
  return (
    <div className="posts">

      {error ? "Oops... Something went wrong..." 
      : isLoading
      ? "Loading..." 
      : data.map((post) => (
        <Post post={post} key={post.id}/>
      ))}
    </div>
  );
};

export default Posts;
