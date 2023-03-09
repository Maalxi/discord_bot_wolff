const { Events } = require("discord.js");

module.exports = {
  event: {
    name: Events.InteractionCreate,
    eventName: "interaction create",
    once: false,
    async execute(client, interaction) {
      if (!interaction.isChatInputCommand()) return;

      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `[INTERACTION_EVENT] No command matching ${interaction.commandName} was found`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        await interaction.reply({
          content: "There was an error while executing this command",
          ephemeral: true,
        });
        console.error(
          `[INTERACTION_EVENT] An error occurred while executing command : ${command.name}\n`,
          error
        );
      }
    },
  },
};
