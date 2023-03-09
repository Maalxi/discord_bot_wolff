const { EmbedBuilder } = require("discord.js");
const randomEmoji = require("../../utils/getRandomEmoji");

const getPollCreationModalInputValues = (pollModalFields, interaction) => {
  let modalInputValues = {};

  pollModalFields.forEach((field) => {
    let inputValue = interaction.fields.getTextInputValue(field.name);
    const fieldAssociatedEmoji = randomEmoji();

    if (field.name === 'time' && !/^\d+$/.test(inputValue)) {
      inputValue = '5'
    }

    modalInputValues = {
      ...modalInputValues,
      [field.name]: {
        value: inputValue,
        reaction: fieldAssociatedEmoji,
        formatted: fieldAssociatedEmoji + " - " + inputValue,
      },
    };
  });

  return modalInputValues;
};

const getPollPossibilities = (modalInputValues) => {
  let pollResponsePossibilities = [];
  let pollEmbedFieldPossibilities = [];
  let pollReactionPossibilities = [];

  Object.keys(modalInputValues).forEach((answer, index) => {
    if (answer.includes("response")) {
      const pollPossibilities = Object.values(modalInputValues)[index];

      if (pollPossibilities.value.length !== 0) {
        pollResponsePossibilities = [
          ...pollResponsePossibilities,
          pollPossibilities,
        ];

        pollEmbedFieldPossibilities = [
          ...pollEmbedFieldPossibilities,
          {
            name: " ",
            value: pollPossibilities.formatted,
          },
        ];

        // TODO: Handle case when emoji is already used by an other field.
        pollReactionPossibilities = [
          ...pollReactionPossibilities,
          pollPossibilities.reaction,
        ];
      }
    }
  });

  return {
    pollReactionPossibilities,
    pollResponsePossibilities,
    pollEmbedFieldPossibilities,
  };
};

const createEmbed = (user, title, description) => {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(
      description ? (description.length === 0 ? " " : description) : " "
    )
    .setAuthor({ name: user.username, iconURL: user.avatarURL() });
};

const getPollResults = (pollResponsePossibilities, collected) => {
  let pollResults = [];
  let pollEmbedResultFields = [];

  pollResponsePossibilities.map((responsePossibility) => {
    const answerCollectedReaction = collected
      .filter((collectedReaction) => {
        return collectedReaction.emoji.name === responsePossibility.reaction;
      })
      .map((collectedReaction) => collectedReaction)[0];

    pollResults = [
      ...pollResults,
      {
        ...responsePossibility,
        votes: answerCollectedReaction ? answerCollectedReaction.count - 1 : 0,
      },
    ];
  });

  const orderedPollResults = pollResults.sort((possibilityA, possibilityB) =>
    possibilityA.votes > possibilityB.votes ? -1 : 1
  );

  orderedPollResults.map((pollResult) => {
    pollEmbedResultFields = [
      ...pollEmbedResultFields,
      {
        name: " ",
        value: `${pollResult.formatted} (${pollResult.votes})`,
      },
    ];
  });

  return pollEmbedResultFields;
};

// const getMostVotedReaction = (collectedReactions) => {
//   return collectedReactions.reduce(
//     (mostVote, reaction) =>
//       mostVote.count > reaction.count ? mostVote : reaction,
//     { count: 0 }
//   );
// };
//
// const getMostVotedAnswer = (modalInputValues, mostVotedReaction) => {
//   return Object.values(modalInputValues).filter((answer) => {
//     return answer.reaction === mostVotedReaction.emoji.name;
//   })[0];
// };

module.exports = {
  getPollCreationModalInputValues,
  getPollPossibilities,
  createEmbed,
  getPollResults,
};
