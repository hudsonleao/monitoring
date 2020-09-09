**SISTEMA PARA MONITORAMENTO DAS APLICAÇÕES**

**Funcionamento**

>  O sistema irá verificar todas as URL cadastradas, para respostas diferente de 200 ou 401 ele irá adicionar no campo attemps_error o valor atual do campo mais 1, ao atingir 3 erros o sistema irá
>  enviar uma mensagem no telegram informando da queda do serviço. Após percorrer todas as url's o sistema aguardará 10 segundos até verificar novamente. Há também a verificação se o serviço voltou
>  a funcionar, funciona da mesma forma da indisponibilidade, após 3 respostas ele irá alertar no telegram da normalização do serviço.

***ROTAS:***

**Realiza a verificação dos dados e o login**

`METHOD POST: /login/`



**Listar servidores**

`METHOD GET: /servers/`

**Renderiza a view para preenchimento dos campos e adição de um servidor**

`METHOD GET: /servers/add`

**Salva o novo servidor no banco**

`METHOD POST: /servers/add`

**Renderiza a view para preenchimento dos campos e edição de um servidor**

`METHOD GET: /servers/edit`

**Salva a edição do servidor**

`METHOD PUT: /servers/edit`



**Cadastrar novo usuário**

`METHOD GET: /cadastro/`

**Salva novo usuário**

`METHOD POST: /cadastro/add/`


**Usuário e senha padrão**

*  Usuário: admin@monitoramos.com.br

*  Senha: as3122Wdskdi4mvh