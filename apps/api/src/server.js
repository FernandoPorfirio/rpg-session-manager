require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 3000;

// Para desenvolvimento local
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

// Para Vercel (exportar o app como função)
module.exports = app;
