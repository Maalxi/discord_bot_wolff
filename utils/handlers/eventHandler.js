const { promisify } = require("util");
const { glob } = require("glob");

const pGlob = promisify(glob);

module.exports = async (client) => {
  const eventFiles = await pGlob(process.cwd() + "/events/*/*.js");
  const featureFiles = await pGlob(process.cwd() + "/features/*/index.js");

  const mergedEventFiles = await featureFiles.concat(eventFiles);

  mergedEventFiles.map(async (EventFile) => {
    const { event } = require(EventFile);

    if (!event) {
      console.error(
        `[EVENT_HANDLER] The event at ${EventFile} is missing a required "event" declaration`
      );
      return;
    }

    if (!event.name || !event.eventName || !event.execute) {
      console.error(
        `[EVENT_HANDLER] The event at ${EventFile} is missing a required "name" or "eventName" or "execute" property`
      );
      return;
    }

    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args));
    }
    console.log(`Loaded event : ${event.eventName}`);
  });
};
