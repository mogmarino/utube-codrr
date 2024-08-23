<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# Instrucciones para levantar el proyecto

1.  Clonar el repositorio
```
git clone https://github.com/mogmarino/utube-codrr.git
``` 
2.  Levantar el container en Docker
```
docker-compose up -d
```
3.  Ejecutar la migración a la DB
```
npm run m:gen -- src/migrations/init
```
4.  Correr la migración
```
npm run m:run
```
5.  Levantar el Proyecto
```
npm run start:dev
```

# Stack Usado

* PostgreSQL
* TypeORM
* Axios
* Swagger
