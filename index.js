const {
  makeWASocket,
  useMultiFileAuthState,
} = require("@whiskeysockets/baileys");
const pino = require("pino");

async function connectWhatsapp() {
  const auth = await useMultiFileAuthState("session");
  const socket = makeWASocket({
    // can provide additional config here
    printQRInTerminal: true,
    browser: ["Z e e", "", ""],
    auth: auth.state,
    logger: pino({ level: "silent" }),
  });

  socket.ev.on("creds.update", auth.saveCreds);
  socket.ev.on("connection.update", async ({ connection }) => {
    if (connection === "open") {
      console.log("BOT WA SUDAH SIAP DIGUNAKAN ✅");
    } else if (connection === "close") {
      await connectWhatsapp();
    }
  });

  socket.ev.on("messages.upsert", async ({ messages, type }) => {
    const chat = messages[0];
    const pesan =
      chat.message?.extendedTextMessage?.text ??
      chat.message?.ephemeralMessage?.message?.extendedTextMessage?.text ??
      chat.message?.conversation;

    if (pesan == ".ping") {
      await socket.sendMessage(chat.key.remoteJid, { text: "hello world" });
    }

    if (pesan == "P") {
      await socket.sendMessage(chat.key.remoteJid, {
        text: "status: 🅿 pending",
      });
    }

    if (pesan == "youku") {
      await socket.sendMessage(chat.key.remoteJid, {
        text: "⚡ YOUKU ⚡\n🔗 SHARING\n1 Tahun 10K\n🎯Akun dari store\n🎯Garansi akun 6 bulan",
      });
    }

    if (pesan === "format order") {
      await socket.sendMessage(chat.key.remoteJid, {
        text: `🐻 *FORM ORDER APP PREMIUM* 🐻
• Tgl Order : 
• Aplikasi :
• Plan : 
• Durasi : 
• Payment via : 
• Email :  
• Pass : 
      
🐻 *FORM ORDER NETFLIX* 🐻
• Tgl order :
• User :
• Durasi : 
• Tipe device + Merk : 
• Plan : 
• Lokasi : 
📍 Send form max 1x24 jam`,
      });
    }

    if (pesan.startsWith(".h ")) {
      const teks = pesan.substring(3);

      await socket.sendMessage(chat.key.remoteJid, { text: teks });
    }
  });
}

connectWhatsapp();
