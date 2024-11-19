const Services = require('./Services.js')
const dataSource = require('../database/models')

class PessoaServices extends Services{
  constructor() {
    super('Pessoa')
    this.matriculaServices = new Services('Matricula')
  }

  async getActiveRegistrationByStudent(id) {
    const student = await super.getOneRegisterById(id)
    const registrationList = await student.getAulasMatriculadas() // nome do metodo devido ao alias, la no model pessoa
    return registrationList
  }

 async getAllRegistrationByStudent(id) {
    const student = await super.getOneRegisterById(id)
    const registrationList = await student.getTodasAsMatriculas() // nome do metodo devido ao alias, la no model pessoa
    return registrationList
  }

  async getAllPeopleByScope () {
    return await super.getRegisterByScope('allRegisters')
  }

async cancelStudentAndRegister(estudante_id) {
  return dataSource.sequelize.transaction(async (T) => {
    await super.updatedRegister({ ativo: false }, { id: estudante_id }, T);
    await this.matriculaServices.updatedRegister(
      { status: 'cancelado' },
      { estudante_id: estudante_id },
      T
    );
  });
}

}

module.exports = PessoaServices