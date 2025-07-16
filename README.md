<h1>Desafio de projeto - Champions Node Express API</h1>

<br />

<div align="center">
	<img src="https://i.imgur.com/Ujm3lN7.png" title="source: imgur.com" width="50%"/>
</div>


<br />

<div align="center">
  <img src="https://img.shields.io/github/languages/top/rafaelq80/projeto-mario-kart-race?style=flat-square" />
  <img src="https://img.shields.io/github/repo-size/rafaelq80/projeto-mario-kart-race?style=flat-square" />
  <img src="https://img.shields.io/github/languages/count/rafaelq80/projeto-mario-kart-race?style=flat-square" />
  <img src="https://img.shields.io/github/last-commit/rafaelq80/projeto-mario-kart-race?style=flat-square" />
  <img src="https://img.shields.io/github/issues/rafaelq80/projeto-mario-kart-race?style=flat-square" />
  <img src="https://img.shields.io/github/issues-pr/rafaelq80/projeto-mario-kart-race?style=flat-square" />
  <img src="https://img.shields.io/badge/status-conclu%C3%ADdo-brightgreen" alt="Status: Concluído">
</div>

<br />

API RESTful para gerenciamento de clubes, jogadores e estatísticas da Champions League. Desenvolvida com **Node.js**, **TypeScript**, **Express** e **Prisma ORM**, conta também com **documentação interativa via Swagger**, facilitando a exploração e o consumo dos endpoints.

<br />

## 📦 Tecnologias Utilizadas

| Tecnologia                                            | Descrição                                          |
| ----------------------------------------------------- | -------------------------------------------------- |
| [**Node.js**](https://nodejs.org)                     | Runtime JavaScript                                 |
| [**TypeScript**](https://www.typescriptlang.org)      | Tipagem estática para JavaScript                   |
| [**Express**](https://expressjs.com)                  | Framework minimalista para APIs                    |
| [**Prisma ORM**](https://www.prisma.io)               | Mapeamento objeto-relacional                       |
| [**SQLite**](https://www.sqlite.org)                  | Banco de dados leve e embutido                     |
| [**CORS**](https://www.npmjs.com/package/cors)        | Middleware para habilitar requisições cross-origin |
| [**Swagger UI**](https://swagger.io/tools/swagger-ui) | Interface de documentação interativa da API        |

<br />

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) (v16 ou superior)
- npm ou yarn

<br />

## 🛠️ Instalação e Configuração

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd projeto-champions-express
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz com o conteúdo abaixo:

```env
DATABASE_URL="file:./champions.db"
```

### 4. Configure o Banco de Dados

```bash
# Gerar cliente Prisma
npm run db:generate

# Executar migrations
npm run db:migrate
```

### 5. Migrar Dados Iniciais

```bash
npm run migrate
```

<br />

## ▶️ Executando o Projeto

### Ambiente de Desenvolvimento

```bash
# Inicia o servidor em modo dev
npm run start:dev

# Com hot reload
npm run start:watch
```

### Ambiente de Produção

```bash
# Gera os arquivos de build
npm run dist

# Inicia o servidor em produção
npm run start:dist
```

<br />

## 🎲 Banco de Dados

### Estrutura das Tabelas

### 🏟️ Tabela `clubs`

| Campo  | Descrição           | Observações     |
| ------ | ------------------- | --------------- |
| `id`   | Identificador único | Auto-incremento |
| `name` | Nome do clube       | Valor único     |

------

### ⚽ Tabela `players`

| Campo         | Descrição           | Observações                 |
| ------------- | ------------------- | --------------------------- |
| `id`          | Identificador único | Auto-incremento             |
| `name`        | Nome do jogador     | —                           |
| `nationality` | Nacionalidade       | —                           |
| `position`    | Posição no campo    | Ex: ST, LW, GK...           |
| `clubId`      | ID do clube         | Chave estrangeira (`clubs`) |

------

### 📊 Tabela `statistics`

| Campo       | Descrição           | Observações                           |
| ----------- | ------------------- | ------------------------------------- |
| `id`        | Identificador único | Auto-incremento                       |
| `overall`   | Habilidade geral    | Valor de 0 a 100                      |
| `pace`      | Velocidade          | Valor de 0 a 100                      |
| `shooting`  | Finalização         | Valor de 0 a 100                      |
| `passing`   | Passe               | Valor de 0 a 100                      |
| `dribbling` | Drible              | Valor de 0 a 100                      |
| `defending` | Defesa              | Valor de 0 a 100                      |
| `physical`  | Físico              | Valor de 0 a 100                      |
| `playerId`  | ID do jogador       | Chave estrangeira (`players`) — único |

<br />

### Comandos Úteis

```bash
npm run db:generate    # Gera o cliente Prisma
npm run db:migrate     # Executa migrations
npm run db:studio      # Abre o Prisma Studio
npm run migrate        # Migra dados JSON para o banco
```

<br />

## 📝 Observações

- O banco SQLite (`champions.db`) é armazenado na raiz do projeto.
- O script `npm run migrate` popula automaticamente as tabelas com dados JSON.
- Os repositórios utilizam `try/catch` com tratamento de erros via `console.error`.
- Interfaces TypeScript antigas são usadas como apoio, mas o modelo principal é o Prisma Schema.
- Swagger UI está acessível na **rota raiz** (`/`) com interface personalizada.

<br />

## 📚 Endpoints da API

### 🔍 Documentação Interativa

Disponível via Swagger:

```
http://localhost:3000/api/docs/
```

### 🌐 Base URL

```
http://localhost:3000/api
```

### ✅ Health Check

```
GET /health
```

------

### 🏟️ Endpoints de Clubes

| Método | Rota         | Descrição             |
| ------ | ------------ | --------------------- |
| GET    | `/clubs`     | Lista todos os clubes |
| GET    | `/clubs/:id` | Busca clube por ID    |
| POST   | `/clubs`     | Cria novo clube       |
| PUT    | `/clubs/:id` | Atualiza clube        |
| DELETE | `/clubs/:id` | Remove clube          |

#### Exemplo de criação:

```json
POST /clubs
Content-Type: application/json

{
  "name": "Nome do Clube"
}
```

------

### ⚽ Endpoints de Jogadores

| Método | Rota           | Descrição                |
| ------ | -------------- | ------------------------ |
| GET    | `/players`     | Lista todos os jogadores |
| GET    | `/players/:id` | Busca jogador por ID     |
| POST   | `/players`     | Cria novo jogador        |
| PUT    | `/players/:id` | Atualiza jogador         |
| DELETE | `/players/:id` | Remove jogador           |

#### Exemplo de criação:

```json
POST /players
Content-Type: application/json

{
  "name": "Nome do Jogador",
  "nationality": "Brasil",
  "position": "ST",
  "clubId": 1,
  "statistics": {
    "overall": 85,
    "pace": 80,
    "shooting": 85,
    "passing": 75,
    "dribbling": 80,
    "defending": 40,
    "physical": 75
  }
}
```

<br />

## 🔧 Scripts Disponíveis

| Script        | Descrição                               |
| ------------- | --------------------------------------- |
| `start:dev`   | Executa em modo desenvolvimento         |
| `start:watch` | Executa com hot reload                  |
| `start:dist`  | Executa versão de produção              |
| `dist`        | Gera build para produção                |
| `migrate`     | Popula banco a partir dos arquivos JSON |
| `db:generate` | Gera o cliente Prisma                   |
| `db:migrate`  | Executa as migrations                   |
| `db:studio`   | Abre o Prisma Studio                    |

<br />

## 📁 Estrutura de Diretórios

```
src/
├── controllers/          # Lida com as requisições
├── data/                 # Arquivos JSON com dados iniciais
├── generated/            # Cliente Prisma gerado
├── repositories/         # Acesso ao banco via Prisma
├── scripts/              # Script de migração de dados
├── services/             # Regras de negócio
├── utils/                # Funções utilitárias
├── app.ts                # Configuração da aplicação
├── routes.ts             # Definição das rotas
└── server.ts             # Inicialização do servidor
```

<br />

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/NovaFeature`)
3. Commit suas alterações (`git commit -m 'feat: adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

<br />

## 📄 Licença

Este projeto é apenas para fins educacionais e demonstrativos. Champions League é marca registrada da UEFA.

<br />

⭐ Se este projeto foi útil para você, não esqueça de deixar uma estrela!