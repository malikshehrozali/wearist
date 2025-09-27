import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDb from './db/db.js';
import userRoute from "./routes/user.route.js"
import productRoute from "./routes/product.route.js"
import orderRoute from "./routes/order.route.js"

dotenv.config({
    path: "./.env"
});
connectDb();

const app = express();
const port = process.env.PORT || 3000;

// Important Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control-Allow-Origin", "Pragma", "Expires"],
}));

// Important Routes
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/stripe", orderRoute)

app.listen(port, ()=>{
    console.log(`server is running on ${port}`);
    
})