FROM postgres:latest

COPY data.sql /docker-entrypoint-initdb.d/

ENV POSTGRES_USER=my_user
ENV POSTGRES_PASSWORD=my_password
ENV POSTGRES_DB=manageit_database