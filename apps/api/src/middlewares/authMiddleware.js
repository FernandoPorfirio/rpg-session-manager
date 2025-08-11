const jwt = require("jsonwebtoken");
const AppError = require("@errors/AppError");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    throw new AppError("Token não fornecido", 401);
  }

  const [bearer, token] = authHeader.split(" ");
  
  if (bearer !== "Bearer" || !token) {
    throw new AppError("Formato de token inválido", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.gameMaster = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new AppError("Token inválido", 401);
    }
    if (error.name === 'TokenExpiredError') {
      throw new AppError("Token expirado", 401);
    }
    throw new AppError("Erro na validação do token", 401);
  }
};

module.exports = authMiddleware;
