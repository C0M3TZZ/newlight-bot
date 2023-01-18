const { Events } = require("discord.js");
const express = require("express");
const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports = {
  type: Events.ClientReady,
  once: true,
  async run(client) {
    const app = express();
    const port = 3000;

    app.use(express.json());

    app.post("/send/:roleId/:channelId", async (req, res) => {
      console.log("Send");
      let roleId = req.params.roleId;
      let channelId = req.params.channelId;
      let message = "";
      const roleMenu = await prisma.roleMenu.findFirst({
        where: {
          id: roleId,
        },
      });

      let guild = "";
      try {
        guild = await client.guilds.fetch(roleMenu.guildId);
      } catch (error) {
        guild = null;
      }
      if (!guild) {
        res.status(404).send("Guild not found");
        return;
      }

      let channel = "";
      try {
        channel = await guild.channels.fetch(channelId);
      } catch (error) {
        channel = null;
      }
      if (!channel) {
        res.status(404).send("Channel not found");
        return;
      }

      const body = req.body;

      if (body.message) {
        message = body.message;
      } else {
        message = "";
      }

      const roles = roleMenu.roles.map((role) => {
        return {
          label: role.name,
          description: role.desc,
          value: role.roleId,
          emoji: role.emoji,
        };
      });

      const selectMenu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("roleMenu")
          .setPlaceholder("Select a role")
          .addOptions(roles)
          .setMinValues(1)
          .setMaxValues(roleMenu.max)
      );
      try {
        if (roleMenu.channelId == channelId && roleMenu.messageId) {
          try {
            const oldMessage = await channel.messages.fetch(roleMenu.messageId);
            await oldMessage.edit({
              content: message,
              components: [selectMenu],
            });
            res.send({
              message: "Success",
            });
            return;
          } catch (error) {}
        }

        const messa = await channel.send({
          content: message,
          components: [selectMenu],
        });
        await prisma.roleMenu.update({
          where: { id: roleId },
          data: {
            channelId: channelId,
            messageId: messa.id,
          },
        });
      } catch (error) {
        console.log(error);
        res.status(500).send("Missing Access");
        return;
      }
      res.send({
        message: "Success",
      });
    });

    app.listen(port, () => {
      console.log(`API Online at http://localhost:${port}`);
    });
  },
};
