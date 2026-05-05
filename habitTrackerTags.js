class HabitTrackerTags {
  habits = [
    ["12wyg3", "🌞"],
    ["habitHM", "👱🏻‍♀️"],
    ["habitN", "💊"],
    ["habitS", "🚶‍♀️"],
    ["12wyg2", "💪"],
    ["habitD", "🚿"],
    ["habitF", "🏠"],
    ["habitHA", "👱🏻‍♀️"],
    ["12wyg1", "📋"],
    ["habitKA", "🧋"],
  ];

  init(habitsInit) {
    this.habits = habitsInit;
  }

  getHabits() {
    return this.habits.map((habit) => habit[0]);
  }

  getHabitQuery() {
    return `TASK
                FROM "notes"
                WHERE file.day
                WHERE file.day >= this.som
                WHERE file.day <= this.eom
                SORT file.day ASC`;
  }

  getTableHeader() {
    const header = [""];
    return header.concat(this.habits.map((habit) => habit[1]));
  }

  getEntries(queryResult, som, eom) {
    console.log(queryResult);
    const start = new Date(som);
    const end = new Date(eom);
    const entries = [];

    for (let i = start.getDate(); i <= end.getDate(); i++) {
      entries.push([i, ...Array(this.habits.length).fill("o")]);
    }
    if (queryResult.successful) {
      for (let entry of queryResult.value.values) {
        if (entry.checked) {
          const habitId = this.habits.findIndex(
            (habit) => entry.tags[0]?.substring(1) == habit[0]
          );
          if (habitId > -1) {
            const day = entry.file.day.c.day;
            entries[day - 1][habitId + 1] = this.habits[habitId][1];
          }
        }
      }
    }
    return entries;
  }
}
