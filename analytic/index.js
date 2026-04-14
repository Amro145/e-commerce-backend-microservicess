import express from "express";
import cors from "cors";
import { Kafka } from "kafkajs";

const app = express();

app.use(cors({
    origin: ["https://e-commerce-frontend-3rig.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// Basic health check route
app.get("/", (req, res) => {
    res.send("Analytic service is running");
});
const kafka = new Kafka({
    clientId: "analytic-service",
    brokers: ["localhost:9094"],
})
const consumer = kafka.consumer({ groupId: "analytic-service" });

const run = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: "payment-successful", fromBeginning: true });
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const value = message.value.toString();
                const { userId, cart } = JSON.parse(value);
                const total = cart.reduce((acc,item) => acc + item.price, 0).toFixed(2)
                console.log(`analytic consumer User:${userId} paid :${total} `)
            },
        });
    } catch (error) {
        console.error("Error consuming message:", error);
    }
}
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send(err.message);
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).send("Not found");
});

const PORT = 8001;
app.listen(PORT, () => {
    console.log(`Analytic service is running on port ${PORT}`);
});
run().catch(console.error);