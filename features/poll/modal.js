const { TextInputStyle } = require("discord.js");

module.exports = {
  name: "poll_modal",
  title: "Créer un sondage",
  fields: [
    {
      name: "question",
      label: "La question du sondage",
      style: TextInputStyle.Short,
      required: true,
    },
    {
      name: "time",
      label: "Délai pour voter en minutes",
      style: TextInputStyle.Short,
      maxLength: 3,
      default: "5",
      required: true,
    },
    {
      name: "responseOne",
      label: "Premier choix",
      style: TextInputStyle.Short,
      required: true,
    },
    {
      name: "responseTwo",
      label: "Second choix",
      style: TextInputStyle.Short,
      required: true,
    },
    {
      name: "responseThree",
      label: "Troisième choix",
      style: TextInputStyle.Short,
      required: false,
    },
  ],
};
