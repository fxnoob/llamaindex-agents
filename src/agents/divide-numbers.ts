import {FunctionTool} from "llamaindex";

export const divideNumbers = FunctionTool.from(
    ({ a, b }: { a: number; b: number }) => `${a / b}`,
    {
        name: "divideNumbers",
        description: "Use this function to divide two numbers",
        parameters: {
            type: "object",
            properties: {
                a: {
                    type: "number",
                    description: "The dividend a to divide",
                },
                b: {
                    type: "number",
                    description: "The divisor b to divide by",
                },
            },
            required: ["a", "b"],
        },
    },
);
