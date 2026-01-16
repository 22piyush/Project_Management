import express from "express";
import cors from "cors";
import { config } from "dotenv";

config();
const app = express();
app.use(
    cors({
        origin: [],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);