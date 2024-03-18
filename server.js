const express = require("express");
const dbConnection = require("./config/db")
const app = express();
const cors = require("cors")

// routers
const homeRouter = require("./routes/home")
const registerRouter = require("./routes/register")
const loginRouter = require("./routes/login");

// cookie parser
const cookieParser = require("cookie-parser");

// parsing json
app.use(express.json());

// cors connection
app.use(cors({

    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true

}))

app.use((req, res, next) => {

res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
res.setHeader("Access-Control-Allow-Methods", 'GET, PUT, POST, DELETE');
res.setHeader("Access-Control-Allow-Credentials", "true");
res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  next();


})

app.use(cookieParser())

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
    console.log("Server listening at port no -> 3001");
})