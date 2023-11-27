# API backend que gestiona un sistema básico de usuarios y publicaciones.

Este proyecto es una API REST desarrollada con Node.js y Express.js que permite gestionar un sistema básico de usuarios y publicaciones. La API permite realizar las siguientes operaciones:

- Crear un usuario
- Obtener un usuario
- Obtener todos los usuarios
- Actualizar un usuario (**solo el usuario autenticado**)
- Eliminar un usuario (**solo el usuario autenticado**)

- Crear una publicación (**solo el usuario autenticado**)
- Obtener una publicación
- Obtener todas las publicaciones

### Swagger

La API cuenta con una documentación generada con Swagger que se puede consultar en la siguiente URL:

[http://localhost:4000/api-docs](http://localhost:4000/api-docs)

## Instalación

Para instalar las dependencias del proyecto, ejecutar el siguiente comando:

```bash
npm install
pnpm install
yarn install
```

(cualquiera de los tres comandos anteriores)

## Tecnologías utilizadas

- **@faker-js/faker**: Esta es una biblioteca que genera datos falsos para pruebas. Es útil para crear datos de prueba que se pueden utilizar en pruebas unitarias o de integración.

- **typescript**: TypeScript es un super conjunto de JavaScript que añade tipos estáticos. Esto puede ayudar a prevenir errores y mejorar la legibilidad del código.

- **\@types/\*** : Estos son paquetes de definiciones de tipos para bibliotecas JavaScript. Permiten que TypeScript entienda cómo se supone que deben funcionar estas bibliotecas.

- **bcrypt**: Esta es una biblioteca para hashear contraseñas. Es importante hashear las contraseñas antes de almacenarlas para proteger la información del usuario.

- **body-parser**: Esta es una biblioteca que se utiliza para analizar el cuerpo de las solicitudes HTTP entrantes. Esto es útil cuando se quiere acceder a los datos enviados en una solicitud POST.

- **class-transformer y class-validator**: Estas bibliotecas se utilizan para validar y transformar objetos de clases en TypeScript.

- **dotenv**: Esta biblioteca se utiliza para cargar variables de entorno desde un archivo .env. Esto es útil para configurar secretos, como claves de API, que no quieres incluir directamente en tu código.

- **express-session**: Esta es una biblioteca para manejar sesiones en Express. Las sesiones son una forma de persistir datos entre solicitudes.

- **helmet**: Esta es una biblioteca que ayuda a proteger tu aplicación de algunas vulnerabilidades web bien conocidas configurando cabeceras HTTP de manera adecuada.

- **jest**: Jest es un marco de pruebas para JavaScript. Se utiliza para escribir y ejecutar pruebas unitarias y de integración.

- **jsonwebtoken**: Esta biblioteca se utiliza para trabajar con tokens JWT (JSON Web Token). Los JWT son una forma de representar reclamaciones seguras entre dos partes y se utilizan a menudo para la autenticación.

- **nodemon**: Nodemon es una herramienta que ayuda a desarrollar aplicaciones basadas en node.js al reiniciar automáticamente la aplicación de nodo cuando se detectan cambios de archivo en el directorio.

- **supertest**: Supertest es una biblioteca para probar servidores HTTP. Se utiliza a menudo con Jest para probar rutas Express.

- **swagger-jsdoc** y **swagger-ui-express**: Estas bibliotecas se utilizan para generar y servir documentación de API basada en Swagger a partir de comentarios en el código.

## Ejecución

Para ejecutar el proyecto, ejecutar el siguiente comando:

```bash
docker-compose up
```

## Testing

Para ejecutar los tests del proyecto, ejecutar el siguiente comando:

```bash
npm run test
```
