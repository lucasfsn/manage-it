# Api 


### Rejestracja.

Jest w miare prosta walidacja, póki co. Jeśli wszystko się powiedzie, od razu zwraca token (można to zmienić). W body podajemy to co trzeba, czyli:
*username*, *password*, *firstName*, *lastName*, *email*
```
:8080/api/v1/auth/register
```

### Logowanie

Podajemy tylko *username*, *password*, jeśli sie powiedzie, zwraca token.

```
:8080/api/v1/auth/authenticate
```

Narazie, jak coś sie nie uda, to nie ma potworzonych różnych wyjątków, tylko zwraca kody.
