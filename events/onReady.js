const { Events } = require("discord.js");

module.exports = {
  type: Events.ClientReady,
  once: true,
  async run(client) {
    console.log(`Logged in as ${client.user.tag}!`);
  }
};
