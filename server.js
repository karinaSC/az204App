const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    // Se acessar /, abre o index.html
    let filePath = req.url === "/" 
        ? path.join(__dirname, "index.html") 
        : path.join(__dirname, req.url);

    // Segurança básica: evita acessar fora da pasta do projeto
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end("Acesso negado");
        return;
    }

    let extname = path.extname(filePath).toLowerCase();

    let contentType = "text/html";

    switch (extname) {
        case ".png":
            contentType = "image/png";
            break;
        case ".jpg":
        case ".jpeg":
            contentType = "image/jpeg";
            break;
        case ".css":
            contentType = "text/css";
            break;
        case ".js":
            contentType = "text/javascript";
            break;
        case ".ico":
            contentType = "image/x-icon";
            break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Arquivo não encontrado");
            return;
        }

        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});
