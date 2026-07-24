// Import any needed model functions
import { getAllOrganizations, getOrganizationDetails, addOrganization, updateOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Define controller functions

// Shows all organizations
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
};

// Shows the details of a single organization
const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';
    res.render('organization', { title, organizationDetails, projects });
};

// Shows the add organization form
const showAddOrganizationForm = async (req, res) => {
    const title = 'Add Organization';
    res.render('add-organization', { title, errors: [], formData: {} });
};

// Validation rules for organization form
const organizationValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Organization name is required.')
        .isLength({ min: 2, max: 150 }).withMessage('Name must be between 2 and 150 characters.'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required.')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters.'),
    body('contact_email')
        .trim()
        .notEmpty().withMessage('Contact email is required.')
        .isEmail().withMessage('Please enter a valid email address.'),
    body('logo_filename')
        .trim()
        .notEmpty().withMessage('Logo filename is required.')
];

// Processes the add organization form
const processAddOrganizationForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('add-organization', {
            title: 'Add Organization',
            errors: errors.array(),
            formData: req.body
        });
    }
    const { name, description, contact_email, logo_filename } = req.body;
    await addOrganization(name.trim(), description.trim(), contact_email.trim(), logo_filename.trim());
    req.flash('success', 'Organization added successfully!');
    res.redirect('/organizations');
};

// Shows the edit organization form
const showEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const organization = await getOrganizationDetails(organizationId);
    const title = 'Edit Organization';
    res.render('edit-organization', { title, organization, errors: [] });
};

// Processes the edit organization form
const processEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const organization = await getOrganizationDetails(organizationId);
        return res.render('edit-organization', {
            title: 'Edit Organization',
            organization: { ...organization, ...req.body },
            errors: errors.array()
        });
    }
    const { name, description, contact_email, logo_filename } = req.body;
    await updateOrganization(organizationId, name.trim(), description.trim(), contact_email.trim(), logo_filename.trim());
    req.flash('success', 'Organization updated successfully!');
    res.redirect(`/organization/${organizationId}`);
};

// Export controller functions
export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showAddOrganizationForm,
    organizationValidationRules,
    processAddOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm
};