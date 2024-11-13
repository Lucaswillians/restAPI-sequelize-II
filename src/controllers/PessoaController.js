const Controller = require('./Controller.js')
const PessoaServices = require('../services/PessoaServices.js')

const pessoaServices = new PessoaServices()

class PessoaController extends Controller {
  constructor() {
    super(pessoaServices)
  }

 async getRegistration(req,  res) {
    const { estudanteId } = req.params
    try {
      const registrationList = await pessoaServices.getRegistrationByStudent(Number(estudanteId))
      return res.status(200).json(registrationList)
    }
    catch (error) {
      return res.status(500).json(error.message)
    }
  }
}

module.exports = PessoaController