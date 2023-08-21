# tech-challange

TURMA 1SOAT GRUPO 16 <p>
Nomes: Rodrigo Padilha dos Santos, Thauã Corrêa Martins <p>
Emails: rodrigo.gts@hotmail.com, thaua-martins@hotmail.com <p>

## Descrição

O projeto é uma API em Node.js desenvolvida com Typescript e Express, seguindo o padrão arquitetural Hexagonal (Ports and Adapters). Ele fornece recursos para realizar determinadas ações relacionadas a um sistema de pedidos de uma hamburgueria.

## API de Pedidos - Guia de Integração
Bem-vindo à API de Pedidos! Este guia de integração irá fornecer todas as informações necessárias para você começar a criar e gerenciar pedidos em nossa plataforma.

### Fluxos do Pedido
1. Criar Cliente Anônimo

Antes de criar um pedido, é possível criar um cliente anônimo. O cliente anônimo é opcional e permite que um pedido seja realizado sem a necessidade de registro. Isso é ideal para clientes que desejam fazer um pedido único sem criar uma conta.

2. Criar Produto

Um pedido pode conter diferentes tipos de produtos, como lanches, bebidas e sobremesas. Antes de criar um pedido, você precisa cadastrar os produtos disponíveis em sua plataforma.

3. Criar Pedido

Após criar um cliente anônimo (opcional) e cadastrar os produtos disponíveis, você pode criar um novo pedido. Um pedido é criado com o status inicial "Aguardando pagamento".

4. Efetuar o Fake Checkout

Para simular uma transação de pagamento, você pode utilizar o Fake Checkout. O Fake Checkout é um processo simulado que não realiza uma transação real, mas atualiza o status do pedido para "Recebido".

5. Atualizar o Status do Pedido

Após o Fake Checkout, você pode atualizar o status do pedido à medida que ele progride em seu fluxo. Existem três status possíveis: "Em preparação", "Pronto" e "Finalizado".


## Documentação

### Diagrama DDD

https://miro.com/app/board/uXjVMK9dRs4=/

### OpenAPI
A documentação da API está disponível em http://localhost:3000/docs (após a exeução do projeto) onde você encontrará informações detalhadas sobre os endpoints, parâmetros, exemplos de requisições e respostas, entre outros.

### Documento

https://docs.google.com/document/d/1C6u0kgWQNvShfXWhoJ0bHcbBPxhyJGXQ/edit?usp=sharing&ouid=109120616548185377101&rtpof=true&sd=true

### Collections(Insomnia)

https://drive.google.com/file/d/1RxcRPGs7n-aEH1yHdXKwX02eWdRGwW43/view?usp=sharing

## Instalação e Execução

Para executar o projeto localmente, siga as etapas abaixo:

1. Certifique-se de ter o Node.js (min version 14.17) e o Docker instalados em sua máquina.
2. Clone este repositório.
3. Acesse o diretório do projeto via terminal.
4. Execute o comando `npm install` para instalar as dependências.
5. Execute o comando `docker-compose up` para iniciar os containers do banco de dados PostgreSQL e da aplicação.
6. O servidor estará disponível em [http://localhost:3000].

## Configuração

Você pode configurar algumas variáveis de ambiente para o funcionamento adequado do projeto. Para isso, renomeie o arquivo `.env.example` para `.env` e defina os valores necessários.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para enviar sugestões, relatar problemas ou enviar pull requests para este repositório.

