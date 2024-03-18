const express = require("express");
const router = express.Router()

const dbConnection = require("../config/db")

router.post("/", (req, res) => {

    const {username, email, password} = req.body;
    
    const query = `INSERT INTO register (username, email, password) VALUES (?, ?, ?)`;
    
    dbConnection.query(
        query,
        [username, email, password],
        (err, result, fields) => {
    
            if(err){
                console.log("Database error while registering ->", err);
            }
    
            console.log("registration successful ->", result);
    
        }
    )
    
    res.json({message: "Registration successful"})
    
    })

module.exports = router