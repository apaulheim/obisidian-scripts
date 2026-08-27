class HabitTrackerCyclic {
  daysBetween(start, end) {
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }

  getHabitQuery() {
    return `TASK
                  FROM "notes"
                  WHERE file.day
                  WHERE file.day >= this.som
                  WHERE file.day <= this.eom
                  SORT file.day ASC`;
  }

  getEntries(queryResult, som, eom, habits) {
    // console.log(queryResult);
    const start = new Date(som);
    const end = new Date(eom);
    const daysBetween = this.daysBetween(start, end) + 1;
    // console.log("daysbetw", daysBetween);
    const entries = [];

    let currentDate = new Date(start);
    for (let i = 0; i < daysBetween; i++) {
      entries.push([currentDate.getDate(), ...Array(habits.length).fill("‧")]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    if (queryResult.successful) {
      for (let entry of queryResult.value.values) {
        if (entry.checked) {
          const habitId = habits.findIndex(
            (habit) => entry.tags[0]?.substring(1) == habit[0],
          );
          if (habitId > -1) {
            const index = this.daysBetween(
              start,
              new Date(
                entry.file.day.c.year,
                entry.file.day.c.month - 1,
                entry.file.day.c.day,
              ),
            );
            entries[index][habitId + 1] = habits[habitId][1];
          }
        }
      }
    }
    return entries;
  }

  render(container, entries, habits) {
    container.createEl("div", {
      cls: ["habit-cell"],
    });
    for (let habit of habits) {
      container.createEl("div", {
        cls: ["habit-cell"],
        text: habit[1],
      });
    }
    for (let i = 0; i < entries.length; i++) {
      if (i == 28) {
        container.createEl("div", {
          cls: ["habit-reset-title"],
          attr: {
            style: `grid-column: span ${entries[i].length};`,
          },
          text: "Reset Woche",
        });
      }
      for (let j = 0; j < entries[i].length; j++) {
        container.createEl("div", {
          cls: [
            "habit-cell",
            i % 7 == 6 ? "habit-cell-sunday" : "",
            i % 7 == 6 && i < 28 ? "habit-cell-sunday-border" : "",
          ],
          text: entries[i][j],
        });
      }
    }
  }
}
