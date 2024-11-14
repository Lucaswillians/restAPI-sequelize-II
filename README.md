# Documentação do Projeto

Este documento descreve a estrutura e o fluxo de dados entre as classes `Services`, `PessoaServices`, `Controller` e `PessoaController`. Abaixo, é explicado a lógica de como as classes se relacionam utilizando a herança de orientação a objetos e como as operações no banco de dados são realizadas.

---

## Estrutura e Lógica do Código

### `this.model` no Construtor da Classe `Services`

O `this.model` no construtor da classe `Services` representa o nome do modelo, que é utilizado para definir a tabela que será acessada no banco de dados.

- No arquivo `PessoaServices`, que é uma extensão (herança) da classe `Services`, você chama `super('Pessoa')`, passando a string `'Pessoa'` para o construtor de `Services`.
- Isso faz com que a propriedade `this.model` na classe `Services` receba o valor `'Pessoa'`.
- A partir disso, sempre que `this.model` for usado em `Services`, ele representará a **tabela `Pessoas` no banco de dados**. Por exemplo, ao usar `dataSource[this.model]`, ele acessa a tabela `Pessoas` no banco de dados através do Sequelize.

### Por Que `PessoaServices` Herda de `Services`

A herança de `Services` por `PessoaServices` permite que `PessoaServices` utilize o comportamento genérico da classe `Services`, mas com o modelo específico `Pessoa`.

- Ao chamar `super('Pessoa')` dentro de `PessoaServices`, o construtor de `Services` é ativado, configurando `this.model` como `'Pessoa'`.
- Com isso, `PessoaServices` herda métodos e funcionalidades de `Services`, mas com o modelo específico `Pessoa`, permitindo que operações genéricas no banco de dados (como `getAllRegisters`) sejam direcionadas para a tabela `Pessoas`.

### `this.serviceEntity` no Construtor de `Controller`

No `Controller`, o `this.serviceEntity` serve como referência para a instância de um serviço específico (no caso, `PessoaServices`).

- No arquivo `PessoaController`, que herda de `Controller`, passamos uma instância de `PessoaServices` como parâmetro para o construtor de `Controller`.
- Isso faz com que `this.serviceEntity` dentro de `Controller` seja uma instância de `PessoaServices`, e com isso `Controller` pode acessar métodos como `getAllRegisters` de `PessoaServices`.
- Assim, **`this.serviceEntity` referencia o serviço `PessoaServices`, que se conecta à tabela `Pessoas` no banco de dados**.

### Herança de `PessoaController` a Partir de `Controller`

A classe `PessoaController` herda de `Controller`, passando no seu construtor o parâmetro `pessoaServices`, que é uma instância de `PessoaServices`.

- `PessoaController` utiliza a lógica da classe `Controller` para gerenciar requisições HTTP, enquanto `PessoaServices` gerencia as interações diretas com a tabela `Pessoas`.
- Ao passar `pessoaServices` (instância de `PessoaServices`) para o `Controller`, a propriedade `this.serviceEntity` de `Controller` permite que o controlador acesse e manipule os dados na tabela `Pessoas` de maneira abstrata, utilizando os métodos de `PessoaServices`.

---

Essa estrutura modular permite uma clara separação de responsabilidades:
- **`Services`** fornece a lógica genérica para operações de banco de dados.
- **`PessoaServices`** especifica qual tabela será acessada e herda as operações de `Services`.
- **`Controller`** gerencia requisições HTTP de maneira genérica.
- **`PessoaController`** conecta o controlador HTTP ao serviço específico, permitindo a manipulação da tabela `Pessoas`.


## Criação de Modelos e Tabelas

Para gerar um modelo e a respectiva tabela no banco de dados, utilize o comando abaixo:

```bash
npx sequelize-cli model:generate --name nomeDaTabela --attributes atributo1:tipo,atributo2:tipo
```
Realizando isso, ele cria uma tabela no sqlite com o nome tabela, e suas colunas.

## Exemplo: Criando uma Tabela Matricula com um Atributo `status` do Tipo String

Para criar uma tabela chamada `Matricula` com um atributo `status` do tipo string, utilize o comando:

```bash
npx sequelize-cli model:generate --name Matricula --attributes status:string
```

## Executar a Migração

Depois de criar e editar o arquivo de migração que foi gerado pelo comando acima, você pode aplicar as migrações para criar a tabela no banco de dados com o seguinte comando:

```
npx sequelize-cli db:migrate
```

## Populando o Banco de Dados com Seeds

Para popular o banco de dados com dados iniciais (seeds), utilize o seguinte comando:

```
npx sequelize-cli seed:generate --name nome-do-arquivo
```

Isso gerará um arquivo de seed na pasta seeders. Edite esse arquivo para incluir os dados que deseja inserir no banco. Em seguida, execute o comando abaixo para rodar todos os seeds e popular o banco:

```
npx sequelize-cli db:seed:all
```

## Relacionamentos com Chave Estrangeira (FK)

Quando uma tabela possui uma chave estrangeira (foreign key), não devemos especificá-la diretamente no comando de criação de modelo. Em vez disso, a configuração deve ser feita manualmente nos arquivos gerados pelo Sequelize nas pastas migrations e models.

## Configuração em migrations

Abra o arquivo de migração gerado para a tabela, crie o atributo nesse arquivo e configure a chave estrangeira da seguinte forma:
```
categoria_id: {
  allowNull: false,
  type: Sequelize.INTEGER,
  references: { model: 'categorias', key: 'id' }
}
```

No exemplo acima, o campo categoria_id faz referência ao campo id da tabela categorias, utilizando o campo references.

## Configuração em models

No arquivo de modelo correspondente, configure o relacionamento no método associate, utilizando o método de associate do Sequelize:

```
static associate(models) {
  Matricula.belongsTo(models.Pessoa, {
    foreignKey: 'estudante_id',
  });
  Matricula.belongsTo(models.Curso, {
    foreignKey: 'curso_id',
  });
}
```

No exemplo acima dizemos que Matricula pertence a tabela pessoa, com a FK estudante_id

## Métodos de Associação
O Sequelize oferece vários outros métodos para definir relacionamentos entre os modelos:

- belongsTo: Define uma associação onde o modelo atual pertence a outro modelo.
- hasMany: Define uma associação onde o modelo atual possui muitos registros de outro modelo.
- belongsToMany: Define uma associação de muitos-para-muitos entre dois modelos, geralmente por meio de uma tabela de junção.
  






