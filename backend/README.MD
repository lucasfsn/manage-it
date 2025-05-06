## Run Locally

Clone the entire repository

```bash
  git clone https://github.com/lucasfsn/manage-it
```

Go to the backend directory

```bash
  cd backend
```

If you have made any changes to database or frontend, adjust the configuration in application-dev.yml, otherwise skip this step.

- Datasource Configuration:
  - **url**
  - **username**
  - **password**
- Application Security Configuration:
  - **jwt.secret-key**: Update it if you want your own secret key.
  - **frontend.url**

> **Note:** If you want to run the backend outside of the container, make sure to adjust the `spring.datasource.url` in `application-dev.yml` to use `localhost` instead of the service name `database`.


Install dependencies

```bash
  mvn clean install
```

Start the backend:

```bash
  mvn spring-boot:run
```
