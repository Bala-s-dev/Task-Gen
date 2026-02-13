import Groq from "groq-sdk";
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

async function testGroq() {
    try {
        if (!process.env.GROQ_API_KEY) {
            throw new Error("❌ GROQ_API_KEY is missing in your .env file");
        }

        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        console.log("✅ Sending request to Groq...");

        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "user",
                    content: "Say hello in one short sentence.",
                },
            ],
            max_tokens: 50,
        });

        console.log("\n=== Groq Response ===");
        console.log(response.choices[0].message.content);
        console.log("====================\n");

        console.log("✅ Groq API is working correctly!");
    } catch (err) {
        console.error("\n❌ Groq API Test Failed:");
        console.error(err.message || err);
    }
}

testGroq();
