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
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// Routes for adding an organization (MUST come before /:id)
router.get('/organization/add', showAddOrganizationForm);
router.post('/organization/add', organizationValidationRules, processAddOrganizationForm);

// Routes for organization details and editing
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidationRules, processEditOrganizationForm);

// Routes for adding a project (MUST come before /:id)
router.get('/project/add', showAddProjectForm);
router.post('/project/add', projectValidationRules, processAddProjectForm);

// Route for project details page
router.get('/project/:id', showProjectDetailsPage);

// Routes for editing a project
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidationRules, processEditProjectForm);

// Routes for adding a category (MUST come before /:id)
router.get('/category/add', showAddCategoryForm);
router.post('/category/add', categoryValidationRules, processAddCategoryForm);

// Routes for category details and editing
router.get('/category/:id', showCategoryDetailsPage);
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', categoryValidationRules, processEditCategoryForm);

// Routes for assigning categories to a project
router.get('/assign-categories/:id', showAssignCategoriesForm);
router.post('/assign-categories/:id', processAssignCategoriesForm);

// Error-handling routes
router.get('/test-error', testErrorPage);

export default router;