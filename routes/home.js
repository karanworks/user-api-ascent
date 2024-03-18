const express = require("express");
const router = express.Router()

router.get("/", (req, res) => {
    res.send("Yup its working...")
})


module.exports =  router