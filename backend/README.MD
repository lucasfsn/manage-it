## Run Locally

Clone the entire repository

```bash
  git clone https://github.com/lucasfsn/manage-it
```

Go to the backend directory

```bash
  cd backend
```

Adjust the configuration in application.yml:

- Datasource Configuration:
  - **url**
  - **username**
  - **password**
- Application Security Configuration:
  - **jwt.secret-key**
  - **frontend.url**

Install dependencies

```bash
  mvn clean install
```

Start the backend:

```bash
  mvn spring-boot:run
```
