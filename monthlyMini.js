class MonthlyMini {

  getWeek(input) {
    var date = new Date(input.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return (
      1 +
      Math.round(
        ((date.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    );
  }

  getWeekYear(input) {
    var date = new Date(input.getTime());
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    return date.getFullYear();
  }

  getMonday(input) {
    if (input.getDay() == 1) return new Date(input);
    const date = new Date(input);
    let tmp = new Date(input);
    tmp.setDate(2 - input.getDay());
    // console.log("monday", date, input.getDay(), 1 - input.getDay());
    // console.log("tmp", tmp);
    if (input.getDay() == 0) {
      date.setDate(-6);
      return date;
    } else {
      date.setDate(2 - input.getDay());
      return date;
    }
  }

  getSunday(input) {
    if (input.getDay() == 0) return new Date(input);
    const date = new Date(input);
    date.setDate(date.getDate() + 7 - date.getDay);
    return date;
  }

  leadingZero(num) {
    return num < 10 ? `0${num.toString()}` : num.toString();
  }

  renderHeader(table) {
    table.createEl("div", {
      cls: ["monthly-header"],
      text: "W",
    });
    table.createEl("div", {
      cls: ["monthly-header"],
      text: "Mo",
    });
    table.createEl("div", {
      cls: ["monthly-header"],
      text: "Di",
    });
    table.createEl("div", {
      cls: ["monthly-header"],
      text: "Mi",
    });
    table.createEl("div", {
      cls: ["monthly-header"],
      text: "Do",
    });
    table.createEl("div", {
      cls: ["monthly-header"],
      text: "Fr",
    });
    table.createEl("div", {
      cls: ["monthly-header"],
      text: "Sa",
    });
    table.createEl("div", {
      cls: ["monthly-header"],
      text: "So",
    });
  }

  renderDay(app, containerDay, dayEvents) {
    this.renderTrash(dayEvents, app, containerDay);
    for (let event of dayEvents) {
      if (this.timeRegex.test(event)) {
        this.renderWorkout(event, app, containerDay);
      } else if (
        !(
          event == "Papier" ||
          event == "GelberSack" ||
          event == "Rest" ||
          event == "Bio" ||
          event == "Urlaub"
        )
      ) {
        containerDay.createEl("div", {
          cls: ["monthly-date-event"],
          text: event,
        });
      }
    }
  }

  render(table) {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const startWeek = this.getWeek(monthStart);
    const endWeek = this.getWeek(monthEnd);
    let startDay = this.getMonday(monthStart);

    this.renderHeader(table);
    for (let i = startWeek; i <= endWeek; i++) {
      const isCurrentWeek = this.getWeek(startDay) == this.getWeek(today);
      let weekContainer = table.createEl("div", {
        cls: ["monthly-mini-day-container", "monthly-mini-date", isCurrentWeek ? "monthly-mini-current-week" : ""],
      });
      weekContainer.createEl("a", {
        attr: {
          "data-href": `${monthStart.getFullYear()}-W${this.leadingZero(i)}`,
          href: `${monthStart.getFullYear()}-W${this.leadingZero(i)}`,
          target: "_blank",
          rel: "noopener",
        },
        // cls: ["internal-link"],
        text: `${i}`,
      });
      for (let j = 0; j < 7; j++) {
        const isToday = startDay.toDateString() == today.toDateString();
        let containerDay = table.createEl("div", {
          cls: ["monthly-mini-day-container", isCurrentWeek ? "monthly-mini-current-week" : ""],
        });
        let dateDiv = containerDay.createEl("div", {
          cls: ["monthly-mini-date", isToday ? "monthly-mini-today" : ""],
        });
        dateDiv.createEl("a", {
          attr: {
            "data-href": `${startDay.getFullYear()}-${this.leadingZero(
              startDay.getMonth() + 1
            )}-${this.leadingZero(startDay.getDate())}`,
            href: `${startDay.getFullYear()}-W${this.leadingZero(i)}`,
            target: "_blank",
            rel: "noopener",
          },
          // cls: ["internal-link"],
          text: startDay.getDate(),
        });
        startDay.setDate(startDay.getDate() + 1);
        // console.log(startDay);
      }
    }
  }
}
