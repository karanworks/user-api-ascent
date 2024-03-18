const express = require("express");
const mysql = require("mysql")

const app = express();

app.use(express.json());

const { createConnection } = require("mysql");

const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user'
  });


  const tableName = "register";

  dbConnection.query(

    `CREATE TABLE IF NOT EXISTS ${tableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP )`, (err, result, fields) => {
            if(err){
                console.log("Database error here ->", err);
                return
            }

            return result;
        }
  )


app.get("/", (req, res) => {
    res.send("Yup its working...")
})

app.post("/register", (req, res) => {

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
app.post("/login", (req, res) => {

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

                res.status(200).json({message: "User logged in!", user: result[0]})
            } else {
                res.status(401).json({message: "Wrong password!"})

            }

        } else {
            res.status(404).json({error: "User not found!"})
        }

    }
)



})

app.listen(3001, () => {
    console.log("Server listening at port no -> 3000");
})