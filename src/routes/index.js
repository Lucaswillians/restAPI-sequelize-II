const express = require('express')
const pessoas = require('./pessoasRoutes.js')
const categorias = require('./categoriaRoutes.js')
const cursos = require('./cursosRoutes.js')

module.exports = app => {
  app.use(
    express.json(),
    pessoas,
    categorias,
    cursos,
  )
}