-- Create organization table
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- Insert sample organizations
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders',
 'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
 'info@brightfuturebuilders.org',
 'brightfuture-logo.svg'),
('GreenHarvest Growers',
 'An urban farming collective promoting food sustainability and education in local neighborhoods.',
 'contact@greenharvest.org',
 'greenharvest-logo.svg'),
('UnityServe Volunteers',
 'A volunteer coordination group supporting local charities and service initiatives.',
 'hello@unityserve.org',
 'unityserve-logo.svg');

-- Create project table
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organization(organization_id)
);

-- Insert sample projects
INSERT INTO project (organization_id, title, description, location, date)
VALUES
(1, 'Park Cleanup', 'Join us to clean up local parks and make them beautiful!', 'City Park', '2026-08-01'),
(1, 'Build a Garden', 'Help build a community garden for local residents.', 'Downtown', '2026-08-15'),
(1, 'Home Repair', 'Volunteer to repair homes for elderly residents.', 'Westside', '2026-09-01'),
(1, 'Tree Planting', 'Plant trees to improve the local environment.', 'Riverside', '2026-09-15'),
(1, 'School Renovation', 'Help renovate a local school building.', 'Eastside', '2026-10-01'),
(2, 'Food Drive', 'Help collect and distribute food to those in need.', 'Community Center', '2026-08-05'),
(2, 'Urban Farming Workshop', 'Learn how to grow food in urban environments.', 'Greenhouse', '2026-08-20'),
(2, 'Harvest Festival', 'Celebrate the harvest with the community.', 'Town Square', '2026-09-05'),
(2, 'Cooking Class', 'Teach healthy cooking with locally grown food.', 'Kitchen Lab', '2026-09-20'),
(2, 'Composting Drive', 'Teach composting techniques to reduce waste.', 'Community Garden', '2026-10-10'),
(3, 'Community Tutoring', 'Volunteer to tutor students in various subjects.', 'Library', '2026-08-10'),
(3, 'Senior Companion', 'Spend time with elderly residents at care homes.', 'Care Home', '2026-08-25'),
(3, 'Charity Run', 'Run to raise funds for local charities.', 'City Track', '2026-09-10'),
(3, 'Blood Drive', 'Donate blood to help those in need.', 'Medical Center', '2026-09-25'),
(3, 'Shelter Support', 'Help support local homeless shelters.', 'Downtown Shelter', '2026-10-15');

-- Create category table
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Insert sample categories
INSERT INTO category (name) VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');

-- Create junction table for many-to-many relationship between project and category
CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES project(project_id),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);

-- Associate projects with categories
INSERT INTO project_category (project_id, category_id) VALUES
(1, 1), (1, 3),
(2, 1), (2, 3),
(3, 3), (3, 4),
(4, 1),
(5, 3),
(6, 3), (6, 4),
(7, 1), (7, 2),
(8, 3),
(9, 2), (9, 4),
(10, 1),
(11, 2),
(12, 3), (12, 4),
(13, 3),
(14, 4),
(15, 3);