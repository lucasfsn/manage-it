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

## Run Locally

Clone the project

```bash
  git clone https://github.com/lucasfsn/manage-it
```

Go to the project directory

```bash
  cd manage-it
```

Create `.env` file to set environment variables. Use the provided `.env.example` file as a reference.

Build and run the application using Docker Compose:

```bash
  docker compose -f docker-compose.dev.yml up --build --watch
```

The --watch flag enables automatic reload of the server when source files change.

Once started, the application will be available at:
http://localhost:4200

## Run in Production Mode

To run the application in **production mode**, use the following command:

```bash
  docker compose -f docker-compose.prod.yml up --build
```

> **Note:** Before running the application in production mode, make sure to update the `.env` file with production-specific values. These values may differ from those used in development mode (e.g., database credentials, API URLs, JWT secret key, etc.).

### Contact

For questions please contact [lukasz.nowosielski02@gmail.com](mailto:lukasz.nowosielski02@gmail.com).
