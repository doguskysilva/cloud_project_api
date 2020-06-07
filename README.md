# Instruções

Para os testes basta importar no Postman o arquivo Task_API.postman_collection.json e trocar a variável *{{host}}* pelo endpoint da aplicação.

Uma vez a aplicação no ar, chame o endpoint inicial http://seu.host/, pois ele possui a estrutura para inserir os dados de teste na aplicação e cria a tabela de task caso ela não exista.

O endpoint */restart* apaga todos os items da tabela.