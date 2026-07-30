import db from './db.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Registers a new user in the database with a hashed password.
 */
const registerUser = async (name, email, password) => {
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const query = `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING user_id, name, email;
    `;
    const queryParams = [name, email, password_hash];
    const result = await db.query(query, queryParams);
    return result.rows[0];
};

/**
 * Finds a user by email and returns user data including role name.
 */
const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1;
    `;
    const queryParams = [email];
    const result = await db.query(query, queryParams);
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Verifies a password against a stored hash.
 */
const verifyPassword = async (password, password_hash) => {
    return await bcrypt.compare(password, password_hash);
};

/**
 * Retrieves all registered users with their role names.
 */
const getAllUsers = async () => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name, u.created_at
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.created_at DESC;
    `;
    const result = await db.query(query);
    return result.rows;
};

// Export model functions
export { registerUser, findUserByEmail, verifyPassword, getAllUsers };