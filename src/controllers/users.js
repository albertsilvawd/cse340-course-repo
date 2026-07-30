import { registerUser, findUserByEmail, verifyPassword } from '../models/users.js';
import { body, validationResult } from 'express-validator';

// Define controller functions

// Shows the registration form
const showRegisterForm = (req, res) => {
    res.render('register', { title: 'Create Account', errors: [], formData: {} });
};

// Validation rules for registration
const registerValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required.')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters.'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Please enter a valid email address.'),
    body('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('confirm_password')
        .notEmpty().withMessage('Please confirm your password.')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match.');
            }
            return true;
        })
];

// Processes the registration form
const processRegisterForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('register', {
            title: 'Create Account',
            errors: errors.array(),
            formData: req.body
        });
    }
    const { name, email, password } = req.body;
    try {
        await registerUser(name.trim(), email.trim().toLowerCase(), password);
        req.flash('success', 'Account created successfully! Please log in.');
        res.redirect('/login');
    } catch (error) {
        if (error.message.includes('unique')) {
            return res.render('register', {
                title: 'Create Account',
                errors: [{ msg: 'An account with this email already exists.' }],
                formData: req.body
            });
        }
        throw error;
    }
};

// Shows the login form
const showLoginForm = (req, res) => {
    res.render('login', { title: 'Sign In', errors: [], formData: {} });
};

// Validation rules for login
const loginValidationRules = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Please enter a valid email address.'),
    body('password')
        .notEmpty().withMessage('Password is required.')
];

// Processes the login form
const processLoginForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('login', {
            title: 'Sign In',
            errors: errors.array(),
            formData: req.body
        });
    }
    const { email, password } = req.body;
    const user = await findUserByEmail(email.trim().toLowerCase());
    if (!user) {
        return res.render('login', {
            title: 'Sign In',
            errors: [{ msg: 'Invalid email or password.' }],
            formData: req.body
        });
    }
    const passwordMatch = await verifyPassword(password, user.password_hash);
    if (!passwordMatch) {
        return res.render('login', {
            title: 'Sign In',
            errors: [{ msg: 'Invalid email or password.' }],
            formData: req.body
        });
    }
    // Save user to session
    req.session.user = {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role_name: user.role_name
    };
    req.flash('success', `Welcome back, ${user.name}!`);
    res.redirect('/');
};

// Logs the user out
const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

// Middleware to require login
const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access this page.');
        return res.redirect('/login');
    }
    next();
};

/**
 * Middleware factory to require specific role for route access.
 * Returns middleware that checks if user has the required role.
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }
        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }
        // User has required role, continue
        next();
    };
};

// Export controller functions
export {
    showRegisterForm,
    registerValidationRules,
    processRegisterForm,
    showLoginForm,
    loginValidationRules,
    processLoginForm,
    logout,
    requireLogin,
    requireRole
};