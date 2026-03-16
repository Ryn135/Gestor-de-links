import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';

// 2. Inicializamos el servidor
const app = express();
const PORT = 3000;

// 3. Configuraciones básicas
app.use(cors());
app.use(express.json());

// 4. Conectar a MongoDB Atlas (La Nube)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas con éxito.'))
  .catch((err) => console.error('❌ Error fatal conectando a MongoDB:', err));

// 5. Crear el Esquema y Modelo de Mongoose (¿Cómo es un link?)
const linkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  category: { type: String, default: 'Favoritos' },
  icon_path: { type: String, default: null } // Guardará el Base64 largo
}, { timestamps: true });

// Le decimos a Mongoose que convierta de vuelta _id a id al enviar a React
linkSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id; // Creamos la propiedad id que React espera
    delete ret._id;   // Borramos el feo _id nativo de Mongo
  }
});

const Link = mongoose.model('Link', linkSchema);

// 6. Multer para la Nube: Guardamos los uploads en Memoria RAM para convertirlos a Base64  
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- AQUÍ EMPIEZAN LAS "RUTAS" (API) ---

app.get('/', (req, res) => {
    res.send('¡Hola! El servidor Cloud está funcionando ☁️🚀');
});

// Obtener todos los links desde MongoDB
app.get('/api/links', async (req, res) => {
    try {
        const links = await Link.find().sort({ createdAt: -1 });
        res.json(links);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Guardar un link nuevo (solo texto)
app.post('/api/links', async (req, res) => {
    try {
        const { title, url, category } = req.body;
        const newLink = await Link.create({ title, url, category });
        res.status(201).json(newLink);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un link por ID
app.delete('/api/links/:id', async (req, res) => {
    try {
        await Link.findByIdAndDelete(req.params.id);
        res.json({ success: true, deletedID: req.params.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Modificar solo el ícono de un link existente (Base64)
app.post('/api/links/:id/icon', upload.single('icon'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se envió ninguna imagen.' });
    }

    try {
        // Magia Cloud: Convertimos el archivo de memoria RAM en texto Base64
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        // Almacenamos el texto cifrado dentro del mismo documento de la DB
        const updatedLink = await Link.findByIdAndUpdate(
            req.params.id, 
            { icon_path: base64Image },
            { new: true } // Para que nos devuelva el registro modificado
        );

        res.json({ id: updatedLink.id, icon_path: updatedLink.icon_path });
    } catch (error) {
        console.error("Error convirtiendo imagen a Base64:", error);
        res.status(500).json({ error: error.message });
    }
});

// --- FIN DE LAS RUTAS ---

// 7. Encendemos el servidor para que empiece a escuchar
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});