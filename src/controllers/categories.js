// Import any needed model functions
import { getAllCategories, getCategoryById, getProjectsByCategory, addCategory, updateCategory, updateProjectCategories } from '../models/categories.js';
import { getAllProjects, getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Define controller functions

// Shows all categories
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    res.render('categories', { title, categories });
};

// Shows the details of a single category and its projects
const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategory(categoryId);
    const title = 'Category Details';
    res.render('category', { title, category, projects });
};

// Shows the add category form
const showAddCategoryForm = async (req, res) => {
    const title = 'Add Category';
    res.render('add-category', { title, errors: [], formData: {} });
};

// Validation rules for category form
const categoryValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required.')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.')
];

// Processes the add category form
const processAddCategoryForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('add-category', {
            title: 'Add Category',
            errors: errors.array(),
            formData: req.body
        });
    }
    const { name } = req.body;
    await addCategory(name.trim());
    req.flash('success', 'Category added successfully!');
    res.redirect('/categories');
};

// Shows the edit category form
const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const title = 'Edit Category';
    res.render('edit-category', { title, category, errors: [] });
};

// Processes the edit category form
const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const category = await getCategoryById(categoryId);
        return res.render('edit-category', {
            title: 'Edit Category',
            category: { ...category, ...req.body },
            errors: errors.array()
        });
    }
    const { name } = req.body;
    await updateCategory(categoryId, name.trim());
    req.flash('success', 'Category updated successfully!');
    res.redirect(`/category/${categoryId}`);
};

// Shows the assign categories to project page
const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const allCategories = await getAllCategories();
    const projectCategories = await getProjectsByCategory(projectId);
    const assignedIds = projectCategories.map(c => c.category_id);
    const title = 'Assign Categories';
    res.render('assign-categories', { title, project, allCategories, assignedIds });
};

// Processes the assign categories form
const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.id;
    const categoryIds = req.body.category_ids
        ? Array.isArray(req.body.category_ids)
            ? req.body.category_ids
            : [req.body.category_ids]
        : [];
    await updateProjectCategories(projectId, categoryIds);
    req.flash('success', 'Categories updated successfully!');
    res.redirect(`/project/${projectId}`);
};

// Export controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAddCategoryForm,
    categoryValidationRules,
    processAddCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};