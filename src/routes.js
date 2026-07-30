import express from 'express';

import { showHomePage } from './controllers/index.js';
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showAddOrganizationForm,
    organizationValidationRules,
    processAddOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizations.js';
import {
    showProjectsPage,
    showProjectDetailsPage,
    showAddProjectForm,
    projectValidationRules,
    processAddProjectForm,
    showEditProjectForm,
    processEditProjectForm
} from './controllers/projects.js';
import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAddCategoryForm,
    categoryValidationRules,
    processAddCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm
} from './controllers/categories.js';
import {
    showRegisterForm,
    registerValidationRules,
    processRegisterForm,
    showLoginForm,
    loginValidationRules,
    processLoginForm,
    logout,
    requireLogin,
    requireRole,
    showUsersPage
} from './controllers/users.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// Public routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// Auth routes
router.get('/register', showRegisterForm);
router.post('/register', registerValidationRules, processRegisterForm);
router.get('/login', showLoginForm);
router.post('/login', loginValidationRules, processLoginForm);
router.get('/logout', logout);

// Admin only — users list
router.get('/users', requireRole('admin'), showUsersPage);

// Admin only routes — organizations (MUST come before /:id)
router.get('/organization/add', requireRole('admin'), showAddOrganizationForm);
router.post('/organization/add', requireRole('admin'), organizationValidationRules, processAddOrganizationForm);

// Organization detail (public)
router.get('/organization/:id', showOrganizationDetailsPage);

// Edit organization (admin only)
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidationRules, processEditOrganizationForm);

// Admin only routes — projects (MUST come before /:id)
router.get('/project/add', requireRole('admin'), showAddProjectForm);
router.post('/project/add', requireRole('admin'), projectValidationRules, processAddProjectForm);

// Project detail (public)
router.get('/project/:id', showProjectDetailsPage);

// Edit project (admin only)
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidationRules, processEditProjectForm);

// Admin only routes — categories (MUST come before /:id)
router.get('/category/add', requireRole('admin'), showAddCategoryForm);
router.post('/category/add', requireRole('admin'), categoryValidationRules, processAddCategoryForm);

// Category detail (public)
router.get('/category/:id', showCategoryDetailsPage);

// Edit category (admin only)
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidationRules, processEditCategoryForm);

// Assign categories (admin only)
router.get('/assign-categories/:id', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:id', requireRole('admin'), processAssignCategoriesForm);

// Error-handling routes
router.get('/test-error', testErrorPage);

export default router;