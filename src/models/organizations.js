import db from './db.js';

/**
 * Retrieves all organizations from the database.
 */
const getAllOrganizations = async () => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM public.organization
        ORDER BY name;
    `;
    const result = await db.query(query);
    return result.rows;
};

/**
 * Retrieves a single organization by its ID.
 */
const getOrganizationDetails = async (organizationId) => {
    const query = `
        SELECT
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM organization
        WHERE organization_id = $1;
    `;
    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Inserts a new organization into the database.
 */
const addOrganization = async (name, description, contact_email, logo_filename) => {
    const query = `
        INSERT INTO organization (name, description, contact_email, logo_filename)
        VALUES ($1, $2, $3, $4)
        RETURNING organization_id;
    `;
    const queryParams = [name, description, contact_email, logo_filename];
    const result = await db.query(query, queryParams);
    return result.rows[0];
};

/**
 * Updates an existing organization in the database.
 */
const updateOrganization = async (organization_id, name, description, contact_email, logo_filename) => {
    const query = `
        UPDATE organization
        SET name = $1,
            description = $2,
            contact_email = $3,
            logo_filename = $4
        WHERE organization_id = $5
        RETURNING *;
    `;
    const queryParams = [name, description, contact_email, logo_filename, organization_id];
    const result = await db.query(query, queryParams);
    if (result.rows.length === 0) {
        throw new Error('Organization not found or update failed.');
    }
    return result.rows[0];
};

// Export model functions
export { getAllOrganizations, getOrganizationDetails, addOrganization, updateOrganization };