# Documentação do Projeto

Este repositório é uma continuação direta do seguinte repositório -> https://github.com/Lucaswillians/restAPI-sequelize

---

# Diferença de utilizar where e o id para buscar dados

Você está usando um ID único (estudante_id) para localizar o registro. Esse método é mais simples, direto e eficiente porque:

Menor Complexidade:
Você só precisa de uma chave primária para localizar o registro. Geralmente, os bancos de dados já têm índices configurados para IDs, o que torna a consulta muito rápida.

Segurança e Controle:
Trabalhar com IDs explícitos ajuda a evitar ambiguidade. Você sabe exatamente qual registro está sendo consultado, o que reduz o risco de acessos ou atualizações errados.

Performance:
Consultas baseadas em IDs são quase sempre mais rápidas, especialmente em bancos relacionais como MySQL ou PostgreSQL, porque eles usam índices otimizados para isso.

Com o where, você está criando uma consulta condicional baseada em vários parâmetros, possivelmente combinando filtros como:
- id
- status
- categoria_id
- Etc.
Tornando possível realizar consultar na url da requisição diretamente por esses parâmetros acima.

Com o where temos uma melhora em:
Design Genérico de API:
Se sua API precisa ser reutilizável para diferentes cenários, permitir que o cliente passe vários critérios em req.params ou req.query pode torná-la mais poderosa.

Manutenção:
Quando você espera que a lógica de filtros possa mudar frequentemente, usar uma função genérica como idsConverter torna mais fácil atualizar as condições de busca sem modificar muitas partes do código.


## Por que não usamos somente o ID, se é mais performático?

Embora usar o ID seja mais simples e eficiente, nem sempre atende às necessidades do sistema. Aqui estão alguns motivos para optar pelo where:

Cenários Complexos:
Quando você precisa buscar ou atualizar registros com base em múltiplos critérios (e não apenas um ID). Por exemplo:

Atualizar todos os registros com status = 'pendente' de um estudante_id específico.
Buscar registros associados a mais de uma entidade.
Escalabilidade e Flexibilidade:
APIs projetadas para aceitar filtros genéricos são mais reutilizáveis. Elas permitem que diferentes consumidores (front-end, integrações externas) façam consultas mais avançadas sem alterar o código do back-end.

Falta de um ID único:
Às vezes, você simplesmente não tem um ID único para trabalhar. Isso pode ocorrer em tabelas associativas ou em casos onde os dados não têm uma chave primária óbvia.


## Segurança e Performance: Como equilibrar?
Se você quer garantir o equilíbrio entre segurança, performance e flexibilidade, considere estas práticas:

Priorize o ID quando possível:
Sempre que a lógica puder ser resolvida com um único ID, use-o. Além de mais seguro e performático, é menos propenso a erros.

Use o where para flexibilidade adicional:
Reserve o uso de condições genéricas para casos onde múltiplos filtros sejam realmente necessários.

Valide os filtros recebidos:
Quando usar um where genérico, sempre valide e sanitize os parâmetros para evitar consultas erradas ou vulnerabilidades como SQL Injection.


Contudo, use IDs para casos simples e diretos — são mais seguros e performáticos.
Use where genérico para APIs mais flexíveis que precisam atender cenários com múltiplos filtros.
Sempre valide os parâmetros e evite lógica desnecessária para simplificar seu código e manter a segurança.


----


## **O que são Validações e Constraints?**

- **Validações (`validate`)**: Regras aplicadas aos dados antes de serem inseridos ou atualizados na tabela. Validações podem ser fornecidas pelo Sequelize (como `isEmail`, `len`, etc.) ou personalizadas.
- **Constraints do Banco de Dados**: Garantias aplicadas diretamente no nível do banco de dados, como `allowNull` e `unique`.

---

## **Exemplo Prático**

Abaixo, um exemplo de definição de modelo com validações e constraints:

```javascript
const { Model, DataTypes } = require('sequelize');
const { isCpfValid } = require('../utils/validators'); // Função utilitária para validar CPF

class Pessoa extends Model {}

Pessoa.init({
  nome: {
    type: DataTypes.STRING,
    allowNull: false, // Constraint: Campo obrigatório
    validate: {
      len: { 
        args: [3, 40], 
        msg: 'Field name must have between 3 and 40 characters' 
      }, // Validação: Tamanho mínimo e máximo
    },
  },
  email: {
    type: DataTypes.STRING,
    unique: true, // Constraint: Valor único
    allowNull: false, // Constraint: Campo obrigatório
    validate: {
      isEmail: { 
        args: true, 
        msg: 'Invalid email format' 
      }, // Validação: Formato de e-mail
    },
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false, // Constraint: Campo obrigatório
    validate: {
      isValidCpf: (cpf) => {
        if (!isCpfValid(cpf)) throw new Error('CPF number invalid!');
      }, // Validação personalizada: Função que verifica se o CPF é válido
    },
  },
}, {
  sequelize,
  modelName: 'Pessoa',
});
```
## Validações Disponíveis no Sequelize
- len: Define limite para o campo, como no exemplo do nome que definimos um valor minimo e maximo
- isEmail: Verifica se o campo é um email
- is: Verifica um valor com base em uma expressão regular.
- isNumeric: Garante que o valor contém apenas números.
- isInt: Verifica se o valor é um número inteiro.
- isDate: Garante que o valor seja uma data válida.
- notNull: Garante que o valor não seja null.
- notEmpty: Garante que o campo não seja uma string vazia.

## Validações Personalizadas
O Sequelize permite a criação de validações customizadas para cenários específicos.

Exemplo: Validação de CPF, onde criamos uma pasta ```utils``` responsável por armazenar uma função que verifica se o cpf possui 11 digítos.

## Boas Práticas
Centralize Validações Customizadas
Armazene funções como isCpfValid em uma pasta utilitária (utils/) para facilitar a reutilização e manutenção.

Use Mensagens de Erro Descritivas
Adicione mensagens claras para facilitar o entendimento dos erros pelos desenvolvedores ou consumidores da API.

Combine Validações e Constraints
Use validações do Sequelize para lógica de negócios e constraints do banco para reforçar a integridade dos dados.


# SQL Operators no Sequelize: Uso de `attributes`, `group`, `having` e `literal`

Este documento explica o uso de operadores SQL no Sequelize, abordando conceitos como seleção de atributos, agrupamento, condições de filtragem em agregações e expressões literais SQL.

---

## Sql operator

O objetivo do método abaixo é listar os cursos com pelo menos um número mínimo de matrículas (`limitCourse`). Isso é feito utilizando funções de contagem e agrupamento SQL, integradas ao Sequelize.

### Código de Exemplo:
```javascript
async getCrowdedCourses(req, res) {
  const limitCourse = 2; // Define o limite mínimo de matrículas por curso
  try {
    const crowdedCourses = await matriculaServices.getRegisterAndCount({
      where: {
        status: 'matriculado', // Apenas registros com status "matriculado"
      },
      attributes: ['curso_id'], // Seleciona apenas o campo curso_id
      group: ['curso_id'], // Agrupa resultados pelo curso_id
      having: Sequelize.literal(`count(curso_id) >= ${limitCourse}`), // Filtra cursos com pelo menos 2 matrículas
    });
    return res.status(200).json(crowdedCourses);
  } catch (error) {
    return res.status(500).json(error.message);
  }
}
```

## Conceitos e Operadores Utilizados
1. attributes
O operador attributes permite selecionar quais colunas devem ser retornadas na consulta. Ele é equivalente ao SELECT no SQL.
```
  attributes: ['curso_id']

```
Por quê?
Selecionamos apenas o curso_id porque estamos interessados em agrupar e contar matrículas por curso. Dados adicionais são desnecessários para este cenário.
Esse feito será responsável por realizar o select em curso_id

2. group
O operador group agrupa os resultados com base em uma ou mais colunas, semelhante ao GROUP BY no SQL.
```
group: ['curso_id']
```
Por quê?
Agrupamos pelo curso_id para contar matrículas dentro de cada curso.
Esse feito será responsável por realizar um GROUP BY em curso_id
- Nota: O group é necessário para realizar cálculos agregados (como COUNT, SUM ou AVG).


3. having
O operador having aplica condições de filtragem aos resultados agregados, semelhante ao HAVING no SQL.
```
having: Sequelize.literal(`count(curso_id) >= ${limitCourse}`)

```

Por quê?
A condição filtra apenas os cursos que possuem pelo menos 2 matrículas.

Diferença Entre where e having:
- where: Filtra os dados antes do agrupamento.
- having: Filtra os dados após o agrupamento.

4. literal
O operador literal permite inserir expressões SQL brutas dentro da consulta Sequelize.
```
Sequelize.literal(`count(curso_id) >= ${limitCourse}`)

```

Por quê?
Usamos literal para escrever uma expressão SQL que calcula o número de registros por curso_id.

Quando Usar?
Quando não há suporte direto do Sequelize para uma funcionalidade SQL.
Para expressões SQL personalizadas que envolvem funções ou cálculos complexos.


Como Funciona no Banco de Dados nessa consulta feita pelo ORM
- Consulta SQL Gerada:
```
SELECT curso_id
FROM matriculas
WHERE status = 'matriculado'
GROUP BY curso_id
HAVING COUNT(curso_id) >= 2;
```

## Vantagens do Uso de Operadores no Sequelize
Clareza e Organização:
O Sequelize abstrai a complexidade do SQL, tornando o código mais legível e menos propenso a erros.

Manutenção Facilitada:
Operadores como attributes, group e having permitem modificar ou expandir consultas facilmente.

Segurança:
Evita injeção de SQL ao construir consultas dinâmicas, especialmente em parâmetros.

Flexibilidade com literal:
Permite usar SQL bruto quando necessário, sem sacrificar o poder do Sequelize.


## Como Funciona findAndCountAll?
O método findAndCountAll retorna um objeto contendo:

- rows: Os registros que atendem aos critérios, de acordo com o limit, offset e outras condições.
- count: O número total de registros no banco de dados que atendem às condições (ignorando o limit e o offset).

## Parâmetros Mais Comuns
- where: Define as condições para filtrar os registros.
- limit: Especifica o número máximo de registros a serem retornados.
- offset: Define a partir de qual registro a busca deve começar.
- order: Especifica a ordenação dos resultados.




