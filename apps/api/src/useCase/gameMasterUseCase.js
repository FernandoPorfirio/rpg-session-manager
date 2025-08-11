const AppError = require("@errors/AppError");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const gameMasterService = require("@service/database/gameMasterService");

const create = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const databaseGameMaster = await gameMasterService.getByEmail(email);

  if (databaseGameMaster) {
    throw new AppError("Email já cadastrado!", 400);
  }

  return await gameMasterService.create({
    name,
    email,
    password: hashedPassword,
  });
};

const getToken = async ({ email, password }) => {
  const gameMaster = await gameMasterService.getByEmail(email);

  if (!gameMaster) {
    throw new AppError("Game Master não encontrado!", 404);
  }

  const validPassword = await bcrypt.compare(password, gameMaster.password);

  if (!validPassword) {
    throw new AppError("Senha inválida!", 401);
  }

  const token = jwt.sign(
    { id: gameMaster.id, email: gameMaster.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return token;
};

const getById = async ({ id }) => {
  const gameMaster = await gameMasterService.getById(id);

  if (!gameMaster) {
    throw new AppError("Game Master não encontrado!", 404);
  }

  return gameMaster;
};

module.exports = {
  create,
  getToken,
  getById
};
