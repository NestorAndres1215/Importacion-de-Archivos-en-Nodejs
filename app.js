// app.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./db'); // Importa la conexión a la base de datos

const app = express();
const PORT = 3000;

// Configura el almacenamiento de multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Asegúrate de que el directorio de subida existe
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Ruta para subir archivos
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).send('No se subió ningún archivo.');
    }

    // Guarda el archivo en el sistema de archivos
    const filePath = path.join(uploadDir, file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    // Inserta la información del archivo en la base de datos
    const query = `
        INSERT INTO file_model (name, type, data) 
        VALUES (?, ?, ?)
    `;

    db.query(query, [file.originalname, file.mimetype, file.buffer], (err, result) => {
        if (err) {
            console.error('Error al guardar en la base de datos: ', err);
            return res.status(500).send('Error al guardar en la base de datos.');
        }
        res.send('Archivo subido y guardado en la base de datos con éxito. ID: ' + result.insertId);
    });
});

// Ruta para listar archivos en formato JSON
app.get('/files', (req, res) => {
    const query = 'SELECT id, name, type FROM file_model';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al recuperar archivos: ', err);
            return res.status(500).json({ error: 'Error al recuperar archivos.' });
        }

        // Envía la lista de archivos en formato JSON
        res.json(results);
    });
});

// Ruta para descargar archivos
app.get('/files/:id', (req, res) => {
    const fileId = req.params.id;
    const query = 'SELECT name, type, data FROM file_model WHERE id = ?';

    db.query(query, [fileId], (err, results) => {
        if (err) {
            console.error('Error al recuperar el archivo: ', err);
            return res.status(500).json({ error: 'Error al recuperar el archivo.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Archivo no encontrado.' });
        }

        const file = results[0];
        res.setHeader('Content-Type', file.type);
        res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
        res.send(file.data);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
