import express from "express";
import cors from "cors";
import { Kafka } from "kafkajs";

const app = express();

// Configure CORS for specific origins
app.use(cors({
    origin: ["https://e-commerce-frontend-3rig.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));


app.use(express.json());

const kafka = new Kafka({
    clientId: "payment-service",
    brokers: ["localhost:9094"],
})

const producer = kafka.producer();

async function run() {
    try {
        await producer.connect();
        console.log("Producer connected");

    }
    catch (error) {
        console.error("Error producing message:", error);
    }
}

run().catch(console.error);

// Basic health check route
app.get("/", (req, res) => {
    res.send("Payment service is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send(err.message);
});

// EndPoint
app.post("/payment-service", async (req, res) => {
    const { cart } = req.body;
    const userId = "123";
    // TODO: PAYMENT logic
    console.log("Api end point hit");
    await producer.send({
        topic: "payment-successful",
        messages: [
            {
                value: JSON.stringify({ userId, cart }),
            },
        ],
    });
    // await producer.disconnect();
    return res.status(200).json({ message: "Payment service is success" });
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).send("Not found");
});

const PORT = 8000;
app.listen(PORT, () => {
    run()
    console.log(`Payment service is running on port ${PORT}`);
});