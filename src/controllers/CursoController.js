const Controller = require('./Controller.js')
const CursoServices = require('../services/CursoServices.js')
const { Op } = require('sequelize')

const cursoServices = new CursoServices()

class CursoController extends Controller {
  constructor() {
    super(cursoServices)
  }

  async getCourses (req, res) {
    const { initial_date, final_date } = req.query
    const where = {}

    initial_date || final_date ? where.data_inicio = {} : null
    initial_date ? where.data_inicio[Op.gte] = initial_date : null
    final_date ? where.data_inicio[Op.lte] = final_date : null

    try {
      const coursesList = await cursoServices.getAllRegisters(where)
      return res.status(200).json(coursesList)
    }
    catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }
}

module.exports = CursoController