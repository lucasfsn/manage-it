# ManageIt

Project Management App that allows you to easily organize work in your team.

## Contents

- [Overview](#overview)
  - [Main Features](#main-features)
  - [Technologies Used](#technologies-used)
- [Run Locally](#run-locally)

## Overview

![Home](https://i.ibb.co/18vb0yv/2.png)

### Main Features

- **Auth**: Login and registration system to manage user access.
- **Profile**: Comprehensive user profile management including viewing and editing details.
- **Projects**: Efficiently create, manage, and track multiple projects.
- **Tasks**: Organize and manage tasks within projects, ensuring smooth workflow.
- **Chat**: Real-time communication with project or task team members via websocket.
- **Search**: Quickly find users within the application using the search functionality.
- **Language**: Seamlessly switch app language without needing to reload page.
- **Customization**: Personalize the app appearance with light or dark theme.

### Technologies Used

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind_CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![SpringBoot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## Run locally

Clone the project

```bash
  git clone https://github.com/lucasfsn/manage-it
```

Go to the project directory

```bash
  cd manage-it
```

Create a .env file with the following content:

```properties
  POSTGRES_USER=         # The username for the PostgreSQL database
  POSTGRES_PASSWORD=     # The password for the PostgreSQL database
  POSTGRES_DB=           # The name of the PostgreSQL database (e.g., manageit_database)
  DATABASE_URL=          # The JDBC URL for the PostgreSQL database (e.g., jdbc:postgresql://database:5432/manageit_database)
  JWT_SECRET_KEY=        # The secret key used for signing JWT tokens
  FRONTEND_URL=          # The URL where the frontend is hosted (e.g., http://frontend:80)
```

Build and run the application using Docker Compose:

```bash
  docker compose -f docker-compose.prod.yml up --build
```

### Running in Development Mode 🚀

To run the application in **development mode**, use the following command:

```bash
  docker compose -f docker-compose.dev.yml up --build --watch
```

