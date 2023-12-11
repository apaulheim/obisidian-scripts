class MonthlyCalendar {
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
    let trashContainer = null;
    if (
      dayEvents.indexOf("GelberSack") != -1 ||
      dayEvents.indexOf("Rest") != -1 ||
      dayEvents.indexOf("Papier") != -1 ||
      dayEvents.indexOf("Bio") != -1
    ) {
      trashContainer = containerDay.createEl("div", {
        cls: "monthly-date-trash-container",
      });
    }
    for (let event of dayEvents) {
      if (event == "Gym") {
        containerDay.createEl("img", {
          attr: {
            src: app.vault.getResourcePath(
              app.vault.getAbstractFileByPath("Bilder/Sticker/icon_gym.png")
            ),
            width: "60",
            height: "60",
          },
          cls: ["monthly-date-event-icon"],
        });
      } else if (event == "Yoga") {
        containerDay.createEl("img", {
          attr: {
            src: app.vault.getResourcePath(
              app.vault.getAbstractFileByPath("Bilder/Sticker/icon_yoga.png")
            ),
            width: "60",
            height: "60",
          },
          cls: ["monthly-date-event-icon"],
        });
      } else if (event == "Papier") {
        trashContainer.createEl("img", {
          attr: {
            src: app.vault.getResourcePath(
              app.vault.getAbstractFileByPath("Bilder/Sticker/icon_papier.png")
            ),
            width: "20",
            height: "28",
          },
          cls: ["monthly-date-trash"],
        });
      } else if (event == "GelberSack") {
        trashContainer.createEl("img", {
          attr: {
            src: app.vault.getResourcePath(
              app.vault.getAbstractFileByPath(
                "Bilder/Sticker/icon_gelbersack.png"
              )
            ),
            width: "20",
            height: "28",
          },
          cls: ["monthly-date-trash"],
        });
      } else if (event == "Rest") {
        trashContainer.createEl("img", {
          attr: {
            src: app.vault.getResourcePath(
              app.vault.getAbstractFileByPath("Bilder/Sticker/icon_rest.png")
            ),
            width: "20",
            height: "28",
          },
          cls: ["monthly-date-trash"],
        });
      } else if (event == "Bio") {
        trashContainer.createEl("img", {
          attr: {
            src: app.vault.getResourcePath(
              app.vault.getAbstractFileByPath("Bilder/Sticker/icon_bio.png")
            ),
            width: "20",
            height: "28",
          },
          cls: ["monthly-date-trash"],
        });
      } else {
        containerDay.createEl("div", {
          cls: ["monthly-date-event"],
          text: event,
        });
      }
    }
  }

  render(app, table, currentFile, prevMonthFile, nextMonthFile) {
    const som = currentFile.som;
    const eom = currentFile.eom;
    const events = currentFile.events;

    const monthStart = new Date(som);
    // console.log("monthStart INIT", monthStart);
    const monthEnd = new Date(eom);
    const startWeek = this.getWeek(monthStart);
    const endWeek = this.getWeek(monthEnd);
    let startDay = this.getMonday(monthStart);
    // console.log("startDay", startDay);

    const prevMonthEvents = prevMonthFile?.events || {};
    const nextMonthEvents = nextMonthFile?.events || {};
    // console.log("prevMonthEvents", prevMonthEvents);
    // console.log("nextMonthEvents", nextMonthEvents);

    this.renderHeader(table);
    for (let i = startWeek; i <= endWeek; i++) {
      let weekContainer = table.createEl("div", {
        cls: ["monthly-day-container", "monthly-week"],
      });
      weekContainer.createEl("a", {
        attr: {
          "data-href": `${monthStart.getFullYear()}-W${i}`,
          href: `${monthStart.getFullYear()}-W${i}`,
          target: "_blank",
          rel: "noopener",
        },
        cls: ["internal-link"],
        text: `${i}`,
      });
      for (let j = 0; j < 7; j++) {
        let containerDay = table.createEl("div", {
          cls: ["monthly-day-container"],
        });
        let dateDiv = containerDay.createEl("div", {
          cls: ["monthly-date"],
        });
        dateDiv.createEl("a", {
          attr: {
            "data-href": `${startDay.getFullYear()}-${
              startDay.getMonth() + 1
            }-${this.leadingZero(startDay.getDate())}`,
            href: `${startDay.getFullYear()}-W${i}`,
            target: "_blank",
            rel: "noopener",
          },
          cls: ["internal-link"],
          text: startDay.getDate(),
        });
        // console.log("startDay.getMonth()", startDay.getMonth());
        // console.log("monthStart.getMonth()", monthStart.getMonth());
        if (
          startDay.getMonth() == monthStart.getMonth() &&
          events[startDay.getDate().toString()]
        ) {
          let dayEvents = events[startDay.getDate().toString()];
          this.renderDay(app, containerDay, dayEvents);
        } else if (
          startDay.getMonth() == monthStart.getMonth() - 1 &&
          prevMonthEvents[startDay.getDate().toString()]
        ) {
          let dayEvents = prevMonthEvents[startDay.getDate().toString()];
          this.renderDay(app, containerDay, dayEvents);
        } else if (
          startDay.getMonth() == monthStart.getMonth() + 1 &&
          nextMonthEvents[startDay.getDate().toString()]
        ) {
          // console.log("NEXT nextMonth");
          let dayEvents = nextMonthEvents[startDay.getDate().toString()];
          this.renderDay(app, containerDay, dayEvents);
        }
        startDay.setDate(startDay.getDate() + 1);
        // console.log(startDay);
      }
    }
  }
}
