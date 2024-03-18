const express = require("express")
const loginRouter = express.Router()
const dbConnection = require("../config/db")

loginRouter.post("/", (req, res) => {

    const { email, password} = req.body;
    
    const query = `SELECT * FROM register WHERE email = ?`;
    
    dbConnection.query(
        query,
        [ email, password],
        (err, result, fields) => {
    
            if(err){
                console.log("Database error while registering ->", err);
            }
    
            if(result.length > 0){
    
                if(password === result[0].password){

                      const token = Math.floor(Math.random() * 10000) + 1;

                      const updateQuery = `UPDATE register SET token = ?, isActive = ? WHERE email = ?`


                      dbConnection.query(updateQuery, [token, 1, email ], (updateErr, updateResult) => {

                        if(updateErr){
                            return res.status(500).json({error: "Error updating token and isActive"})
                        }

                        const {id, username, email, token } = result[0]

                        res.status(200).json({message: "User logged in!", data: {id, username, email, token} })
                      })


    
                } else {
                    res.status(401).json({message: "Wrong password!"})
    
                }
    
            } else {
                res.status(404).json({error: "User not found!"})
            }
    
        }
    )
    
    
    
    })

    module.exports = loginRouter