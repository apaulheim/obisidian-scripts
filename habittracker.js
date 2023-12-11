class HabitTracker {
  getQuery() {
    return `TABLE WITHOUT ID date(file.name).day as "Day",
string(choice(filter(file.tasks, (t) => t.habit = "Früh aufstehen").completed, "🌞", "o")) AS "🌞",
string(choice(filter(file.tasks, (t) => t.habit = "Stille Zeit").completed, "🙏", "o")) AS "🙏",
string(choice(filter(file.tasks, (t) => t.habit = "Workout").completed, "💪", "o")) AS "💪",
string(choice(filter(file.tasks, (t) => t.habit = "Duschen").completed, "🚿", "o")) AS "🚿",
string(choice(filter(file.tasks, (t) => t.habit = "Spaziergang").completed, "🚶‍♀️", "o")) AS "🚶‍♀️",
string(choice(filter(file.tasks, (t) => t.habit = "Flylady").completed, "🏠", "o")) AS "🏠",
string(choice(filter(file.tasks, (t) => t.habit = "Nahrungsergänzung").completed, "💊", "o")) AS "💊",
string(choice(filter(file.tasks, (t) => t.habit = "Lesen").completed, "📖", "o")) AS "📖",
string(choice(filter(file.tasks, (t) => t.habit = "Kalorien tracken").completed, "📋", "o")) AS "📋",
string(choice(filter(file.tasks, (t) => t.habit = "Hautpflege").completed, "👱🏻‍♀️", "o")) AS "👱🏻‍♀️"
FROM "2023"
WHERE file.day
WHERE !contains(file.name, "conflict")
WHERE file.day >= this.som
WHERE file.day <= this.eom
SORT file.day ASC`;
  }

  getEntries(queryResult, som, eom) {
    // console.log("queryResult", queryResult)
    if (queryResult.successful) {
      const start = new Date(som);
      const end = new Date(eom);
      const queryResultEntries = queryResult.value.values;
      const entries = [];
      let entryIdx = 0;
      // console.log("start", start.getDate(), "end", end.getDate(), "queryResultEntries", queryResultEntries);
      for (let i = start.getDate(); i <= end.getDate(); i++) {
        if (
          entryIdx < queryResultEntries.length &&
          queryResultEntries[entryIdx][0] == i
        ) {
          // we found an entry in the result for the current day
          entries.push(queryResultEntries[entryIdx]);
          entryIdx++;
        } else {
          // push emtpy row
          entries.push([i, "o", "o", "o", "o", "o", "o", "o", "o", "o", "o"]);
        }
      }
      return entries;
    }
    return [];
  }
}
