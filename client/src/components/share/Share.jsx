import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from 'react-query';
import { makeRequest } from "../../axios";

const Share = () => {

  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");

  const upload = async () => {
    try{

      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;

    } catch(err) {
      console.log(err)
    }
  }

  const {currentUser} = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation((newPost) => {

    return makeRequest.post("/posts", newPost);
  },
  {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleClick = async (event) => {

    event.preventDefault();
    // We will send the file and description using React Query mutation

    let imgUrl = ""; // If there is no file, then the image URL will just be an empty string. When we do have a file, then we will upload it and send it to the mutation
    if(file) imgUrl = await upload()

    mutation.mutate({desc, img: imgUrl});
    setDesc("");
    setFile(null);

  }

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img
              src={currentUser.profilePic}
              alt=""
            />
            <input 
            type="text" 
            placeholder={`What's on your mind, ${currentUser.name}?`} 
            onChange={(event) => setDesc(event.target.value)}
            value={desc}
            />
          </div>

          <div className="right">
            {file && <img className="file" src={URL.createObjectURL(file)} alt="" />}          
          </div>      
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input 
            type="file" 
            id="file" 
            style={{display:"none"}} 
            onChange={(event) => setFile(event.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
