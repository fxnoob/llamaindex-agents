import {FunctionTool} from "llamaindex";
import { getSchema } from '../sql/parser'

export const viewSchema = FunctionTool.from(
    async ({ dummy }: { dummy: string }): Promise<string> => {
        return getSchema().catch((error: unknown) => {
                if (error instanceof Error) {
                    return error.message;
                }
                return "Unknown Error Occurred";
            });
    },
    {
        name: "viewSchema",
        description: "Use this function to get all the database tables along with their columns and types",
        parameters: {
            type: "object",
            properties: {
                dummy: {
                    type: "string",
                    description:
                        "This is a placeholder parameter and will be ignored",
                },
            },
            required: ["dummy"],
        },
    }
);
