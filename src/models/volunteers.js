import db from './db.js';

/**
 * Adds a user as a volunteer for a project.
 */
const addVolunteer = async (user_id, project_id) => {
    const query = `
        INSERT INTO volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
        RETURNING volunteer_id;
    `;
    const result = await db.query(query, [user_id, project_id]);
    return result.rows[0];
};

/**
 * Removes a user as a volunteer from a project.
 */
const removeVolunteer = async (user_id, project_id) => {
    const query = `
        DELETE FROM volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;
    await db.query(query, [user_id, project_id]);
};

/**
 * Checks if a user is already volunteering for a project.
 */
const isVolunteer = async (user_id, project_id) => {
    const query = `
        SELECT volunteer_id
        FROM volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;
    const result = await db.query(query, [user_id, project_id]);
    return result.rows.length > 0;
};

/**
 * Retrieves all projects a user has volunteered for.
 */
const getProjectsByVolunteer = async (user_id) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            o.name AS organization_name,
            o.organization_id
        FROM volunteer v
        JOIN project p ON v.project_id = p.project_id
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE v.user_id = $1
        ORDER BY p.date ASC;
    `;
    const result = await db.query(query, [user_id]);
    return result.rows;
};

// Export model functions
export { addVolunteer, removeVolunteer, isVolunteer, getProjectsByVolunteer };