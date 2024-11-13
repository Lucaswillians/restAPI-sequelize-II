const { Router } = require('express')
const PessoaController = require('../controllers/PessoaController.js')
const MatriculaController = require('../controllers/MatriculaController.js')

const pessoaController = new PessoaController()
const matriculaController = new MatriculaController()

const router = Router()

router.get('/pessoas', (req, res) => pessoaController.getAll(req, res))
router.post('/pessoas', (req, res) => pessoaController.post(req, res))
router.get('/pessoas/:id', (req, res) => pessoaController.getOneById(req, res))
router.put('/pessoas/:id', (req, res) => pessoaController.update(req, res))
router.delete('/pessoas/:id', (req, res) => pessoaController.delete(req, res))
router.get('/pessoas/:estudanteId/matriculas', (req, res) => pessoaController.getRegistration(req, res));
router.post('/pessoas/:estudanteId/matriculas', (req, res) => matriculaController.post(req, res))

module.exports = router
