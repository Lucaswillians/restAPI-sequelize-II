const Controller = require('./Controller.js')
const PessoaServices = require('../services/PessoaServices.js')

const pessoaServices = new PessoaServices()

class PessoaController extends Controller {
  constructor() {
    super(pessoaServices)
  }

 async getActiveRegistration(req,  res) {
    const { estudante_id } = req.params
    try {
      const registrationList = await pessoaServices.getActiveRegistrationByStudent(Number(estudante_id))
      return res.status(200).json(registrationList)
    }
    catch (error) {
      return res.status(500).json(error.message)
    }
  }

 async getAllRegistration(req,  res) {
    const { estudante_id } = req.params
    try {
      const registrationList = await pessoaServices.getAllRegistrationByStudent(Number(estudante_id))
      return res.status(200).json(registrationList)
    }
    catch (error) {
      return res.status(500).json(error.message)
    }
  }

  async getAllPeople (req, res) {
    try {
      const listAllPeople = await pessoaServices.getAllPeopleByScope()
      return res.status(200).json(listAllPeople)
    }
    catch (error) {
      return res.status(500).json(error.message)
    }
  }

  async cancelStudentRegister (req, res) {
    const { estudante_id } = req.params
    try {
      await pessoaServices.cancelStudentAndRegister(Number(estudante_id))
      return res.status(200).json({ message: `Matricula ref. estudante ${estudante_id} canceladas` })
    }
    catch (error) {
      return res.status(500).json(error.message)
    }
  }
}

module.exports = PessoaController