const {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const pollModal = require("./modal");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Generates a poll !"),
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId(pollModal.name)
      .setTitle(pollModal.title);

    const inputs = pollModal.fields.map((field) => {
      const modalInputs = new TextInputBuilder()
        .setCustomId(field.name)
        .setLabel(field.label)
        .setStyle(field.style)
        .setRequired(field.required);

      if (field.default) {
        modalInputs.setValue(field.default);
      }

      if (field.minLength) {
        modalInputs.setMinLength(field.minLength);
      }

      if (field.maxLength) {
        modalInputs.setMaxLength(field.maxLength);
      }

      return modalInputs;
    });

    const actionRows = inputs.map((input) =>
      new ActionRowBuilder().addComponents(input)
    );

    modal.addComponents(...actionRows);

    await interaction.showModal(modal);
  },
};
