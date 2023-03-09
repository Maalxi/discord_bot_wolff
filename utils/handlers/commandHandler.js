const { promisify } = require("util");
const { glob } = require("glob");

const pGlob = promisify(glob);

module.exports = async (client) => {
  const featureFiles = (
    await pGlob(process.cwd() + "/features/*/index.js")
  ).map((filePath) => filePath);

  featureFiles.map(async (featureFile) => {
    const { command } = require(featureFile);

    if (!command) {
      console.error(
        `[COMMAND_HANDLER] The command at ${featureFile} is missing a required "command" property`
      );
      return;
    }

    await client.commands.set(command.data.name, command);

    console.log(`Loaded command : ${command.data.name}`);
  });
};
