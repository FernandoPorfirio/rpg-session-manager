const contentUseCase = require("@useCase/gameMasterUseCase");

const create = async (req, res) => {
  const { name, email, password } = req.body;

    //TODO: FAZER O TRATAMENTO PADRAO PARA SENHA
    const gameMaster = await contentUseCase.create({ name, email, password });

    res.status(201).json(gameMaster);
};

module.exports = {
  create,
};
