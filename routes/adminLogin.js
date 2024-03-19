const express = require("express")
const adminLoginRouter = express.Router()

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

adminLoginRouter.post("/", async (req, res) => {

    try {

        const {email, password} = req.body;
        const userIp = req.socket.remoteAddress;

        // finding admin from email
        const adminFound = await prisma.admin.findFirst({
            where: {
                email
            },
            select: {
                id: true,
                email: true,
                password: true

            }
        })

        if(!adminFound){
            res.status(400).json({message: "User not found with this email", status: "failure"})
        } 
        else if(password === adminFound.password){

            // generates a number between 1000 and 10000 to be used as token
            const loginToken = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);

            // updating admin's token, and isActive status
            const updatedAdmin = await prisma.admin.update({
                where:{
                    id: adminFound.id,
                    email
                }, 
                data:{
                    isActive: 1,
                    token: loginToken,
                    userIp,
                }
            })

            const { password, ...adminDataWithoutPassword} = updatedAdmin;

            // cookie expiration date - 15 days
            const expirationDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); 
            res.cookie('token', loginToken, { expires: expirationDate });

            res.status(200).json({message: "admin logged in!", data: {...adminDataWithoutPassword}, status: "success"})
        } 
        else {
            res.status(400).json({message: "Wrong password!", status: "failure"})
        }
   
    } catch (error) {
        console.log("error while loggin in ", error);
    }
    
})

    module.exports = adminLoginRouter