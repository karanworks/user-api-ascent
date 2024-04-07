const express = require("express");
const app = express();
const cors = require("cors");

// routers
const homeRouter = require("./routes/home");
const adminAuthRouter = require("./routes/adminAuth");
const userAuthRouter = require("./routes/userAuth");
const adminUsersRouter = require("./routes/adminUsers");
const adminCampaignsRouter = require("./routes/adminCampaigns");
const campaignRouter = require("./routes/campaign");
const CRMFieldsRouter = require("./routes/crmFields");
const adminCrmFieldsRouter = require("./routes/adminCrmFields");
const mappingRouter = require("./routes/mapping");

// cookie parser
const cookieParser = require("cookie-parser");
const roleRouter = require("./routes/roles");

// parsing json
app.use(express.json());

// cors connection
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, PATCH, DELETE"
  );
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
app.use("/", adminUsersRouter);
app.use("/", campaignRouter);
app.use("/", adminCampaignsRouter);
app.use("/", CRMFieldsRouter);
app.use("/", adminCrmFieldsRouter);
app.use("/", roleRouter);
app.use("/", mappingRouter);

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server listening at port no -> ${process.env.PORT}`);
});
