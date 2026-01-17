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
// This exception occurs if we use try but not use catch block
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err.message);
    server.close(() => process.exit(1));
});

// Handles exceptions not caught by try/catch
// This exception occurs if we not use try and catch block
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err.message);
    process.exit(1);
});


export default server;

