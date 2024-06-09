const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const BASE_URL = `https://pruebacargaimagenes.onrender.com:${PORT}`;
// Habilitar CORS
app.use(cors());
// Configurar almacenamiento de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Directorio donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nombre del archivo en el servidor
  }
});


const upload = multer({ storage: storage });
// Ruta para subir imágenes
app.post('/uploads',upload.single('imageBase64'), (req, res) => {
 //valida que los datos de file sean verdadeeros
  if (!req.file) {
    return res.status(400).send('No se recibió ninguna imagen.');
  }

  const { originalname, mimetype, path: filePath } = req.file;
  const validTypes = ['image/jpg', 'image/jpeg', 'image/png'];

  //valida tipos
  if (!validTypes.includes(mimetype.toLowerCase())) {
    // Eliminar el archivo si no es válido
    fs.unlinkSync(filePath);
    return res.status(400).send('Tipo de imagen no permitido.');
  }

  //crea constante con la url para mandar a la base de datos
  const fileUrl = `${BASE_URL}/uploads/${path.basename(filePath)}`;
  console.log('Carga exitosa:', originalname);
  res.status(200).json({ url: fileUrl });
});


//rutas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
    console.log(`Servidor funcionando en ${BASE_URL}`);
  });