import db from './db.js';

/**
 * Retrieves all categories from the database.
 */
const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM public.category
        ORDER BY name;
    `;
    const result = await db.query(query);
    return result.rows;
};

/**
 * Retrieves a single category by its ID.
 */
const getCategoryById = async (categoryId) => {
    const query = `
        SELECT category_id, name
        FROM public.category
        WHERE category_id = $1;
    `;
    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Retrieves all service projects for a given category.
 */
const getProjectsByCategory = async (categoryId) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            o.name AS organization_name,
            o.organization_id
        FROM project p
        JOIN project_category pc ON p.project_id = pc.project_id
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE pc.category_id = $1
        ORDER BY p.date;
    `;
    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);
    return result.rows;
};

/**
 * Retrieves all categories for a given service project.
 */
const getCategoriesByProject = async (projectId) => {
    const query = `
        SELECT
            c.category_id,
            c.name
        FROM category c
        JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;
    const queryParams = [projectId];
    const result = await db.query(query, queryParams);
    return result.rows;
};

/**
 * Inserts a new category into the database.
 */
const addCategory = async (name) => {
    const query = `
        INSERT INTO category (name)
        VALUES ($1)
        RETURNING category_id;
    `;
    const queryParams = [name];
    const result = await db.query(query, queryParams);
    return result.rows[0];
};

/**
 * Updates an existing category in the database.
 */
const updateCategory = async (category_id, name) => {
    const query = `
        UPDATE category
        SET name = $1
        WHERE category_id = $2
        RETURNING *;
    `;
    const queryParams = [name, category_id];
    const result = await db.query(query, queryParams);
    if (result.rows.length === 0) {
        throw new Error('Category not found or update failed.');
    }
    return result.rows[0];
};

/**
 * Updates the categories assigned to a project.
 * Deletes all existing assignments and inserts the new ones.
 */
const updateProjectCategories = async (projectId, categoryIds) => {
    // Delete all existing category assignments for this project
    await db.query('DELETE FROM project_category WHERE project_id = $1', [projectId]);

    // Insert new category assignments
    if (categoryIds && categoryIds.length > 0) {
        for (const categoryId of categoryIds) {
            await db.query(
                'INSERT INTO project_category (project_id, category_id) VALUES ($1, $2)',
                [projectId, categoryId]
            );
        }
    }
};

// Export model functions
export {
    getAllCategories,
    getCategoryById,
    getProjectsByCategory,
    getCategoriesByProject,
    addCategory,
    updateCategory,
    updateProjectCategories
};