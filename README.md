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

## Instalación

Para instalar las dependencias del proyecto, ejecutar el siguiente comando:

```bash
npm install
pnpm install
yarn install
```

(cualquiera de los tres comandos anteriores)

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
