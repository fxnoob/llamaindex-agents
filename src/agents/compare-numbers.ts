import { FunctionTool } from "llamaindex";

export const compareNumbers = FunctionTool.from(
    ({ num1, num2 }: { num1: number; num2: number }) => {
        if (num1 > num2) {
            return `${num1} is greater than ${num2}`;
        } else if (num1 < num2) {
            return `${num2} is greater than ${num1}`;
        } else {
            return `${num1} and ${num2} are equal`;
        }
    },
    {
        name: "compareNumbers",
        description: "Compares two numbers and returns the relationship (greater, smaller, or equal)",
        parameters: {
            type: "object",
            properties: {
                num1: {
                    type: "number",
                    description: "The first number to compare",
                },
                num2: {
                    type: "number",
                    description: "The second number to compare",
                },
            },
            required: ["num1", "num2"],
        },
    }
);
