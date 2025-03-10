const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const registroRoutes = require("./routes/registro");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer");
require("dotenv").config();

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware para JSON
app.use(express.json());

// Middleware para CORS
app.use(cors());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Middleware para verificar autenticación con JWT
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ message: "Acceso denegado" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token inválido" });
    }
};

// Nueva ruta para verificar el token desde el frontend
app.get("/api/auth/verify", verifyToken, (req, res) => {
    res.json({ message: "Token válido" });
});

// Configurar `multer` para almacenar PDFs en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para subir PDFs
app.post("/upload", verifyToken, upload.single("pdfFile"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: "No se subió ningún archivo" });
        }

        const Registro = require("./models/registro");

        const nuevoRegistro = new Registro({
            userId: req.user.id,
            pdf: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        });

        await nuevoRegistro.save();
        res.json({ msg: "PDF subido correctamente", fileName: req.file.originalname });
    } catch (error) {
        res.status(500).json({ msg: "Error al subir el archivo", error: error.message });
    }
});

// Redirigir la raíz a /login
app.get("/", (req, res) => {
    res.redirect("/login");
});

// Ruta para el archivo login.html
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Ruta para el archivo register.html
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register.html"));
});

// Ruta protegida para dashboard.html
app.get("/dashboard.html", verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// Rutas de autenticación y registros
app.use("/api/auth", authRoutes);
app.use("/api/registro", registroRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
