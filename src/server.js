import express from 'express';
import connectDB from './db.js';
import dotenv from 'dotenv';
import { router } from './routes/index.js';
dotenv.config({ path: '../.env' });

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
//Routes
app.use("/api/v1", router)

app.get("/health", (req, res) => {
    return res.json({
       success:true,
       message:"API is Running"
    })
})

connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is Running on this ${PORT}`)
    })
})

