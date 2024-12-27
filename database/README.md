## Instructions for starting a PostgreSQL database for ManageIt

### 1. Download images from Docker Hub

#### Database with only tables and relations:

`docker pull kacperholowaty/manageit_psql_database_tables_only:latest`

#### Database with sample data:

`docker pull kacperholowaty/manageit_psql_database:latest`

### 2. Starting the Docker container with the PostgreSQL database

#### Tables and relations only:

```
docker run --name manageit_database -d -p 5432:5432 kacperholowaty/manageit_psql_database_tables_only:latest
```

#### Tables and relations with sample data:

```
docker run --name manageit_database -d -p 5432:5432 kacperholowaty/manageit_psql_database:latest
```

### 3. Database management

### a) Enter to database from the terminal

`docker exec -it manageit_database bash`

### b) Connect to the database inside container

`psql -U my_user -d manageit_database`

You can then manually manage tables, relationships, and data in the PostgreSQL database for the ManageIt.
