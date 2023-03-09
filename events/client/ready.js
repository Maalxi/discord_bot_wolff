const { Events, REST, Routes } = require("discord.js");
const { promisify } = require("util");
const { glob } = require("glob");
const pGlob = promisify(glob);

module.exports = {
  event: {
    name: Events.ClientReady,
    eventName: "start bot",
    once: true,
    async execute(client) {
      const commands = [];

      (await pGlob(`${process.cwd()}/features/*/index.js`)).map(
        async (featureFile) => {
          const feature = require(featureFile);

          if (!feature.command.data) {
            console.error(
              `[EVENT_READY] The feature command at ${featureFile} is missing a required "data" property`
            );
            return;
          }

          commands.push(feature.command.data.toJSON());
        }
      );

      const rest = new REST({ version: "10" }).setToken(
        process.env.DISCORD_TOKEN
      );

      await (async () => {
        try {
          console.log(
            `Started refreshing ${commands.length} application (/) commands`
          );

          const data = await rest.put(
            Routes.applicationGuildCommands(
              process.env.CLIENT_ID,
              process.env.GUILD_ID
            ),
            { body: commands }
          );

          console.log(
            `Successfully reloaded ${data.length} application (/) commands\nReady! Logged in as ${client.user.tag}`
          );
        } catch (error) {
          console.error(
            "[READY_EVENT] An error occurred while refreshing application (/) commands\n",
            error
          );
        }
      })();
    },
  },
};
