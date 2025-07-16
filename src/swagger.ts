/**
 * Configuração do Swagger
 * @description Documentação da API Champions Express
 * @author Champions Express
 */

import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Champions Express API',
    description: 'API RESTful para gerenciamento de clubes e jogadores de futebol',
    version: '1.0.0',
    contact: {
      name: 'Rafael Queiróz',
      email: 'rafaelproinfo@gmail.com',
      url: 'https://github.com/rafaelq80'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Servidor de Desenvolvimento'
    }
  ],
  tags: [
    {
      name: 'Health Check',
      description: 'Endpoints de verificação de saúde da API'
    },
    {
      name: 'Clubes',
      description: 'Gerenciamento de clubes de futebol'
    },
    {
      name: 'Jogadores',
      description: 'Gerenciamento de jogadores e suas estatísticas'
    }
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health Check'],
        summary: 'Verificar saúde da API',
        description: 'Retorna o status da API e informações básicas',
        responses: {
          '200': {
            description: 'API funcionando corretamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'OK'
                    },
                    message: {
                      type: 'string',
                      example: 'API Champions Express está funcionando!'
                    },
                    timestamp: {
                      type: 'string',
                      format: 'date-time',
                      example: '2024-01-16T19:30:00.000Z'
                    },
                    version: {
                      type: 'string',
                      example: '1.0.0'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/clubs': {
      get: {
        tags: ['Clubes'],
        summary: 'Listar todos os clubes',
        description: 'Retorna todos os clubes cadastrados no banco de dados',
        responses: {
          '200': {
            description: 'Lista de clubes retornada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Club'
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Clubes'],
        summary: 'Criar novo clube',
        description: 'Cria um novo clube no banco de dados',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: {
                    type: 'string',
                    description: 'Nome do clube',
                    example: 'Real Madrid'
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Clube criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Club'
                }
              }
            }
          },
          '400': {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/clubs/{id}': {
      get: {
        tags: ['Clubes'],
        summary: 'Buscar clube por ID',
        description: 'Retorna um clube específico pelo seu ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID do clube',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          '200': {
            description: 'Clube encontrado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Club'
                }
              }
            }
          },
          '404': {
            description: 'Clube não encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Clubes'],
        summary: 'Atualizar clube',
        description: 'Atualiza um clube existente no banco de dados',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID do clube',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Novo nome do clube',
                    example: 'Real Madrid CF'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Clube atualizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Club'
                }
              }
            }
          },
          '404': {
            description: 'Clube não encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Clubes'],
        summary: 'Remover clube',
        description: 'Remove um clube do banco de dados',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID do clube',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          '200': {
            description: 'Clube removido com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Clube removido com sucesso'
                    }
                  }
                }
              }
            }
          },
          '404': {
            description: 'Clube não encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/players': {
      get: {
        tags: ['Jogadores'],
        summary: 'Listar todos os jogadores',
        description: 'Retorna todos os jogadores cadastrados com suas estatísticas e clube',
        responses: {
          '200': {
            description: 'Lista de jogadores retornada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Player'
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Jogadores'],
        summary: 'Criar novo jogador',
        description: 'Cria um novo jogador no banco de dados com estatísticas opcionais',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'nationality', 'position', 'clubId'],
                properties: {
                  name: {
                    type: 'string',
                    description: 'Nome do jogador',
                    example: 'Vinicius Jr'
                  },
                  nationality: {
                    type: 'string',
                    description: 'Nacionalidade do jogador',
                    example: 'Brasil'
                  },
                  position: {
                    type: 'string',
                    description: 'Posição no campo',
                    example: 'LW'
                  },
                  clubId: {
                    type: 'integer',
                    description: 'ID do clube',
                    example: 1
                  },
                  statistics: {
                    $ref: '#/components/schemas/StatisticsInput'
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Jogador criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Player'
                }
              }
            }
          },
          '400': {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/players/{id}': {
      get: {
        tags: ['Jogadores'],
        summary: 'Buscar jogador por ID',
        description: 'Retorna um jogador específico pelo seu ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID do jogador',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          '200': {
            description: 'Jogador encontrado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Player'
                }
              }
            }
          },
          '404': {
            description: 'Jogador não encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Jogadores'],
        summary: 'Atualizar jogador',
        description: 'Atualiza um jogador existente no banco de dados',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID do jogador',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Nome do jogador',
                    example: 'Vinicius Jr Silva'
                  },
                  nationality: {
                    type: 'string',
                    description: 'Nacionalidade do jogador',
                    example: 'Brasil'
                  },
                  position: {
                    type: 'string',
                    description: 'Posição no campo',
                    example: 'LW'
                  },
                  clubId: {
                    type: 'integer',
                    description: 'ID do clube',
                    example: 1
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Jogador atualizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Player'
                }
              }
            }
          },
          '404': {
            description: 'Jogador não encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Jogadores'],
        summary: 'Remover jogador',
        description: 'Remove um jogador do banco de dados (incluindo suas estatísticas)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID do jogador',
            schema: {
              type: 'integer',
              example: 1
            }
          }
        ],
        responses: {
          '200': {
            description: 'Jogador removido com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Jogador removido com sucesso'
                    }
                  }
                }
              }
            }
          },
          '404': {
            description: 'Jogador não encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Club: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'ID único do clube',
            example: 1
          },
          name: {
            type: 'string',
            description: 'Nome do clube',
            example: 'Real Madrid'
          },
          players: {
            type: 'array',
            description: 'Lista de jogadores do clube',
            items: {
              $ref: '#/components/schemas/Player'
            }
          }
        }
      },
      Player: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'ID único do jogador',
            example: 1
          },
          name: {
            type: 'string',
            description: 'Nome do jogador',
            example: 'Vinicius Jr'
          },
          nationality: {
            type: 'string',
            description: 'Nacionalidade do jogador',
            example: 'Brasil'
          },
          position: {
            type: 'string',
            description: 'Posição no campo',
            example: 'LW'
          },
          clubId: {
            type: 'integer',
            description: 'ID do clube',
            example: 1
          },
          club: {
            $ref: '#/components/schemas/Club'
          },
          statistics: {
            $ref: '#/components/schemas/Statistics'
          }
        }
      },
      Statistics: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'ID único das estatísticas',
            example: 1
          },
          overall: {
            type: 'integer',
            description: 'Habilidade geral (0-100)',
            example: 88
          },
          pace: {
            type: 'integer',
            description: 'Velocidade (0-100)',
            example: 95
          },
          shooting: {
            type: 'integer',
            description: 'Finalização (0-100)',
            example: 79
          },
          passing: {
            type: 'integer',
            description: 'Passe (0-100)',
            example: 74
          },
          dribbling: {
            type: 'integer',
            description: 'Drible (0-100)',
            example: 90
          },
          defending: {
            type: 'integer',
            description: 'Defesa (0-100)',
            example: 29
          },
          physical: {
            type: 'integer',
            description: 'Físico (0-100)',
            example: 64
          },
          playerId: {
            type: 'integer',
            description: 'ID do jogador',
            example: 1
          }
        }
      },
      StatisticsInput: {
        type: 'object',
        properties: {
          overall: {
            type: 'integer',
            description: 'Habilidade geral (0-100)',
            example: 88
          },
          pace: {
            type: 'integer',
            description: 'Velocidade (0-100)',
            example: 95
          },
          shooting: {
            type: 'integer',
            description: 'Finalização (0-100)',
            example: 79
          },
          passing: {
            type: 'integer',
            description: 'Passe (0-100)',
            example: 74
          },
          dribbling: {
            type: 'integer',
            description: 'Drible (0-100)',
            example: 90
          },
          defending: {
            type: 'integer',
            description: 'Defesa (0-100)',
            example: 29
          },
          physical: {
            type: 'integer',
            description: 'Físico (0-100)',
            example: 64
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Tipo do erro',
            example: 'Erro de validação'
          },
          message: {
            type: 'string',
            description: 'Mensagem de erro',
            example: 'Dados inválidos fornecidos'
          }
        }
      }
    }
  }
};

/**
 * Configura o Swagger na aplicação Express
 * @param app - Instância da aplicação Express
 */
export function setupSwagger(app: Express): void {
  const swaggerOptions = {
    customCss: `
      /* Adiciona logo personalizado à topbar padrão */
      .swagger-ui .topbar .topbar-wrapper .link::before {
        content: '🏆 ';
        margin-right: 0.5rem;
      }
      
      /* Melhorias gerais */
      .swagger-ui {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      
      .swagger-ui .opblock {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        margin-bottom: 1rem;
      }
      
      .swagger-ui .opblock .opblock-summary {
        border-radius: 8px 8px 0 0;
      }
      
      .swagger-ui .btn.execute {
        background-color: #667eea;
        border-color: #667eea;
      }
      
      .swagger-ui .btn.execute:hover {
        background-color: #5a6fd8;
        border-color: #5a6fd8;
      }
      
      /* Responsividade */
      @media (max-width: 768px) {
        .swagger-ui .topbar .topbar-wrapper .link {
          font-size: 1rem;
        }
      }
    `,
    customSiteTitle: 'Champions Express API - Documentação',
    customfavIcon: '/favicon.ico'
  };

  // Configuração do Swagger UI
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
}