const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { verificarCredenciales, registrarUsuario } = require('./consultas');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());
app.listen(PORT, () => console.log(`SERVER ON at http://localhost:${PORT}`));


const verificarToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(403).send({ error: "Token no proporcionado" });

    jwt.verify(token, "az_AZ", (err, decoded) => {
        if (err) return res.status(403).send({ error: "Token inválido" });
        req.user = decoded;
        next();
    });
};


app.post("/usuarios", async (req, res) => {
    try {
        const { email, password, rol, lenguage } = req.body;
        await registrarUsuario(email, password, rol, lenguage);
        res.send({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send({ error: error.message || "Error interno del servidor" });
    }
});


app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        await verificarCredenciales(email, password);
        const token = jwt.sign({ email }, "az_AZ");
        res.send({ token });
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send({ error: error.message || "Error interno del servidor" });
    }
});


app.get("/usuarios", verificarToken, async (req, res) => {
    try {
        const consulta = "SELECT id, email, rol, lenguage FROM usuarios";
        const { rows } = await pool.query(consulta);
        res.send(rows);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Error al obtener usuarios" });
    }
});
