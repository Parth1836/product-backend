import express, { Request, Response } from 'express';
const app = express();
import productRouter from "./product-routes/product";
import bodyParser from "body-parser";
import cors from "cors";
import authRouter, { authenticateToken } from './auth/auth';

// Use JSON parser middleware
app.use(express.json());
app.use(cors());

app.get("/demo", (req: Request, res: Response) => {
    res.send("hello world!")
})
 
app.listen(8080, ()=> {
    console.log("8080 app is running")
});
 
// middleware for checking valid token for every apis
app.use(authenticateToken)
// middleware for parsing the body for every requests
app.use(bodyParser.json());

// routes for login and register
app.use("/api", authRouter);

// routes for products
app.use("/api", productRouter);
