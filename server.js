const express = require("express");
const sql = require("mssql");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (HTML, CSS, imagens)
app.use(express.static(__dirname));

// Configuração Azure SQL
const config = {
    server: process.env.DB_SERVER, // ex: meuservidor.database.windows.net
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 1433,
    options: {
        encrypt: true, // obrigatório para Azure
        trustServerCertificate: false
    }
};

// Rota POST para salvar usuário
app.post("/usuarios", async (req, res) => {
    const { nome, email, telefone } = req.body;

    if (!nome || !email || !telefone) {
        return res.status(400).json({ mensagem: "Dados inválidos" });
    }

    try {
        await sql.connect(config);

        await sql.query`
            INSERT INTO Usuarios (Nome, Email, Telefone)
            VALUES (${nome}, ${email}, ${telefone})
        `;

        res.json({ mensagem: "Cadastro salvo com sucesso!" });

    } catch (err) {
        console.error("Erro no banco:", err);
        res.status(500).json({ mensagem: "Erro ao salvar no banco" });
    }
});

// Rota de teste
app.get("/health", (req, res) => {
    res.send("API funcionando no Azure 🚀");
});

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});
