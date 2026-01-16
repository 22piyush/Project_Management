import app from "./app.js";
import { connectDB } from "./config/db.js";


//--------------------
// DATABASE CONNECTION 
//--------------------
connectDB();


//--------------------
// Start Server 
//--------------------
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


//--------------------
// Error Handling
//--------------------
// Handles rejected Promises that are not caught
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err.message);
    server.close(() => process.exit(1));
});

// Handles exceptions not caught by try/catch
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err.message);
    process.exit(1);
});


export default server;

