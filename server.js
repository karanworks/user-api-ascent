const express = require("express");
const app = express();
const cors = require("cors");

// routers
const homeRouter = require("./routes/home");
const adminAuthRouter = require("./routes/adminAuth");
const userAuthRouter = require("./routes/userAuth");

// cookie parser
const cookieParser = require("cookie-parser");

// parsing json
app.use(express.json());

// cors connection
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  next();
});

app.use(cookieParser());

app.use("/", homeRouter);
app.use("/", adminAuthRouter);
app.use("/", userAuthRouter);

app.listen(process.env.PORT, () => {
  console.log("Server listening at port no -> 3001");
});
