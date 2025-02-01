import { FunctionTool } from "llamaindex";
import { getDatabaseSchema } from "../sql/parser"; // adjust the path as needed

export const listTablesWithRelation = FunctionTool.from(
    async ({ relation }: { relation: string }) => {
        const schema = await getDatabaseSchema();

        const matchingTables = Object.keys(schema).filter((tableName) => {
            const tableInfo = schema[tableName];
            return tableInfo.foreignKeys.some(
                (fk) => fk.refTable.toLowerCase() === relation.toLowerCase()
            );
        });

        if (matchingTables.length === 0) {
            return `No tables found with a relation to '${relation}'.`;
        }

        return `Tables with a relation to '${relation}': ${matchingTables.join(", ")}`;
    },
    {
        name: "listTablesWithRelation",
        description: "Use this function to list all tables that have a foreign key relation with a specified table (e.g., 'property').",
        parameters: {
            type: "object",
            properties: {
                relation: {
                    type: "string",
                    description: "The name of the referenced table to filter by (e.g., 'property').",
                },
            },
            required: ["relation"],
        },
    }
);
