const { Router } = require('express')
const PessoaController = require('../controllers/PessoaController.js')
const MatriculaController = require('../controllers/MatriculaController.js')

const pessoaController = new PessoaController()
const matriculaController = new MatriculaController()

const router = Router()

router.get('/pessoas', (req, res) => pessoaController.getAll(req, res))
router.get('/pessoas/todos', (req, res) => pessoaController.getAllPeople(req, res))
router.post('/pessoas', (req, res) => pessoaController.post(req, res))
router.get('/pessoas/:id', (req, res) => pessoaController.getOneById(req, res))
router.put('/pessoas/:id', (req, res) => pessoaController.update(req, res))
router.put('/pessoas/:estudante_id/cancela', (req, res) => pessoaController.cancelStudentRegister(req, res))
router.delete('/pessoas/:id', (req, res) => pessoaController.delete(req, res))
router.get('/pessoas/:estudante_id/matriculas', (req, res) => pessoaController.getActiveRegistration(req, res));
router.get('/pessoas/:estudante_id/todasMatriculas', (req, res) => pessoaController.getAllRegistration(req, res));
router.get('/pessoas/:estudante_id/matriculas/confirmadas', (req, res) => matriculaController.getRegisterByStudent(req, res));
router.get('/pessoas/matriculas/lotadas', (req, res) => matriculaController.getCrowdedCourses(req, res));
router.get('/pessoas/:estudante_id/matriculas/:id', (req, res) => matriculaController.getOne(req, res));
router.post('/pessoas/:estudante_id/matriculas', (req, res) => matriculaController.post(req, res))
router.put('/pessoas/:estudante_id/matriculas/:id', (req, res) => matriculaController.update(req, res))
router.delete('/pessoas/:estudante_id/matriculas/:id', (req, res) => matriculaController.delete(req, res))

module.exports = router
