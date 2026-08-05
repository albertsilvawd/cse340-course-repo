// Import any needed model functions
import { addVolunteer, removeVolunteer, getProjectsByVolunteer } from '../models/volunteers.js';

// Define controller functions

// Adds the logged-in user as a volunteer for a project
const processAddVolunteer = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;
    await addVolunteer(userId, projectId);
    req.flash('success', 'You have signed up to volunteer for this project!');
    res.redirect(`/project/${projectId}`);
};

// Removes the logged-in user as a volunteer from a project
const processRemoveVolunteer = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;
    await removeVolunteer(userId, projectId);
    req.flash('success', 'You have been removed as a volunteer for this project.');
    res.redirect(`/project/${projectId}`);
};

// Removes volunteer from dashboard
const processRemoveVolunteerFromDashboard = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;
    await removeVolunteer(userId, projectId);
    req.flash('success', 'You have been removed as a volunteer for this project.');
    res.redirect('/dashboard');
};

// Shows the dashboard with user's volunteered projects
const showDashboard = async (req, res) => {
    const userId = req.session.user.user_id;
    const projects = await getProjectsByVolunteer(userId);
    const title = 'My Dashboard';
    res.render('dashboard', { title, projects });
};

// Export controller functions
export { processAddVolunteer, processRemoveVolunteer, processRemoveVolunteerFromDashboard, showDashboard };