require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("./src/config/db");

const createAdmin = async () => {
    try {
        const name = "System Administrator";
        const email = "admin@gmail.com";
        const password = "Admin@1234";
        const address = "Pune, Maharashtra";

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert admin
        const result = await pool.query(
            `INSERT INTO users
            (name, email, password_hash, address, role)
            VALUES ($1, $2, $3, $4, 'ADMIN')
            RETURNING id, name, email, address, role`,
            [name, email, passwordHash, address]
        );

        console.log("Admin created successfully:");
        console.log(result.rows[0]);

    } catch (error) {
        console.error("Error creating admin:", error.message);
    } finally {
        await pool.end();
    }
};

createAdmin();