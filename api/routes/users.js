import express from "express";
import { getUser } from "../controllers/user.js";

const router = express.Router();

// eg. of using the user router in the index.js file to make any API request. 

// router.get("/test", (req, res) => {

//     res.send("it is working!");
// })

router.get("/find/:userId", getUser);

export default router;