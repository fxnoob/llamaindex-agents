import {FunctionTool} from "llamaindex";
import {getGoFunctionSignatures} from "./runGoExecutable";
import {callLLM} from '../helpers/call-llm';

export const queryGoFunctions = FunctionTool.from(
    async ({ query }: { query: string }) => {
        console.log("List func signatures...")
        const functionSignatures: string = getGoFunctionSignatures();
        const prompt = `
You are given a list of Go function signatures:

${functionSignatures}

Identify and return only the function name(s) that exactly match or closely relate to the following query:

"${query}"

Rules:
- Return only function names that exist in the provided list.
- Do not generate or infer function names that are not explicitly listed.
- If no relevant function is found, return an empty response.
- Do not include any explanations, comments, or additional text—only return matching function names.
`

        console.log("Thinking...")
        try {
            const res =  await callLLM(prompt)
            console.log({res})
            return res
        } catch (e: any) {
            console.log("error in queryGoFunctions", {e})
            return ""
        }
    },
    {
        name: "queryGoFunctions",
        description: "This agent checks if a function exists in a Go codebase based on a given description.",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "A layman’s description of the function to check for existence.",
                },
            },
            required: ["query"],
        },
    }
);
