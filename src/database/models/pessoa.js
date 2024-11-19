'use strict';
const isCpfValid = require ('../../utils/cpfValidateHelper.js')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pessoa extends Model {
    static associate(models) {
      Pessoa.hasMany(models.Curso, {
        foreignKey: 'docente_id'
      });
      Pessoa.hasMany(models.Matricula, {
        foreignKey: 'estudante_id',
        scope: { status: 'matriculado' },
        as: 'aulasMatriculadas'
      });
      Pessoa.hasMany(models.Matricula, {
        foreignKey: 'estudante_id',
        as: 'todasAsMatriculas'
      });
    }
  }
  Pessoa.init({
    nome: {
    type: DataTypes.STRING,
    validate: {
      len: { args: [3, 40], msg: 'Field name must have 3 character minimum' }
    }
    },
    email: { 
      type: DataTypes.STRING,
      validate: {
        isEmail: { args: true, msg: 'email format invalid' }
      }
    },
    cpf: {
    type: DataTypes.STRING,
    validate: {
      isValidCpf: (cpf) => {
        if (!isCpfValid(cpf)) throw new Error('Cpf number invalid!')
      }
    }
    },
    ativo: DataTypes.BOOLEAN,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pessoa',
    tableName: 'pessoas',
    paranoid: true,
    defaultScope: { where: { ativo: true } },
    scopes: {
      allRegisters: { where: {} }
    }
  });
  return Pessoa;
};