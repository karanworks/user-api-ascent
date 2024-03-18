const express = require("express");

const app = express();

app.use(express.json());


app.get("/", (req, res) => {

    res.send("Yup ist working...")
})



app.listen(3001, () => {
    console.log("Server listening at port no -> 3000");
})