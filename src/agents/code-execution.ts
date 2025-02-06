import { FunctionTool } from "llamaindex";
import { exec } from "child_process";

export const jsCodeExecutor = FunctionTool.from(
    async ({ code }: { code: string }) => {
        return new Promise((resolve) => {
            exec(`node -e "${code.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
                if (error) {
                    resolve(`Error: ${stderr || error.message}`);
                } else {
                    resolve(`Output: ${stdout}`);
                }
            });
        });
    },
    {
        name: "jsCodeExecutor",
        description: "Executes JavaScript code and returns the output.",
        parameters: {
            type: "object",
            properties: {
                code: {
                    type: "string",
                    description: "The JavaScript code snippet to execute.",
                },
            },
            required: ["code"],
        },
    }
);
