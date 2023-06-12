import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config();


const trasporter = nodemailer.createTransport({
    host:process.env.MAIL_HOST,
    port:process.env.MAIL_PORT,
    auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PW
    }
})

export default trasporter;