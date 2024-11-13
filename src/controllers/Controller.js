class Controller {
  constructor(serviceEntity) {
    this.serviceEntity = serviceEntity
  }

  async getAll (req, res) {
    try {
      const registerList = await this.serviceEntity.getAllRegisters()
      return res.status(200).json(registerList)
    }
    catch (error) {
      return res.status(500).json(error.message);
    }
  }

  async getOneById(req, res) {
    const { id } = req.params;
    try {
      const umRegistro = await this.serviceEntity.getOneRegisterById(Number(id));
      return res.status(200).json(umRegistro);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  async post(req, res) {
    const dadosParaCriacao = req.body;
    try {
      const novoRegistroCriado = await this.serviceEntity.createRegister(dadosParaCriacao);
      return res.status(200).json(novoRegistroCriado);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  async update (req, res) {
    const { id } = req.params
    const updatedData = req.body
    try {
      const isUpdated = await this.serviceEntity.updatedRegister(updatedData, Number(id))
      if (!isUpdated) return res.status(400).json({ mensagem: 'Register not updated' }); 

      return res.status(200).json({ mensagem: 'Updated with success!' });
    }
    catch (error) {
      return res.status(500).json(error.message);
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    try {
      await this.serviceEntity.deleteRegister(Number(id));
      return res.status(200).json({ mensagem: `id ${id} deletado` });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}

module.exports = Controller
