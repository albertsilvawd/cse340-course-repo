// Import any needed model functions
import { getAllProjects, getUpcomingProjects, getProjectDetails, updateProject } from '../models/projects.js';
import { getCategoriesByProject } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';

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

// Shows the edit form for a service project
const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();
    const title = 'Edit Service Project';
    res.render('edit-project', { title, project, organizations });
};

// Processes the edit form submission
const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const { organization_id, title, description, location, date } = req.body;
    await updateProject(projectId, organization_id, title, description, location, date);
    res.redirect(`/project/${projectId}`);
};

// Export controller functions
export { showProjectsPage, showProjectDetailsPage, showEditProjectForm, processEditProjectForm };