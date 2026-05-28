const https = require("https");

const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const LETTERS_NUMBERS = "abcdefghijklmnopqrstuvwxyz0123456789";

function randomString(length, lettersOnly = false) {
  const chars = lettersOnly ? LETTERS : LETTERS_NUMBERS;

  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

function generateUsername() {
  const generators = [
    () => randomString(3, false),
    () => randomString(3, true),
    () => randomString(4, false),
    () => randomString(4, true),
  ];

  return generators[Math.floor(Math.random() * generators.length)]();
}

const username = generateUsername();

const payload = JSON.stringify({
  content: null,
  embeds: [
    {
      title: "New User Available!",
      description: `\`\`\`${username}\`\`\``,
      footer: {
        text: "@frauding"
      },
      timestamp: new Date().toISOString()
    }
  ],
  attachments: []
});

const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

if (!webhookUrl) {
  console.error("Missing DISCORD_WEBHOOK_URL secret.");
  process.exit(1);
}

const url = new URL(webhookUrl);

const options = {
  hostname: url.hostname,
  path: url.pathname + url.search,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload)
  }
};

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);

  res.on("data", () => {});

  res.on("end", () => {
    console.log("Webhook sent successfully.");
    process.exit(0);
  });
});

req.on("error", (error) => {
  console.error(error);
  process.exit(1);
});

req.write(payload);
req.end();
