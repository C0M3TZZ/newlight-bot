const fs = require("fs");
const path = require("path");
const {
  Client,
  Events,
  GatewayIntentBits,
} = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const eventFiles = fs
  .readdirSync(path.join(__dirname, "events"))
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  console.log(`Loading event ${file}`);
  const event = require(path.join(__dirname, "events", file));
  if (event.once) {
    client.once(event.type, (...args) => event.run(...args));
  } else {
    client.on(event.type, (...args) => event.run(...args));
  }
}

client.on(Events.InteractionCreate, async (interaction) => {

});

client.on(Events.ClientReady, async (client) => {
  
});

client.login();
