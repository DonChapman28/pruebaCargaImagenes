const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configurar almacenamiento de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Agrega timestamp al nombre del archivo
  }
});

const upload = multer({ storage });

// Ruta para subir imágenes
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se subió ningún archivo.');
  }
  const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.status(200).json({ url: fileUrl });
});

//rutas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* app.use('/public', express.static(path.join(__dirname, 'public')));
 */
// inicio
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

//buscar imagenes anasheeee
app.get('/images', (req, res) => {
    const uploadDir = path.join(__dirname, 'uploads');
  
    //lee nombres de las weas
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        return res.status(500).send('Error al leer la carpeta de imágenes');
      }
  
      //convierte las imagenes en url
      const imageUrls = files.map(file => `/uploads/${file}`);
  
      //las muestra en jeison a lo choro
      res.json(imageUrls);
    });
  });
  

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
