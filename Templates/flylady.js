const zones = [
  "Flur",
  "Esszimmer",
  "Küche",
  "Bad",
  "Schlafzimmer",
  "Wohnzimmer",
];

function getTask(weekday, zone) {
  const tasks = [
    "Aussortieren, Schränke ordnen #habitF",
    "Abstauben, Spinnweben, Lampe, Geräte #habitF",
    "Schrankfronten, Aussortieren, Schränke ordnen #habitF",
    `Home Blessing #habitF
- [ ] Handtücher/Bettwäsche wechseln und waschen
- [ ] Müll ausleeren
- [ ] Spiegel
- [ ] Waschbecken
- [ ] Badewanne
- [ ] Dusche
- [ ] Toilette
- [ ] Abstauben
- [ ] Durch alle Zimmer saugen, ${zone} gründlich
- [ ] Bad wischen
- [ ] Küche wischen`,
    "Türen, Fenster, Lichtschalter, Steckdosen #habitF",
  ];
  return `${zone}: ${tasks[weekday % tasks.length]}`;
}

function flylady(fileTitle) {
  const weekday = moment(fileTitle, "YYYY-MM-DD").weekday();
  const weeknumber = moment(fileTitle, "YYYY-MM-DD").isoWeek();
  return getTask(weekday, zones[weeknumber % zones.length]);
}

module.exports = flylady;
