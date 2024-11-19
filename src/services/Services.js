const { where, Transaction } = require('sequelize')
const dataSource = require('../database/models')

class Services {
  constructor(nameModel) {
    this.model = nameModel
  }

  async getAllRegisters (where = {}) {
    return dataSource[this.model].findAll({ where: { ...where }})
  }

  async getRegisterByScope (scope) {
    return dataSource[this.model].scope(scope).findAll()
  }

  async getOneRegisterById(id) {
    return dataSource[this.model].findByPk(id)
  }

  async getOneRegister(where) {
    return dataSource[this.model].findOne({ where: { ...where } })
  }

  async getRegisterAndCount(options) {
    return dataSource[this.model].findAndCountAll({ ...options })
  }

  async createRegister(dadosDoRegistro) {
    return dataSource[this.model].create(dadosDoRegistro);
  }

async updatedRegister(updatedData, where, T = {}) {
  const updatedRegisterList = await dataSource[this.model].update(updatedData, {
    where: { ...where },
    transaction: T, 
  });

  if (updatedRegisterList[0] === 0) return false;

  return true;
}

  async deleteRegister(id) {
    return dataSource[this.model].destroy({ where: { id: id } });
  }
}

module.exports = Services