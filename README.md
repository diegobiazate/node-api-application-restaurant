## Link da Documentação

http://ec2-15-229-66-47.sa-east-1.compute.amazonaws.com:4000/api-docs/


## Recursos da API

### /restaurant

- /listAll

  - endpoint responsável por listar todos os restaurantes.

- /find

  - endpoint responsável por realizar buscas por nome dos restaurantes.

- /create

  - endpoint responsável por realizar a criação de um novo restaurante.

- /edit

  - endpoint responsável por realizar a edição de um restaurante.

- /delete

  - endpoint responsável por realziar a exclusão de um restaurante.

### /openingHours

- /list

  - endpoint responsável por lista todos os horários de funcionamento, de todos os restaurantes.

- /findByIdRestaurant

  - endpoint responsável por listar todos os horários de funcionamento de um restaurante em específico

- /isOpen

  - endpoint responsável por informar se o restaurante está aberto ou fechado.
  - observações:
    - Neste endpoint existem 2 parâmetros opicionais `date_time` e `id_restaurant`.
    - Caso seja enviado o `date_time`, respeitar o formato aceito: `YYYY-MM-DD HH:mm`, exemplo: `2023-01-16 08:00`.
    - Caso seja informado o `id_restaurant`, irá retornar somente se este restaurante está aberto, caso não informe, será retornado a informação de todos os restaurantes abertos/fechados.
    - Caso não seja enviado o `date_time`, o endpoint pegará o dia/hora atual para realziar a busca.

- /create

  - endpoint responsável por realizar a criação de um novo horário de funcionamento.
  - observações:
    - Para realizar o cadastro de um novo horário de funcionamento, é necessário informar o `opening_time` e `closing_time` no seguinte formato: `HH:mm`.
    - A informação de `weekday`, que seria o dia da semana, é necessário informar um valor numérico, conforme o modelo:
      - Segunda = 1;
      - Terça = 2;
      - Quarta = 3;
      - Quinta = 4;
      - Sexta = 5;
      - Sábado = 6;
      - Domingo = 7;

- /edit

  - endpoint responsável por realizar a edição de um horário de funcionamento.

- /delete

  - endpoint responsável por realizar a exclusão de um horário de funcionamento.

