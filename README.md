# botdecadastro

# 🤖 Bot de Cadastro WhatsApp (Atendimento + Coleta de Dados)

Este projeto é um bot de WhatsApp feito em **Node.js** usando **whatsapp-web.js** (WhatsApp Web).
Ele automatiza o primeiro atendimento e coleta dados do cliente para agilizar o suporte.

---

## ✅ O que ele faz (Como funciona)

1. **Cliente manda qualquer mensagem**
   - O bot inicia automaticamente o atendimento.

2. **Perguntas para cadastro**
   - Pede **Nome completo**
   - Pede **CEP**
   - Pede **Motivo do contato**

3. **Confirmação dos dados**
   - O bot mostra um resumo com:
     - Nome
     - CEP
     - Motivo
   - O cliente confirma:
     - Digita `1` = dados corretos
     - Digita `2` = refazer cadastro

4. **Após confirmar**
   - O bot responde para o cliente:
     - “✅ Dados recebidos, estamos analisando…”
   - O bot envia uma **ficha completa para o ADM** (sem o cliente ver), com:
     - Nome
     - WhatsApp do cliente
     - CEP
     - Motivo

5. **Depois disso**
   - Se o cliente mandar outras mensagens, o bot informa que os dados já estão em análise e que o atendente responderá.

---

## 🧱 Como foi criado (Tecnologia usada)

- **Node.js**: roda o bot no computador
- **whatsapp-web.js**: controla o WhatsApp via WhatsApp Web
- **qrcode-terminal**: mostra o QR Code no terminal
- **LocalAuth**: salva a sessão localmente (para não escanear QR toda vez)

---

## ✅ Pré-requisitos

- [Node.js](https://nodejs.org/) (recomendado v18+)
- [VS Code](https://code.visualstudio.com/) (opcional, mas recomendado)
- WhatsApp instalado no celular

---

## 📥 Como usar depois que clonar o repositório

### 1) Clonar o projeto
```bash
git clone https://github.com/SEU-USUARIO/SEU-REPO.git
cd SEU-REPO
