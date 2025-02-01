import {FunctionTool} from "llamaindex";

export const sumNumbers = FunctionTool.from(
    ({ a, b }: { a: number; b: number }) => `${a + b}`,
    {
        name: "sumNumbers",
        description: "Use this function to sum two numbers",
        parameters: {
            type: "object",
            properties: {
                a: {
                    type: "number",
                    description: "The first number",
                },
                b: {
                    type: "number",
                    description: "The second number",
                },
            },
            required: ["a", "b"],
        },
    },
);
