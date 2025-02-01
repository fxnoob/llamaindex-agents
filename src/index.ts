import 'dotenv/config';
import { Gemini, GEMINI_MODEL, LLMAgent } from "llamaindex";
import { agentTools } from "./agents";
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('SIGINT', () => {
    console.log("\nGracefully shutting down.");
    rl.close();
    process.exit(0);
});

async function main() {
    const gemini = new Gemini({
        model: GEMINI_MODEL.GEMINI_PRO,
    });

    const askQuestion = () => {
        const agent = new LLMAgent({
            llm: gemini,
            tools: agentTools,
        });
        rl.question("Enter your query (or type 'exit' to quit): ", async (userInput: string) => {
            if (userInput.trim().toLowerCase() === 'exit') {
                console.log("Done");
                rl.close();
                return;
            }
            try {
                const response = await agent.chat({
                    message: userInput,
                });
                console.log("Response:", response?.message?.content);
            } catch (err) {
                console.error("Error during chat:", err);
            }
            askQuestion();
        });
    };

    askQuestion();
}

main();
