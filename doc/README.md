# ProyectoConjuntoGrupo6

### Creacion del esqueleto del proyecto

* Creamos el documento **Readme.md**
* Creamos un archivo vacion llamado **package.json** en el cual hemos copiado
  de otro proyecto las dependencias de este y hemos adaptado los datos a 
  nuestro proyecto
* Creamos el **.env** en el cual meteremos las variables necesarias para iniciar
  nuestra conexion a nuestra base de datos

  Los datos necesarios de nuestro .env son los siguientes:

  ```javascript

  ```
* Creamos la carpeta stack donde meteremos los ficheros **docker_compose.yml**
  y el fichero **init.db**.

  Los datos de nuestro docker_compose.yml son los siguientes:
  ```yml
    version: '3.1'

    services:

    adminer:
        image: adminer
        restart: "no"
        ports:
        - ${ADMINER_PORT}:8080

    db-gesaca:
        image: mysql:latest
        restart: "no"
        environment:
        MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
        ports:
        - ${MYSQL_PORT}:3306
        volumes:
        - ./scripts:/docker-entrypoint-initdb.d
  ```

  Y los datos de nuestra base de datos son los siguientes:
  ```sql

  ```
  Estos se iniciaran nada mas realizar la conexion con nuestra base de datos.

* El
 diagrama Entidad-Relacion de nuestro proyecto es:

 VEHICULO   |   MARCA   |   MODELO  |   AÑO |   PRECIO  |   COMBUSTIBLE 
------- | ------- | ------- | ------- | ------- | -------
1 | Chevrolet | Sedan | 2004 | 40679,89 | Gasolina
2 | Toyota | Hatchback | 2005 | 30269,74 | Eléctrico
3 | Chevrolet | Coupe | 2023 | 18915,95 | Diesel
4 | Toyota | Coupe | 2000 | 12770,17 | Híbrido
5 | Toyota | Coupe | 2003 | 15343,84 | Diesel
6 | BMW | Sedan | 2017 | 49996,86 | Eléctrico
7 | Chevrolet | SUV | 2003 | 21170,79 | Híbrido
8 | Chevrolet | SUV | 2022 | 21421,32 | Híbrido
9 | Toyota | Coupe | 2001 | 36687,32 | Híbrido
10 | Toyota | Coupe | 2015 | 45768,36 | Diesel
11 | Toyota | SUV | 2011 | 8726,65 | Híbrido
12 | Ford | Truck | 2023 | 17419,34 | Gasolina
13 | Toyota | Hatchback | 2001 | 12121,02 | Gasolina
14 | Ford | Truck | 2006 | 12688,86 | Diesel
15 | BMW | Hatchback | 2008 | 6853,59 | Diesel


  **DENTRO DEL .GITIGNORE SE ENCUENTRAN LOS FICHEROS .ENV, NODE_MODULES Y PACKAGE-LOCK.JSON**