const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '1234',
    database: 'softjobs',
    allowExitOnIdle: true,
});


const verificarCredenciales = async (email, password) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1 AND password = $2";
    const values = [email, password];
    const { rowCount } = await pool.query(consulta, values);
    if (!rowCount) throw { code: 401, message: "Credenciales inválidas" };
};


const registrarUsuario = async (email, password, rol, lenguage) => {
    const consulta = "INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)";
    const values = [email, password, rol, lenguage];
    await pool.query(consulta, values);
};

module.exports = {
    verificarCredenciales,
    registrarUsuario,
};
                                       