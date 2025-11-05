import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({ path: '.../.env' });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:  process.env.EMAIL_USER,
        pass:  process.env.EMAIL_PASSWORD,
    }
})

export const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"ShopEase" <${process.env.EMAIL_USER}`,
            to,
            subject, 
            html
        })
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error(`❌ Email error: ${error.message}`);
    }
}