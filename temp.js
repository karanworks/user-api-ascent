import express from "express";
import mysql from "mysql";
import { config } from "dotenv";
import bodyParser from "body-parser";

config({ path: "./.env" });
const app = express();
const PORT = process.env.PORT;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,  POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.listen(PORT, () => {
  console.log("Example app listening on port ${PORT}");
});

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database as id " + connection.threadId);
});

app.get("/api/data", (req, res) => {
  const query = "SELECT * FROM usermanagement WHERE um_status='1'";
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

//login check
app.post("/auth/signin", (req, res) => {
  const { email, password } = req.body;
//   const query = SELECT um_id,um_Name,um_Email,um_status,ld_Pwd FROM usermanagement INNER JOIN login_details on login_details.ld_UserLinkId = usermanagement.um_id WHERE ld_UserId='${email}';
  connection.query(query, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      results.forEach((row) => {
        let orgPwd = row.ld_Pwd;

        if (orgPwd == password) {
          const dataFile = {
            status: "success",
            data: results,
          };
          res.send(dataFile);
        } else {
          const dataFile = {
            status: "Invalid Password",
            data: "You enter wrong password.",
          };
          res.send(dataFile);
        }
      });
    } else {
      const dataFile = {
        status: "Invalid Email/UserId",
        data: "Your account not found",
      };
      res.send(dataFile);
    }
  });
});