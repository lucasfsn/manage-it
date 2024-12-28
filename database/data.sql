CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE task_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');
CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE project_status AS ENUM ('IN_PROGRESS', 'COMPLETED');

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
    description TEXT NOT NULL,
    status task_status NOT NULL,
    priority task_priority NOT NULL,
    due_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assigned_project_id UUID,
    tasks_task_id UUID,
    receiver_id UUID REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- intermediate table between the users and tasks tables
CREATE TABLE users_tasks (
    users_user_id UUID REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    tasks_task_id UUID REFERENCES tasks(task_id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (users_user_id, tasks_task_id)
);

-- intermediate table between the users and projects tables
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

-- intermediate table between the users and chats tables
CREATE TABLE messages (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    chat_id UUID REFERENCES chats(chat_id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
