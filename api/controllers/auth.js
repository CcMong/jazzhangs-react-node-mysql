import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {

    // CHECK IF USER EXISTS

    const q = "SELECT * FROM users WHERE username = ?"; // using ? instead of req.body.username here provides extra security
    // req.body has username, password, email and name contained within. We also go to index.js and write the middlewares
    db.query(q, [req.body.username], (err, data) => {
        if(err) return res.status(500).json(err);

        if(data.length) return res.status(409).json("User already exists!");

        // IF USER DOES NOT EXIST, CREATE A NEW USER
            // Hash the password (bcryptjs)
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.password, salt); // We will now use this hashed password when querying the database

            const q = "INSERT INTO users (`username`, `email`, `password`, `name`) VALUE (?)"

            const authValues = [req.body.username, req.body.email, hashedPassword, req.body.name];

            db.query(q, [authValues], (err, data) => {
                if(err) return res.status(500).json(err);
                return res.status(200).json("User has been created.");
            })
    });     
}

export const login = (req, res) => {

    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {

        if(err) return res.status(500).json(err);

        if(data.length === 0) return res.status(404).json("User not found!");

        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password); // There is only one user, and data is an array of object(s).

        if(!checkPassword) return res.status(400).json("Invalid password or username!");

        // Want to send a JWT token, which makes the application a bit more secure

        const token = jwt.sign({id: data[0].id}, "secretkey"); // checks if the id of the originator matches that of the user, which will then give authorisation to be able to amend or delete. "secretkey" should be placed in a .env file

        const { password, ...otherValues} = data[0]

        res.cookie("accessToken", token, {
            httpOnly: true,
        }).status(200)
        .json(otherValues) //Note that we want to retrieve all information except the password, as that is confidential. So just above, we will destructure the user object, and spread the other values so that the password can be isolated

    })
};

export const logout = (req, res) => {

    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none"
    }).status(200).json("User has been successfully logged out");    
};