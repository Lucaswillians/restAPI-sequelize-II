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

