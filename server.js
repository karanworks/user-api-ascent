const express = require("express");
const homeRouter = require("./routes/home")
const registerRouter = require("./routes/register")
const loginRouter = require("./routes/login")
const dbConnection = require("./config/db")


const app = express();

app.use(express.json());

app.use("/", homeRouter)
app.use("/register", registerRouter)
app.use("/login", loginRouter)


// register table
dbConnection.query(

    `CREATE TABLE IF NOT EXISTS register (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE,
        password VARCHAR(100) NOT NULL,
        token VARCHAR(100) DEFAULT NULL,
        isActive INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP )`, (err, result, fields) => {
            if(err){
                console.log("Database error here ->", err);
                return
            }

            return result;
        }
  )

app.listen(3001, () => {
    console.log("Server listening at port no -> 3000");
})