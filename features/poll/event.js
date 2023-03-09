const { Events } = require("discord.js");
const pollHelpers = require("./helpers");
const pollModal = require("./modal");

module.exports = {
  name: Events.InteractionCreate,
  eventName: "poll",
  once: false,
  async execute(client, interaction) {
    if (!interaction.isModalSubmit()) return;
    if (!interaction.customId === pollModal.name) return;

    // Get input values from a poll's creation modal.
    const modalAnswers = pollHelpers.getPollCreationModalInputValues(
      pollModal.fields,
      interaction
    );

    // Get poll possibilities and embed fields based on the poll's creation modal input values.
    const {
      pollReactionPossibilities,
      pollResponsePossibilities,
      pollEmbedFieldPossibilities,
    } = pollHelpers.getPollPossibilities(modalAnswers);

    // Create poll embed.
    const pollEmbed = pollHelpers.createEmbed(
      interaction.user,
      modalAnswers.question.value,
      `Sondage ouvert ${modalAnswers.time.value} minute${
        modalAnswers.time.value > 1 ? "s" : ""
      }`
    );

    pollEmbed.addFields(...pollEmbedFieldPossibilities);

    // Post poll embed.
    const pollEmbedReply = await interaction.reply({
      embeds: [pollEmbed],
      fetchReply: true,
    });

    // Initialize the possible reactions for the poll.
    pollReactionPossibilities.forEach((reaction) =>
      pollEmbedReply.react(reaction)
    );

    // Reaction collector filter.
    const filter = (reaction, user) => {
      return (
        pollReactionPossibilities.includes(reaction.emoji.name) &&
        user.id !== pollEmbedReply.author.id
      );
    };

    // Reaction collector.
    const reactionCollector = pollEmbedReply.createReactionCollector({
      filter,
      time: parseInt(modalAnswers.time.value) * (1000 * 60),
    });

    reactionCollector.on("end", async (collected) => {
      // Create poll result embed.
      const resultEmbed = pollHelpers.createEmbed(
        interaction.user,
        modalAnswers.question.value
      );

      // Case no one has voted.
      if (collected.map((reaction) => reaction).length === 0) {
        resultEmbed.addFields({
          name: " ",
          value: "Pas de votes",
        });

        await pollEmbedReply.reply({
          embeds: [resultEmbed],
          fetchReply: true,
        });

        return;
      }

      // Get poll result embed fields.
      const pollEmbedResultFields = pollHelpers.getPollResults(
        pollResponsePossibilities,
        collected
      );

      resultEmbed.addFields(...pollEmbedResultFields);

      await pollEmbedReply.reply({
        embeds: [resultEmbed],
        fetchReply: true,
      });
    });
  },
};
