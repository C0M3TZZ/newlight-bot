const { Events } = require("discord.js");

module.exports = {
  type: Events.InteractionCreate,
  once: true,
  async run(interaction) {
    if (!interaction.type === 3) return;
    interaction.values.forEach(async (value) => {
      try {
        if (!interaction.member.roles.cache.some((role) => role.id === value)) {
          await interaction.member.roles.add(value);
        }
      } catch (error) {}
    });
    interaction.reply({
      content: "ดำเนินการเสร็จเรียบร้อย",
      ephemeral: true,
    });
  }
};
