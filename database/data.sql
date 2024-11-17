CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE task_status AS ENUM ('NOT STARTED', 'IN PROGRESS', 'COMPLETED');
CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE project_status AS ENUM ('IN PROGRESS', 'COMPLETED');

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE projects (
    project_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status project_status NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

CREATE TABLE tasks (
    task_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assigned_project_id UUID REFERENCES projects(project_id) ON DELETE CASCADE NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status task_status NOT NULL,
    priority task_priority NOT NULL,
    due_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assigned_project_id UUID REFERENCES projects(project_id) ON DELETE CASCADE NOT NULL,
    users_user_id UUID REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    tasks_task_id UUID REFERENCES tasks(task_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- tabela pośrednia users-tasks
CREATE TABLE users_tasks (
    users_user_id UUID REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    tasks_task_id UUID REFERENCES tasks(task_id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (users_user_id, tasks_task_id)
);

--tabela pośrednia users-projects
CREATE TABLE project_members (
    users_user_id UUID REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    projects_project_id UUID REFERENCES projects(project_id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (projects_project_id, users_user_id)
);

CREATE TABLE chats (
    chat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tasks_task_id UUID REFERENCES tasks(task_id) ON DELETE CASCADE,
    projects_project_id UUID REFERENCES projects(project_id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

--tabela pośrednia do users-chats
CREATE TABLE messages (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    chat_id UUID REFERENCES chats(chat_id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


INSERT INTO users (user_id, first_name, last_name, password, email, username) VALUES 
('b3c6063d-ce04-413e-b6c6-ae875eeb454a', 'John', 'Doe', '1qazXSW@', 'johndoe@mail.com', 'john_doe'),
('5ad0c3c7-759c-4844-8322-dd9e16f0e9b0', 'Jane', 'Smith', '1qazXSW@', 'janesmith@example.com', 'jane_smith'),
('9b6d95b7-1b0f-4c0c-9cd9-cfa00a96f6ac', 'Alexis', 'Hernandez', '1qazXSW@', 'alexis.hernandez@example.com', 'alexis_hernandez'),
('d64a64b5-278d-4ac7-b9fa-cf6b2da5b7f2', 'Ella', 'Lopez', '1qazXSW@', 'ella.lopez@example.com', 'ella_lopez'),
('8d1f7f5e-0b8f-4a9f-b7c4-0c61a8f43b32', 'Michael', 'Johnson', '1qazXSW@', 'michael.johnson@example.com', 'michael_johnson'),
('2c9b0e0a-37b8-4e62-bd1c-3b750cf6fdd1', 'Anna', 'Williams', '1qazXSW@', 'anna.williams@example.com', 'anna_williams'),
('fd9397f3-1e3e-4d98-bad8-f5986b3655a2', 'Olivia', 'Brown', '1qazXSW@', 'olivia.brown@example.com', 'olivia_brown'),
('ee1d08d6-c9ad-4c6f-9ff7-76b10be973fc', 'Sophia', 'Jones', '1qazXSW@', 'sophia.jones@example.com', 'sophia_jones'),
('5fc9c20a-b7f1-44db-85b0-7fa5c3cb9c16', 'Isabella', 'Garcia', '1qazXSW@', 'isabella.garcia@example.com', 'isabella_garcia'),
('c1e5c6be-15f6-468b-9f37-9cc710ad7f27', 'Mia', 'Martinez', '1qazXSW@', 'mia.martinez@example.com', 'mia_martinez'),
('358e431e-92d4-442f-8318-e2079fbbf10f', 'Emily', 'Davis', '1qazXSW@', 'emily.davis@example.com', 'emily_davis'),
('06b8d207-b9b3-4308-9249-9228b383c917', 'Elizabeth', 'Rodriguez', '1qazXSW@', 'elizabeth.rodriguez@example.com', 'elizabeth_rodriguez');

INSERT INTO projects (project_id, owner_id, project_name, description, status, created_at, start_date, end_date) VALUES 
('a3c4f7f7-b48c-4c90-bfc1-d03277561ef4', 'b3c6063d-ce04-413e-b6c6-ae875eeb454a', 'Website Redesign', 'Complete redesign of the company website to improve UX/UI.', 'IN PROGRESS', '2024-10-14 10:00:00', '2024-10-14', '2025-01-25'),
('cc687098-fb51-4f28-b95e-c9b7b4241d58', '8d1f7f5e-0b8f-4a9f-b7c4-0c61a8f43b32', 'Mobile App Development', 'Development of a new mobile application for iOS and Android.', 'COMPLETED', '2024-09-01 10:00:00', '2024-09-01', '2024-10-18'),
('40424d07-1902-47f5-bf5e-9085ca8310bc', 'fd9397f3-1e3e-4d98-bad8-f5986b3655a2', 'E-commerce Platform', 'Building a new e-commerce platform with advanced features.', 'COMPLETED', '2024-03-01 10:00:00', '2024-03-01', '2024-08-01'),
('2c9fcdc9-b591-41d0-9152-c5e4eec7b158', '5fc9c20a-b7f1-44db-85b0-7fa5c3cb9c16', 'Cloud Migration', 'Migrating all company data and applications to the cloud.', 'IN PROGRESS', '2024-11-01 10:00:00', '2024-11-01', '2025-01-20'),
('f9712337-fb38-4b7f-b080-51b6a04eec6d', '5ad0c3c7-759c-4844-8322-dd9e16f0e9b0', 'Marketing Campaign', 'Launching a new marketing campaign to increase brand awareness.', 'IN PROGRESS', '2024-10-01 10:00:00', '2024-10-01', '2024-12-15');

INSERT INTO tasks (task_id, assigned_project_id, task_name, description, status, priority, due_date) VALUES 
('9d837fcb-b563-4895-8d52-e544623c1fc3', 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4', 'Develop Header', 'Develop Header', 'IN PROGRESS', 'HIGH', '2025-01-20'),
('87007e51-34cd-4e8d-8b7f-535e3481cb9b', 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4', 'Develop Sidebar', 'Develop Sidebar', 'NOT STARTED', 'MEDIUM', '2024-12-16'),
('e6d61c4b-0e9c-44d7-8d9e-d1531e2f64e1', 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4', 'Develop API', 'Develop API', 'COMPLETED', 'LOW', '2024-11-29'),
('ccfc6b4e-5d31-4a79-b2a6-2eab6cf153fc', 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4', 'Database Design', 'Database Design', 'COMPLETED', 'MEDIUM', '2024-12-09'),
('3048a872-2c4f-46b1-bb2f-35a27be4ed65', 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4', 'Testing', 'Testing', 'IN PROGRESS', 'HIGH', '2025-01-09');

INSERT INTO notifications (notification_id, assigned_project_id, users_user_id, tasks_task_id, message, created_at) VALUES 
('e2e31222-488b-47ac-9f70-205105f0b3fa', 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4', 'b3c6063d-ce04-413e-b6c6-ae875eeb454a', NULL, 'User John Doe has joined the project "Website Redesign"', '2024-10-14 10:00:00'),
('a7f2f85c-9860-4b38-b556-2515769c1748', 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4', '5ad0c3c7-759c-4844-8322-dd9e16f0e9b0', '9d837fcb-b563-4895-8d52-e544623c1fc3', 'User Jane Smith has modified the task "Develop Header"', '2024-11-13 11:30:00'),
('17d3a37a-5cc7-43a4-bb44-c6b8b9ca9a80', 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4', '358e431e-92d4-442f-8318-e2079fbbf10f', 'e6d61c4b-0e9c-44d7-8d9e-d1531e2f64e1', 'User Alexis Hernandez has completed the task "Develop API"', '2024-11-14 14:45:00'),
('fee50417-bbda-4fe2-947c-81d02ee12d5c', 'cc687098-fb51-4f28-b95e-c9b7b4241d58', '06b8d207-b9b3-4308-9249-9228b383c917', NULL, 'User Ella Lopez has joined the project "Mobile App Development"', '2024-09-03 09:15:00'),
('f36fa26d-a08c-47d2-bf86-eacf6c7680b0', 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4', '9b6d95b7-1b0f-4c0c-9cd9-cfa00a96f6ac', 'ccfc6b4e-5d31-4a79-b2a6-2eab6cf153fc', 'User Michael Johnson has modified the task "Database Design"', '2024-11-03 16:00:00');

INSERT INTO project_members (users_user_id, projects_project_id) VALUES 
('b3c6063d-ce04-413e-b6c6-ae875eeb454a', 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4'), 
('5ad0c3c7-759c-4844-8322-dd9e16f0e9b0', 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4'), 
('358e431e-92d4-442f-8318-e2079fbbf10f', 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4'), 
('06b8d207-b9b3-4308-9249-9228b383c917', 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4'), 
('8d1f7f5e-0b8f-4a9f-b7c4-0c61a8f43b32', 'cc687098-fb51-4f28-b95e-c9b7b4241d58'), 
('2c9b0e0a-37b8-4e62-bd1c-3b750cf6fdd1', 'cc687098-fb51-4f28-b95e-c9b7b4241d58'), 
('b3c6063d-ce04-413e-b6c6-ae875eeb454a', 'cc687098-fb51-4f28-b95e-c9b7b4241d58'), 
('fd9397f3-1e3e-4d98-bad8-f5986b3655a2', '40424d07-1902-47f5-bf5e-9085ca8310bc'), 
('ee1d08d6-c9ad-4c6f-9ff7-76b10be973fc', '40424d07-1902-47f5-bf5e-9085ca8310bc'), 
('5fc9c20a-b7f1-44db-85b0-7fa5c3cb9c16', '2c9fcdc9-b591-41d0-9152-c5e4eec7b158'), 
('c1e5c6be-15f6-468b-9f37-9cc710ad7f27', '2c9fcdc9-b591-41d0-9152-c5e4eec7b158'), 
('b3c6063d-ce04-413e-b6c6-ae875eeb454a', 'f9712337-fb38-4b7f-b080-51b6a04eec6d'), 
('5ad0c3c7-759c-4844-8322-dd9e16f0e9b0', 'f9712337-fb38-4b7f-b080-51b6a04eec6d');

INSERT INTO users_tasks (users_user_id, tasks_task_id) VALUES 
('b3c6063d-ce04-413e-b6c6-ae875eeb454a', '9d837fcb-b563-4895-8d52-e544623c1fc3'), 
('5ad0c3c7-759c-4844-8322-dd9e16f0e9b0', '9d837fcb-b563-4895-8d52-e544623c1fc3'), 
('06b8d207-b9b3-4308-9249-9228b383c917', '9d837fcb-b563-4895-8d52-e544623c1fc3'), 
('9b6d95b7-1b0f-4c0c-9cd9-cfa00a96f6ac', '87007e51-34cd-4e8d-8b7f-535e3481cb9b'), 
('d64a64b5-278d-4ac7-b9fa-cf6b2da5b7f2', '87007e51-34cd-4e8d-8b7f-535e3481cb9b'), 
('8d1f7f5e-0b8f-4a9f-b7c4-0c61a8f43b32', 'e6d61c4b-0e9c-44d7-8d9e-d1531e2f64e1'), 
('2c9b0e0a-37b8-4e62-bd1c-3b750cf6fdd1', 'e6d61c4b-0e9c-44d7-8d9e-d1531e2f64e1'), 
('fd9397f3-1e3e-4d98-bad8-f5986b3655a2', 'ccfc6b4e-5d31-4a79-b2a6-2eab6cf153fc'), 
('ee1d08d6-c9ad-4c6f-9ff7-76b10be973fc', 'ccfc6b4e-5d31-4a79-b2a6-2eab6cf153fc'), 
('5fc9c20a-b7f1-44db-85b0-7fa5c3cb9c16', '3048a872-2c4f-46b1-bb2f-35a27be4ed65'), 
('c1e5c6be-15f6-468b-9f37-9cc710ad7f27', '3048a872-2c4f-46b1-bb2f-35a27be4ed65');

INSERT INTO chats (chat_id, projects_project_id, tasks_task_id) VALUES 
('3d889766-f5ee-494a-a76a-e2f7bf43fa37', 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4', '9d837fcb-b563-4895-8d52-e544623c1fc3'),
('0eefc336-670d-4555-8c0e-eaf194c22653', 'a3c4f7f7-b48c-4c90-bfc1-d03277561ef4', NULL);

INSERT INTO messages (message_id, user_id, chat_id, message, created_at) VALUES 
('57447bd7-4c3a-4fd8-815a-1b9ca9885025', 'b3c6063d-ce04-413e-b6c6-ae875eeb454a', '3d889766-f5ee-494a-a76a-e2f7bf43fa37', 'Started working on the header.', '2024-11-12 10:00:00'),
('7665a4c3-2c87-4926-87db-2e1dbe28bbb1', '8d1f7f5e-0b8f-4a9f-b7c4-0c61a8f43b32', '0eefc336-670d-4555-8c0e-eaf194c22653', 'Completed the API development.', '2024-11-12 14:45:00'),
('8bf29671-b8ce-42ef-8dbf-516ac8e171ca', '2c9b0e0a-37b8-4e62-bd1c-3b750cf6fdd1', '3d889766-f5ee-494a-a76a-e2f7bf43fa37', 'Reviewed the database design.', '2024-11-13 09:15:00'),
('595de29b-f564-4c61-a630-193f39039d00', '5ad0c3c7-759c-4844-8322-dd9e16f0e9b0', '0eefc336-670d-4555-8c0e-eaf194c22653', 'Started the marketing campaign.', '2024-11-16 11:30:00');
