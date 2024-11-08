CREATE TYPE task_status AS ENUM ('NOT STARTED', 'IN PROGRESS', 'COMPLETED');
CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE project_status AS ENUM ('IN PROGRESS', 'COMPLETED');

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    owner_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    status project_status NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    start_date DATE,
    end_date DATE
);

CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    assigned_project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
    task_name VARCHAR(255) NOT NULL,
    description TEXT,
    status task_status NOT NULL,
    priority task_priority NOT NULL,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE notifications (
    notifications_id SERIAL PRIMARY KEY,
    assigned_project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
    users_user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    tasks_task_id INTEGER REFERENCES tasks(task_id) ON DELETE CASCADE, 
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- tabela pośrednia users-tasks
CREATE TABLE users_tasks (
    users_user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    tasks_task_id INT REFERENCES tasks(task_id) ON DELETE CASCADE,
    PRIMARY KEY (users_user_id, tasks_task_id)
);

--tabela pośrednia users-projects
CREATE TABLE project_members (
    users_user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    projects_project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
    PRIMARY KEY (projects_project_id, users_user_id)
);

CREATE TABLE chats (
    chat_id SERIAL PRIMARY KEY,
    tasks_task_id INT REFERENCES tasks(task_id) ON DELETE CASCADE,
    projects_project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
    chat_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--tabela pośrednia do users-chats
CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    chat_id INT REFERENCES chats(chat_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



INSERT INTO users (first_name, last_name, password, email, username) VALUES 
('John', 'Doe', 'password_1', 'johndoe@example.com', 'johndoe'),
('Jane', 'Smith', 'password_2', 'janesmith@example.com', 'janesmith'),
('Alice', 'Johnson', 'password_3', 'alicejohnson@example.com', 'alicej'),
('Bob', 'Brown', 'password_4', 'bobbrown@example.com', 'bobb'),
('Charlie', 'Davis', 'password_5', 'charliedavis@example.com', 'charlied');

INSERT INTO projects (owner_id, project_name, description, status, created_at, start_date, end_date) VALUES 
(1, 'Project Alpha', 'A project about AI development.', 'IN PROGRESS', '2024-03-15 10:00:00', '2024-03-20', '2024-12-20'),
(1, 'Project Omega', 'Advanced AI research project.', 'COMPLETED', '2024-03-01 14:00:00', '2024-03-05', '2024-10-30'),
(2, 'Project Beta', 'Web development project.', 'IN PROGRESS', '2024-03-10 12:00:00', '2024-05-15', '2024-11-15'),
(3, 'Project Gamma', 'Mobile app project.', 'COMPLETED', '2023-10-01 08:00:00', '2023-10-10', '2024-01-01'),
(4, 'Project Delta', 'Data science project.', 'IN PROGRESS', '2024-10-09 09:00:00', '2024-10-10', '2025-01-10'),
(2, 'Project Sigma', 'Big data analysis project.', 'IN PROGRESS', '2024-04-15 10:30:00', '2024-05-01', '2024-12-20');

INSERT INTO tasks (assigned_project_id, task_name, description, status, priority, due_date) VALUES 
(1, 'Research AI Models', 'Research on current AI models.', 'IN PROGRESS', 'HIGH', '2024-11-15'),
(2, 'Develop AI Framework', 'Develop a framework for Project Omega.', 'COMPLETED', 'HIGH', '2024-09-01'),
(1, 'Data Collection', 'Gather data for AI models.', 'IN PROGRESS', 'MEDIUM', '2024-12-01'),
(3, 'Develop API', 'Backend API for mobile app.', 'COMPLETED', 'HIGH', '2023-11-01'),
(4, 'Data Cleaning', 'Clean and process data for analysis.', 'IN PROGRESS', 'HIGH', '2024-11-28'),
(6, 'Analyze Data Patterns', 'Analyze patterns in big data.', 'NOT STARTED', 'MEDIUM', '2024-12-05'),
(6, 'Report Generation', 'Generate reports from analyzed data.', 'NOT STARTED', 'LOW', '2024-12-13');

INSERT INTO notifications (assigned_project_id, users_user_id, tasks_task_id, message) VALUES 
(1, 1, 1, 'New update available for Project Alpha.'),
(2, 2, 2, 'User janesmith started working on Develop AI Framework.'),
(3, 3, 3, 'Task Develop API has been completed successfully.'),
(4, 4, 4, 'User bobbrown has started working on Data Cleaning.'),
(6, 2, 6, 'New task Analyze Data Patterns assigned to Jane Smith.'),
(1, 5, NULL, 'User Charlie Davis joined Project Alpha.'),
(2, 1, NULL, 'Project Omega has started.');

INSERT INTO users_tasks (users_user_id, tasks_task_id) VALUES 
(1, 1),
(1, 2), 
(2, 6), 
(2, 3), 
(3, 7), 
(4, 4), 
(5, 5);

INSERT INTO project_members (users_user_id, projects_project_id) VALUES 
(1, 1), 
(1, 2), 
(2, 2), 
(2, 6), 
(3, 3), 
(4, 4), 
(5, 4), 
(5, 1), 
(3, 6); 

INSERT INTO chats (tasks_task_id, projects_project_id, chat_name) VALUES 
(1, 1, 'AI Development Discussion'),
(2, 2, 'Frontend Team Chat'),
(3, 3, 'Mobile API Discussion');

INSERT INTO messages (user_id, chat_id, message) VALUES 
(1, 1, 'Let’s start with researching AI models.'),
(2, 2, 'I will handle the frontend design.'),
(3, 3, 'API is almost complete.'),
(4, 1, 'Any updates on AI development?');