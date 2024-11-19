const Controller = require('./Controller.js')
const MatriculaServices = require('../services/MatriculaServices.js')
const Sequelize = require('sequelize')

const matriculaServices = new MatriculaServices()

class MatriculaController extends Controller {
  constructor() {
    super(matriculaServices)
  }

  async getRegisterByStudent (req, res) {
    const { estudante_id } = req.params
    try {
      const registerListByStudent = await matriculaServices.getRegisterAndCount({
        where: {
          estudante_id: Number(estudante_id),
          status: 'matriculado',
        },
        limit: 2,
        order: [['id', 'DESC']]
      })
      return res.status(200).json(registerListByStudent)
    }
    catch (error) {
      return res.status(500).json(error.message);
    }
  }

  async getCrowdedCourses (req, res) {
    const limitCourse = 2
    try {
      const crowdedCourses = await matriculaServices.getRegisterAndCount({
        where: {
          status: 'matriculado',
        },
        attributes: ['curso_id'],
        group: ['curso_id'],
        having: Sequelize.literal(`count(curso_id) >= ${limitCourse}`)
      })
      return res.status(200).json(crowdedCourses)
    }
    catch (error) {
      return res.status(500).json(error.message);
    }
  }
}

module.exports = MatriculaController