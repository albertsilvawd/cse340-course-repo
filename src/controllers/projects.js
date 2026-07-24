// Import any needed model functions
import { getAllProjects, getUpcomingProjects, getProjectDetails, addProject, updateProject } from '../models/projects.js';
import { getCategoriesByProject } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

// Number of upcoming projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define controller functions

// Shows the next upcoming service projects
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects });
};

// Shows the details of a single service project including its categories
const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const categories = await getCategoriesByProject(projectId);
    const title = 'Service Project Details';
    res.render('project', { title, project, categories });
};

// Shows the add project form
const showAddProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add Service Project';
    res.render('add-project', { title, organizations, errors: [], formData: {} });
};

// Validation rules for project form
const projectValidationRules = [
    body('title')
        .trim()
        .notEmpty().withMessage('Project title is required.')
        .isLength({ min: 2, max: 255 }).withMessage('Title must be between 2 and 255 characters.'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required.')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters.'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required.'),
    body('date')
        .notEmpty().withMessage('Date is required.')
        .isDate().withMessage('Please enter a valid date.'),
    body('organization_id')
        .notEmpty().withMessage('Please select an organization.')
];

// Processes the add project form
const processAddProjectForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const organizations = await getAllOrganizations();
        return res.render('add-project', {
            title: 'Add Service Project',
            organizations,
            errors: errors.array(),
            formData: req.body
        });
    }
    const { organization_id, title, description, location, date } = req.body;
    await addProject(organization_id, title.trim(), description.trim(), location.trim(), date);
    req.flash('success', 'Service project added successfully!');
    res.redirect('/projects');
};

// Shows the edit form for a service project
const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();
    const title = 'Edit Service Project';
    res.render('edit-project', { title, project, organizations, errors: [] });
};

// Processes the edit form submission
const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const project = await getProjectDetails(projectId);
        const organizations = await getAllOrganizations();
        return res.render('edit-project', {
            title: 'Edit Service Project',
            project: { ...project, ...req.body },
            organizations,
            errors: errors.array()
        });
    }
    const { organization_id, title, description, location, date } = req.body;
    await updateProject(projectId, organization_id, title.trim(), description.trim(), location.trim(), date);
    req.flash('success', 'Service project updated successfully!');
    res.redirect(`/project/${projectId}`);
};

// Export controller functions
export {
    showProjectsPage,
    showProjectDetailsPage,
    showAddProjectForm,
    projectValidationRules,
    processAddProjectForm,
    showEditProjectForm,
    processEditProjectForm
};