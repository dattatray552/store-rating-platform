const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// ===============================
// SIGNUP
// ===============================
const signup = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

        // 1. Check required fields
        if (!name || !email || !password || !address) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // 2. Validate name length
        if (name.length < 20 || name.length > 60) {
            return res.status(400).json({
                message: "Name must be between 20 and 60 characters"
            });
        }

        // 3. Validate address
        if (address.length > 400) {
            return res.status(400).json({
                message: "Address cannot exceed 400 characters"
            });
        }

        // 4. Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        // 5. Validate password
        // 8-16 characters
        // At least one uppercase
        // At least one special character
        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,16}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
            });
        }

        // 6. Check if email already exists
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // 7. Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // 8. Create user
        const result = await pool.query(
            `INSERT INTO users
            (name, email, password_hash, address, role)
            VALUES ($1, $2, $3, $4, 'USER')
            RETURNING id, name, email, address, role`,
            [name, email, passwordHash, address]
        );

        // 9. Send response
        return res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Signup error:", error.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// LOGIN
// ===============================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // 2. Find user by email
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        // 3. User not found
        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        // 4. Compare entered password with hashed password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password_hash
        );

        // 5. Wrong password
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 6. Create JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // 7. Send response
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// CHANGE PASSWORD
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required"
            });
        }

        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,16}$/;

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message:
                    "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
            });
        }

        const result = await pool.query(
            "SELECT password_hash FROM users WHERE id = $1",
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            result.rows[0].password_hash
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Current password is incorrect"
            });
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        await pool.query(
            `UPDATE users
             SET password_hash = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2`,
            [newPasswordHash, userId]
        );

        return res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error("Change password error:", error.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
};
// ===============================
// EXPORT FUNCTIONS
// ===============================
module.exports = {
    signup,
    login,
    changePassword
};