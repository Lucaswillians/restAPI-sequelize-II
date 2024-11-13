const Services = require('./Services.js')

class PessoaServices extends Services{
  constructor() {
    super('Pessoa')
  }

  async getRegistrationByStudent(id) {
    const student = await super.getOneRegisterById(id)
    const registrationList = await student.getAulasMatriculadas() // nome do metodo devido ao alias, la no model pessoa
    return registrationList
  }
}

module.exports = PessoaServices