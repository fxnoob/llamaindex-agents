import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

const db = knex({
    client: "mssql",
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        options: {
            encrypt: false, // Set to true if using Azure
            trustServerCertificate: true,
        },
    },
});

export default db;
