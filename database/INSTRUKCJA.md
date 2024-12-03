## Instrukcja uruchomienia bazy danych PostgreSQL dla projektu ManageIt

### 1. Pobranie obrazów z Docker Hub

#### Baza danych z samymi tabelami i relacjami:

`docker pull kacperholowaty/manageit_psql_database_tables_only:latest`

#### Baza danych z przykładowymi danymi:

`docker pull kacperholowaty/manageit_psql_database:latest`

### 2. Uruchomienie kontenera Docker z bazą danych PostgreSQL

#### Tylko tabele i relacje:

```
docker run --name manageit_database -d -p 5432:5432 kacperholowaty/manageit_psql_database_tables_only:latest
```

#### Tabele i relacje wraz z przykładowymi danymi:

```
docker run --name manageit_database -d -p 5432:5432 kacperholowaty/manageit_psql_database:latest
```

### 3. Zarządzanie bazą danych

### a) Wejście do kontenera z terminala

`docker exec -it manageit_database bash`

### b) Połączenie z bazą danych z terminala (wewnątrz kontenera)

`psql -U my_user -d manageit_database`

Można wówczas ręcznie zarządzać tabelami, relacjami i danymi w bazie PostrgreSQL dla projektu ManageIt.
