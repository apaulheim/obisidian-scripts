// const {BodySlims} = customJS;
// // Array containing goals IDs: [1,2,...]
// const goalsArray = Array.from({length: dv.current().goals}, (_, i) => i + 1);
// // request tasks for each goal for this week
// const resultsWeek = await Promise.all(goalsArray.map(v => {return dv.query(BodySlims.getWeekTasksQuery(dv.current(), v))}));
// // request tasks for each goal for the 12 week year until today (or end of this week)
// const resultsYear = await Promise.all(goalsArray.map(v => {return dv.query(BodySlims.getYearTasksQuery(dv.current(), v))}));
// // create container element
// let elem = this.container.createEl('div', {cls: ["twy-widget"]});
// // render widget
// await BodySlims.render(elem, resultsWeek, resultsYear, dv.current().twystart.toFormat('yyyy-MM-dd'), dv.current().eow.toFormat('yyyy-MM-dd'), dv.current().goals);

class BodySlims {
  getWeekAndDay(twystartStr, sowStr, days) {
    const twystart = new Date(twystartStr);
    const twyend = new Date(twystartStr);
    twyend.setDate(twyend.getDate() + 70);
    const sow = new Date(sowStr);
    const day = new Date(sow);
    day.setDate(day.getDate() + days);
    if (day < twystart || day > twyend) {
      return "";
    }
    const daysBetween = this.getDaysBetweenDates(twystart, day);
    const week = Math.ceil((daysBetween + 1) / 7);
    return `Week ${week} - Day ${(daysBetween % 7) + 1}`;
  }

  formatDate(date) {
    const month = date.toLocaleString("en-GB", { month: "short" });
    return `${month} ${date.getDate()}`;
  }

  getDaysBetweenDates(date1, date2) {
    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;
    // Calculate the difference in milliseconds
    const diffInMilliseconds = Math.abs(date2 - date1);
    // Convert back to days and return
    return Math.round(diffInMilliseconds / oneDay);
  }

  render(el, resultsWeek, resultsYear, twystartStr, eowStr, goals, 
    goalsEmojis) {
    const twystart = new Date(twystartStr);
    const twyend = new Date(twystartStr);
    twyend.setDate(twyend.getDate() + 70);
    const eow = new Date(eowStr);
    const daysBetween = this.getDaysBetweenDates(twystart, eow);
    const weeksBetween = Math.ceil(daysBetween / 7);
    const weeklyScorePerGoal = resultsWeek.map((v) =>
      Math.round(
        (v.value.values.filter((v) => v.checked).length /
          (v.value.values.length || 1)) *
          100
      )
    );
    const weeklyScore = Math.round(
      weeklyScorePerGoal.reduce((a, b) => a + b, 0) /
        (weeklyScorePerGoal.length || 1)
    );
    const yearlyScorePerGoal = resultsYear.map((v) =>
      Math.round(
        (v.value.values.filter((v) => v.checked).length /
          (v.value.values.length || 1)) *
          100
      )
    );
    const yearlyScore = Math.round(
      yearlyScorePerGoal.reduce((a, b) => a + b, 0) /
        (yearlyScorePerGoal.length || 1)
    );
    const container = el.createEl("div", {
      cls: ["container"],
    });
    const overview = container.createEl("div", {
      cls: ["overview"],
    });
    const twy = overview.createEl("div", {
      cls: ["twy", "title"],
    });
    twy.createEl("div", {
      text: "BodySlims",
    });
    overview.createEl("div", {
      text: `Week ${weeksBetween - 1} - ${weeksBetween}`,
      cls: ["week-title"],
    });
    const timeline = overview.createEl("div", {
      cls: ["timeline"],
    });
    timeline.createEl("div", {
      text: this.formatDate(twystart),
      cls: ["timeline-entry"],
    });
    timeline.createEl("div", {
      text: "-",
      cls: ["timeline-line"],
    });
    timeline.createEl("div", {
      text: this.formatDate(twyend),
      cls: ["timeline-entry"],
    });
    const weekly = container.createEl("div", {
      cls: ["weekly"],
    });
    weekly.createEl("div", {
      text: "Weekly Score",
      cls: ["title"],
    });
    const weeklyScores = weekly.createEl("div", {
      cls: ["scores"],
    });
    for (let i = 0; i < goals; i++) {
      const goalDetails = weeklyScores.createEl("div", {
        cls: ["goal-details"],
      });
      goalDetails.createEl("div", {
        text: goalsEmojis?.length > i ? goalsEmojis[i] : `Goal ${i + 1}`,
        cls: ["goal-title"],
      });
      const goalNumbers = goalDetails.createEl("div", {
        cls: ["goal-numbers"],
      });
      goalNumbers.createEl("div", {
        text: `${weeklyScorePerGoal[i]}`,
        cls: ["score"],
      });
      goalNumbers.createEl("div", {
        text: "%",
        cls: ["percent"],
      });
    }
    const avgWeeklyNumbers = weeklyScores.createEl("div", {
      cls: ["goal-numbers"],
    });
    avgWeeklyNumbers.createEl("div", {
      text: `${weeklyScore}`,
      cls: ["score"],
    });
    avgWeeklyNumbers.createEl("div", {
      text: "%",
      cls: ["percent"],
    });

    const yearly = container.createEl("div", {
      cls: ["yearly"],
    });
    yearly.createEl("div", {
      text: "Yearly Score",
      cls: ["title"],
    });
    const yearlyScores = yearly.createEl("div", {
      cls: ["scores"],
    });
    for (let i = 0; i < goals; i++) {
      const goalDetails = yearlyScores.createEl("div", {
        cls: ["goal-details"],
      });
      goalDetails.createEl("div", {
        text: goalsEmojis?.length > i ? goalsEmojis[i] : `Goal ${i + 1}`,
        cls: ["goal-title"],
      });
      const goalNumbers = goalDetails.createEl("div", {
        cls: ["goal-numbers"],
      });
      goalNumbers.createEl("div", {
        text: `${yearlyScorePerGoal[i]}`,
        cls: ["score"],
      });
      goalNumbers.createEl("div", {
        text: "%",
        cls: ["percent"],
      });
    }
    const avgYearlyNumbers = yearlyScores.createEl("div", {
      cls: ["goal-numbers"],
    });
    avgYearlyNumbers.createEl("div", {
      text: `${yearlyScore}`,
      cls: ["score"],
    });
    avgYearlyNumbers.createEl("div", {
      text: "%",
      cls: ["percent"],
    });
  }

  getWeekTasksQuery(currentFile, goalNo) {
    const isCurrentWeek = new Date() <= new Date(currentFile.eow);
    return `TASK
                FROM "notes"
                WHERE contains(tags, "#${goalNo}")
                WHERE file.day
                WHERE !contains(file.name, "conflict")
                WHERE file.day >= this.sow
                WHERE file.day <= ${isCurrentWeek ? "date(today)" : "this.eow"}
                SORT file.day ASC`;
  }

  getYearTasksQuery(currentFile, goalNo) {
    const isCurrentWeek = new Date() <= new Date(currentFile.eow);
    return `TASK
                FROM "notes"
                WHERE contains(tags, "#${goalNo}")
                WHERE file.day
                WHERE !contains(file.name, "conflict")
                WHERE file.day >= this.twystart
                WHERE file.day <= ${isCurrentWeek ? "date(today)" : "this.eow"}
                SORT file.day ASC`;
  }
}
