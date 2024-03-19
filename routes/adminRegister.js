const express = require("express");
const adminRegisterRouter = express.Router()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

adminRegisterRouter.post("/", async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const userIp = req.socket.remoteAddress

        await prisma.admin.create({data:{username, email, password, userIp}})
    
        res.status(201).json({message: "registration successful",})

    } catch (error) {
        console.log("error while registration ->", error);
    } })

module.exports = adminRegisterRouter