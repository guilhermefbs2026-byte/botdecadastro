const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");

// ============================================================
// ⚙️ CONFIGURAÇÕES - EDITE AQUI
// ============================================================
const CONFIG = {
  NUMERO_ADM: "5593917260400", // ← SEU NÚMERO (com 55)
  DELAY_MIN: 1500,
  DELAY_MAX: 3000,
  DISPARO_ATIVO: false,
};
// ============================================================

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const estados = {};

client.on("qr", (qr) => {
  console.clear();
  qrcode.generate(qr, { small: true });
  console.log("📱 Escaneie o QR Code!");
});

client.on("ready", () => console.log("✅ Bot conectado!"));

client.on("message", async (msg) => {
  const chat = await msg.getChat();
  const texto = msg.body.trim();
  const numero = msg.from;

  if (msg.fromMe || chat.isGroup) return;

  await chat.sendStateTyping();
  await delay(
    Math.floor(Math.random() * (CONFIG.DELAY_MAX - CONFIG.DELAY_MIN)) +
      CONFIG.DELAY_MIN,
  );

  if (!estados[numero]) {
    estados[numero] = { etapa: "inicio", nome: "", cep: "", motivo: "" };
  }

  const estado = estados[numero];

  // --- ETAPA 1: INÍCIO ---
  if (estado.etapa === "inicio") {
    estado.etapa = "aguardando_nome";
    await msg.reply(
      "👋 *Olá! Tudo bem?*\n\nPara agilizar seu atendimento, preciso de algumas informações.\n\n📝 *Qual seu nome completo?*",
    );
    return;
  }

  // --- ETAPA 2: NOME ---
  if (estado.etapa === "aguardando_nome") {
    estado.nome = texto;
    estado.etapa = "aguardando_cep";
    await msg.reply(
      `Obrigado, *${estado.nome.split(" ")[0]}*!\n\n📍 *Qual seu CEP?* (apenas números)`,
    );
    return;
  }

  // --- ETAPA 3: CEP ---
  if (estado.etapa === "aguardando_cep") {
    estado.cep = texto.replace(/\D/g, "");
    estado.etapa = "aguardando_motivo";
    await msg.reply("💬 *Qual o motivo do seu contato?*");
    return;
  }

  // --- ETAPA 4: MOTIVO ---
  if (estado.etapa === "aguardando_motivo") {
    estado.motivo = texto;
    estado.etapa = "confirmacao";

    // Mostra os dados para o cliente conferir
    const resumo =
      `🔍 *POR FAVOR, CONFIRME SEUS DADOS:*\n\n` +
      `👤 *Nome:* ${estado.nome}\n` +
      `📍 *CEP:* ${estado.cep}\n` +
      `💬 *Motivo:* ${estado.motivo}\n\n` +
      `✅ Digite *1* se os dados estão CORRETOS\n` +
      `❌ Digite *2* para REFAZER o cadastro`;

    await msg.reply(resumo);
    return;
  }

  // --- ETAPA 5: CONFIRMAÇÃO ---
  if (estado.etapa === "confirmacao") {
    if (texto === "1") {
      estado.etapa = "concluido";
      await msg.reply(
        "🚀 *Perfeito! Seus dados foram enviados.*\n\nEstamos analisando as informações e um atendente entrará em contato em instantes. 🙏",
      );

      // ENVIA PARA O ADM
      const fichaAdm =
        `🔔 *NOVO CLIENTE CADASTRADO*\n\n` +
        `👤 *Nome:* ${estado.nome}\n` +
        `📱 *WhatsApp:* ${numero.replace("@c.us", "")}\n` +
        `📍 *CEP:* ${estado.cep}\n` +
        `💬 *Motivo:* ${estado.motivo}\n\n` +
        `_Responda este número para iniciar o atendimento._`;

      const admId = CONFIG.NUMERO_ADM.includes("@c.us")
        ? CONFIG.NUMERO_ADM
        : `${CONFIG.NUMERO_ADM}@c.us`;
      await client.sendMessage(admId, fichaAdm);
    } else if (texto === "2") {
      estado.etapa = "aguardando_nome";
      await msg.reply(
        "Sem problemas! Vamos recomeçar.\n\n📝 *Qual seu nome completo?*",
      );
    } else {
      await msg.reply(
        "Por favor, escolha uma opção:\n\n1 - Dados estão corretos\n2 - Refazer cadastro",
      );
    }
    return;
  }

  // --- ETAPA FINAL ---
  if (estado.etapa === "concluido") {
    await msg.reply(
      "✅ Seus dados já estão em análise. Aguarde o retorno do atendente.",
    );
  }
});

client.initialize();
