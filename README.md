# Proyecto de Subida de Archivos con Node.js y MySQL

Este proyecto proporciona una solución completa para la **subida**, **almacenamiento** y **recuperación** de archivos utilizando **Node.js**, **Express** y **MySQL**. Permite a los usuarios subir archivos a un servidor, almacenarlos en una base de datos y recuperarlos según sea necesario. 

### Características

- **Subida de Archivos**: Permite a los usuarios cargar archivos a través de una interfaz sencilla.
- **Almacenamiento Seguro**: Los archivos se guardan tanto en el sistema de archivos como en una base de datos MySQL, asegurando accesibilidad y persistencia.
- **Recuperación de Archivos**: Los archivos pueden ser fácilmente recuperados y descargados usando su ID.
- **Listar Archivos**: Proporciona una lista de todos los archivos almacenados en el sistema.




## Requisitos

- Node.js
- MySQL

## Instalación

`npm install express multer mysql2 sequelize`
## Base de Datos
```sql
CREATE TABLE file_model (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    data LONGBLOB NOT NULL
);```

