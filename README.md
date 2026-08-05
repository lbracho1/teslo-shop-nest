<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


# TesloDB API

1. Clonar el repositorio

2. Reinstalar los node_modules 
``` 
npm install
 ```
3. Clonar el archivo ``` .env.template ``` y renombrarlo a ```.env```

4. Cambiar las variables de entorno 

5. Levantar la base de datos
```
docker-compose up -d
```
6. Ejecutar el SEED
```
http://localhost:3000/api/seed
```

7. Levantar en modo desarollo ``` npm run start:dev ```