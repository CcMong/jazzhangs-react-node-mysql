import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";


export const getPosts = (req, res) => {

    const token = req.cookies.accessToken;

    if(!token) return res.status(401).json("You are not logged in!");

    // Need to validate the token, as it expires
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!"); 

        const q = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) 
        LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ?
        ORDER BY p.createdAt DESC`; // For posts, we need the post as well as the user making the post. So we combine both, with the condition that the user id matches the id of the post creator. NB we only need the name, image and ID of the post user. Also we want to make sure that a user's feed contains posts of other users they are following, ALONG WITH the followers' own posts

        db.query(q, [userInfo.id, userInfo.id], (err, data) => {
            if(err) return res.status(500).json(err);
            return res.status(200).json(data);
        });    
    });
};

export const addPost = (req, res) => {

    const token = req.cookies.accessToken;

    if(!token) return res.status(401).json("You are not logged in!");
    
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if(err) return res.status(403).json("Token is not valid!"); 

        const q = "INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?)";

        const values = [
            req.body.desc,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id
        ]

        db.query(q, [values], (err, data) => {
            if(err) return res.status(500).json(err);
            return res.status(200).json("Your post has been created");
        });    
    })
};