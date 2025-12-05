# Tecnologias / Ferramentas utilizadas
🔹 Front-end

    JavaScript, HTML/CSS
    React
    Vite
    TailWindCSS

🔹 Back-end

    Python
    Ambiente virtual Python (venv)
    FastAPI
    Uvicorn

🔹 Demais

    WebSockets

# Execução do Projeto

0. Requisitos
    Python 3.10
    Node v22.12

1. Clonar Repositório
    https://github.com/Joao-Nribeiro/Case-Itau-Engenharia-FullStack-Chat.git

    cd Case-Itau-Engenharia-FullStack-Chat


2. Habilitar FrontEnd:
    cd .\frontend\
    npm install
    npm run dev
    Aplicação em "http://localhost:5173/"

3. Habilitar BackEnd:
    cd .\backend\
    python -m venv v_env
    v_env\Scripts\activate
    pip install -r requirements.txt
    uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Estrutura do Projeto
Case-Itau-Engenharia-FullStack-Chat/
│
├── frontend/ 
│   ├── index.html
│   ├── node_modules/
│   ├── package.json
│   ├── package-lock.json
│   ├── yarn.lock
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── app.jsx
│       ├── index.css
│       └── main.jsx
│
├── backend/      
│   ├── main.py
│   ├── requirements.txt
│   ├── v_env/
│   └── app/
│       ├── routes/
│       └── services/
│
├── .gitignore
└── README.md

# **Decisões técnicas e justificativas**
    Escolha de tailwindCSS
        R: Menos arquivos CSS, menos poluição no código, facilidade na estilização e padronização (espaçamentos, cores etc)

    Escolha de FastAPI
        R: Assíncrono, ajuda na hora do envio de mensagens, rápido e vínculo com WebSockets

    Escolha do Vite
        R: Mais leve e rápido melhorando o build e deploy do projeto

    Problemas resolvidos:
        Envio em tempo real para diversos usuários - conexão com WebSocket de modo que cada usuário abre uma conexão com backend, o mesmo mantém uma lista com os usuários ativos fazendo o broadcast para todos na lista.
        
        Mudança de visualização de acordo com pessoas no chat - Envio de ACK conversando pelo backend e frontend, de modo que cada usuário envia uma confirmação de recebimento

        Reconexão - Persistência em localStorage, webSocket tenta refazer a conexão de tempo em tempo, cria lista de mensagens não enviadas para fazer reenvio.

    Trade-offs:
        Banco de dados;
        Autenticação simplificada;
        Backend simplificado (falta de robustez)

    Adicionais para futuro:
        Adição de banco de dados - tabelas para mensagens, usuários etc. Melhorando sistema de persistência e segurança

        Autenticação de usuários - Segurança, permissão (ex: admin, outros grupos)

        Deploy em produção e escalabidade de backend e WebSocket, permitindo que vários usuários se conectem sem problema.

## 🔥 DESAFIOS TÉCNICOS

### 1. **Gerenciamento de Conexões**
    Usuário é associado a um WebSocket pelo nome de usuário, fazendo com que seja possivel identificar clientes conectados e mensagens enviadas. 

### 2. **Broadcast Eficiente**
    Utilizando uma mensagem com estrutura
    {
        ID
        Usuário
        Texto
        Horário
    }

    É possível com que o backend envie a mensagem para todos os usuários ativos e através do sistema de ACK o usuário responde de volta para o servidor.

### 3. **Sistema de ACK**
    ACK é enviado assíncronamente, uma coisa permitida pelo FastAPI.
    Através da estrutura de mensagens, o ID permite que a mensagem seja rastreada, sendo assim cada cliente responde de volta o ACK, e o assicronismo evita o gargalo, caso um cliente tenha problemas de conexão

### 4. **Sincronização de Estado**
    Recebimento de mensagens por todos os usuários com a adição da ACK, o que permite que cada usuário responda se recebeu algo ou não, e a pessoa que enviou a mensagem se teve resposta ou não. Em caso de reconexão uma lista de mensagens sem respostas é salva e reenviada.

### 5. **Rastreamento de Mensagens**
    O rastreamento dos IDs das mensagens permite que cada mensagem seja unica, o que permite localiza-la e ver quem recebeu através do reenvio de ACK de leitura e resposta. Com isso é possivel atualizar tanto visualmente com os checks, como no backend por "read, received etc"

### 6. **Desconexões**
    O servidor detecta uma desconexão quando uma exceção de "WebSocketDisconnect" é lançada, fazendo com que o usuário desse webSocket seja removido da lista de usuários ativos. O sistema tenta reconectar o usuário por backoff, e as mensagens que são enviadas enquanto não há usuários no chat, ou quando o websocket está offline é armazenado em uma lista de mensagens pendentes de ACK.

### 7. **Tratamento de Erros** 
    Caso um usuário caia, primeiramente há uma tentativa de reconexão através de backoff incremental, as mensagens são salvas em uma llistas de mensagens pendentes de ACK e são reenviadas quando uma conexão é estabelecida novamente.