require("dotenv").config();

const { Client } = require("pg");

const client = new Client({
    user: "postgres",
    host: "localhost",
    password: "Dattasul@123",
    port: 5432,
    database: "postgres"
});

async function createDatabase() {
    try {
        await client.connect();

        console.log("Connected to PostgreSQL");

        await client.query(`
            CREATE DATABASE store_rating_db
        `);

        console.log("Database created successfully");

        await client.end();
    } catch (error) {
        console.error("Error:", error.message);
        await client.end();
    }
}

createDatabase();