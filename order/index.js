import express from "express";
import cors from "cors";

const app = express();

// Configure CORS for specific origins
app.use(cors({
    origin: ["https://e-commerce-frontend-3rig.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// Basic health check route
app.get("/", (req, res) => {
    res.send("Order service is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send(err.message);
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).send("Not found");
});

const PORT = 8004;
app.listen(PORT, () => {
    console.log(`Order service is running on port ${PORT}`);
});
