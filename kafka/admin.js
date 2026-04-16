import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "kafka-service",
    brokers: ["localhost:9094"],
})

const admin = kafka.admin();

async function run() {
    await admin.connect();
    
    const existingTopics = await admin.listTopics();
    const requiredTopics = ["payment-successful", "order-successful", "email-successful"];
    
    const topicsToCreate = requiredTopics
        .filter(topic => !existingTopics.includes(topic))
        .map(topic => ({ topic }));
        
    if (topicsToCreate.length > 0) {
        await admin.createTopics({ topics: topicsToCreate });
        console.log("Topics created:", topicsToCreate.map(t => t.topic));
    } else {
        console.log("All topics already exist.");
    }
    
    await admin.disconnect();
}

run().catch(console.error);