class MonthlyCalendar {
  iconPaths = new Map([
    ["Yoga", "Bilder/Sticker/icon_yoga.png"],
    ["YogaBeginner", "Bilder/Sticker/icon_yoga_beginner.png"],
    ["YogaRemix", "Bilder/Sticker/icon_yoga_remix.png"],
    ["Gym", "Bilder/Sticker/icon_gym.png"],
    ["P90", "Bilder/Sticker/icon_p90.png"],
    ["PiYo", "Bilder/Sticker/icon_piyo2.png"],
    ["Spaziergang", "Bilder/Sticker/icon_walk2.png"],
    ["Laufband", "Bilder/Sticker/icon_laufband.png"],
    ["Align", "Bilder/Sticker/icon_align.png"],
    ["Embody", "Bilder/Sticker/icon_embody.png"],
    ["Endure", "Bilder/Sticker/icon_endure.png"],
    ["Rudern", "Bilder/Sticker/icon_rudern.png"],
  ]);

  workoutRegex = new RegExp("(?<workout>\\w+)");
  workoutTimeRegex = new RegExp(
    "(?<workout>\\w+)\\s+(?<time>(?:[01]?[0-9]|2[0-3]):[0-5][0-9]|\\d+)",
  );
  trashEvents = ["GelberSack", "Rest", "Papier", "Bio"];
  today = new Date();

  // start dates of the cyclic months
  cycles = new Map([
    ["2025-12-01", "2025-12"],
    ["2025-12-29", "2026-01"],
    ["2026-01-26", "2026-02"],
    ["2026-03-02", "2026-03"],
    ["2026-03-30", "2026-04"],
    ["2026-04-27", "2026-05"],
    ["2026-06-01", "2026-06"],
    ["2026-06-29", "2026-07"],
    ["2026-07-27", "2026-08"],
    ["2026-08-31", "2026-09"],
    ["2026-09-28", "2026-10"],
    ["2026-10-26", "2026-11"], // Leap week
    ["2026-12-07", "2026-12"],
    ["2027-01-04", "2027-01"],
    ["2027-02-01", "2027-02"],
    ["2027-03-08", "2027-03"],
    ["2027-04-05", "2027-04"],
    ["2027-05-03", "2027-05"],
    ["2027-06-07", "2027-06"],
    ["2027-07-05", "2027-07"],
    ["2027-08-02", "2027-08"],
    ["2027-09-06", "2027-09"],
    ["2027-10-04", "2027-10"],
    ["2027-11-01", "2027-11"],
    ["2027-12-06", "2027-12"],
    ["2028-01-03", "2028-01"],
    ["2028-01-31", "2028-02"],
    ["2028-03-06", "2028-03"],
    ["2028-04-03", "2028-04"],
    ["2028-05-01", "2028-05"],
    ["2028-06-05", "2028-06"],
    ["2028-07-03", "2028-07"],
    ["2028-07-31", "2028-08"],
    ["2028-09-04", "2028-09"],
    ["2028-10-02", "2028-10"],
    ["2028-10-30", "2028-11"],
  ]);

  cyclesArray = Array.from(this.cycles.keys());

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
          7,
      )
    );
  }

  getWeekYear(input) {
    var date = new Date(input.getTime());
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    return date.getFullYear();
  }

  // This function will return the Monday before the input date or the input date itself if it is already a Monday.
  getMonday(input) {
    const date = new Date(input);
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Adjust for Sunday (0) to get the previous Monday
    date.setDate(date.getDate() + diff);
    return date;
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
      cls: [],
      text: "",
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

  isWorkoutEvent(event) {
    if (!event) return false;
    for (let workoutName of this.iconPaths.keys()) {
      if (event.startsWith(workoutName)) {
        return true;
      }
    }
    return false;
  }

  isTrashEvent(event) {
    return this.trashEvents.includes(event);
  }

  isMultiDayEventStart(event) {
    return event?.endsWith(" >");
  }

  isMultiDayEventEnd(event) {
    return event?.startsWith("< ");
  }

  isToday(date) {
    const today = new Date();
    return (
      date.getDate() == today.getDate() &&
      date.getMonth() == today.getMonth() &&
      date.getFullYear() == today.getFullYear()
    );
  }

  renderWorkouts(dayEvents, app, containerDay, ignoreTime = false) {
    const workoutEvents = dayEvents.filter((event) =>
      this.isWorkoutEvent(event),
    );
    if (workoutEvents.length == 0) return;
    const workoutsOuterContainer = containerDay.createEl("div", {
      cls: "monthly-date-row-container",
    });
    for (let event of workoutEvents) {
      const timeEntries = this.workoutTimeRegex.exec(event);
      let workoutContainer = workoutsOuterContainer.createEl("div", {
        cls: "monthly-date-workout-container",
      });
      workoutContainer.createEl("img", {
        attr: {
          src: app.vault.getResourcePath(
            app.vault.getAbstractFileByPath(
              this.iconPaths.get(
                timeEntries ? timeEntries.groups.workout : event,
              ),
            ),
          ),
          width: "60",
          height: "60",
        },
        cls: ["monthly-date-event-icon"],
      });
      if (timeEntries && !ignoreTime) {
        workoutContainer.createEl("div", {
          cls: "monthly-date-workout-container-time",
          text: timeEntries.groups.time,
        });
      }
    }
  }

  renderTrash(dayEvents, app, containerDay) {
    const dayTrashEvents = dayEvents.filter((event) =>
      this.isTrashEvent(event),
    );
    if (dayTrashEvents.length == 0) return;
    const trashContainer = containerDay.createEl("div", {
      cls: "monthly-date-row-container",
    });
    for (let event of dayTrashEvents) {
      trashContainer.createEl("img", {
        attr: {
          src: app.vault.getResourcePath(
            app.vault.getAbstractFileByPath(
              `Bilder/Sticker/icon_${event.toLowerCase()}.png`,
            ),
          ),
          width: "20",
          height: "28",
        },
        cls: ["monthly-date-trash"],
      });
    }
  }

  renderDay(app, containerDay, dayEvents, multiDayEvent, ignoreTime = false) {
    let multiDayEventFound = multiDayEvent || null;
    const multidayEvents = dayEvents.filter(
      (event) =>
        this.isMultiDayEventStart(event) || this.isMultiDayEventEnd(event),
    );
    for (let event of multidayEvents) {
      if (this.isMultiDayEventStart(event)) {
        multiDayEventFound = event?.slice(0, -2);
        containerDay.createEl("div", {
          cls: [
            "monthly-date-event",
            "monthly-date-event-multiday",
            "monthly-date-event-multiday-start",
          ],
          text: event?.slice(0, -2),
        });
      } else if (this.isMultiDayEventEnd(event)) {
        multiDayEventFound = null;
        containerDay.createEl("div", {
          cls: [
            "monthly-date-event",
            "monthly-date-event-multiday",
            "monthly-date-event-multiday-end",
          ],
        });
      }
    }
    if (multiDayEventFound && multidayEvents.length == 0) {
      containerDay.createEl("div", {
        cls: [
          "monthly-date-event",
          "monthly-date-event-multiday",
          "monthly-date-event-multiday-during",
        ],
      });
    }
    // normal events
    for (let event of dayEvents) {
      if (
        !this.isTrashEvent(event) &&
        !this.isMultiDayEventStart(event) &&
        !this.isMultiDayEventEnd(event) &&
        !this.isWorkoutEvent(event)
      ) {
        containerDay.createEl("div", {
          cls: ["monthly-date-event"],
          text: event,
        });
      }
    }
    this.renderWorkouts(dayEvents, app, containerDay, ignoreTime);
    this.renderTrash(dayEvents, app, containerDay);
    return multiDayEventFound;
  }

  renderDaily(app, containerDay, monthFile, dayFile) {
    const day = dayFile.file.day.day;
    const events = monthFile?.events ? monthFile.events[day.toString()] : [];
    this.renderDay(app, containerDay, events);
  }

  render(
    app,
    table,
    currentFile,
    prevMonthFile,
    nextMonthFile,
    week = undefined,
    weekFile = undefined,
  ) {
    //console.log("render week", week);
    const som = week !== undefined ? weekFile.sow : currentFile.som;
    const eom = week !== undefined ? weekFile.eow : currentFile.eom;
    const events = currentFile.events;
    let multidayEvent = null;

    const monthStart = new Date(som);
    const monthEnd = new Date(eom);
    const startWeek = this.getWeek(monthStart);
    const endWeek = this.getWeek(monthEnd);
    let startDay = this.getMonday(monthStart);

    const prevMonthEvents = prevMonthFile?.events || {};
    const nextMonthEvents = nextMonthFile?.events || {};

    this.renderHeader(table);
    //("startWeek", startWeek);
    //("endWeek", endWeek);
    // If week is provided, only render that week
    const weekStart = week !== undefined ? week : startWeek;
    const weekEnd = week !== undefined ? week : startWeek + 5;

    // Track current date for year determination
    let currentWeekDate = new Date(startDay);

    for (let i = weekStart; i <= weekEnd; i++) {
      // Determine the year for the current week
      const weekYear = this.getWeekYear(currentWeekDate);
      const weekNumber = this.getWeek(currentWeekDate);

      // create link to weekly note
      let weekContainer = table.createEl("div", {
        cls: ["monthly-day-container", "monthly-week"],
      });
      weekContainer.createEl("a", {
        attr: {
          "data-href": `${weekYear}-W${this.leadingZero(weekNumber)}`,
          href: `${weekYear}-W${this.leadingZero(weekNumber)}`,
          target: "_blank",
          rel: "noopener",
        },
        cls: ["internal-link"],
        text: `${weekNumber}`,
      });
      for (let j = 0; j < 7; j++) {
        // create container for each day
        let containerDay = table.createEl("div", {
          cls: ["monthly-day-container"],
        });
        // create date title
        let dateDiv = containerDay.createEl("div", {
          cls: [
            "monthly-date",
            this.isToday(startDay) ? "monthly-date-today" : "",
          ],
        });
        // create link to daily note
        dateDiv.createEl("a", {
          attr: {
            "data-href": `${startDay.getFullYear()}-${this.leadingZero(
              startDay.getMonth() + 1,
            )}-${this.leadingZero(startDay.getDate())}`,
            href: `${startDay.getFullYear()}-W${this.leadingZero(i)}`,
            target: "_blank",
            rel: "noopener",
          },
          cls: ["internal-link"],
          text: startDay.getDate(),
        });
        // easiest case: day is in the current month
        if (
          startDay.getMonth() == monthStart.getMonth() &&
          events[startDay.getDate().toString()]
        ) {
          let dayEvents = events[startDay.getDate().toString()];
          multidayEvent = this.renderDay(
            app,
            containerDay,
            dayEvents,
            multidayEvent,
          );
        }
        // get events from previous month
        else if (
          startDay.getMonth() == (monthStart.getMonth() + 11) % 12 &&
          prevMonthEvents[startDay.getDate().toString()]
        ) {
          let dayEvents = prevMonthEvents[startDay.getDate().toString()];
          // //("DAY EVENTS", dayEvents);
          multidayEvent = this.renderDay(
            app,
            containerDay,
            dayEvents,
            multidayEvent,
          );
        }
        // get events from next month
        else if (
          startDay.getMonth() == (monthStart.getMonth() + 1) % 12 &&
          nextMonthEvents[startDay.getDate().toString()]
        ) {
          let dayEvents = nextMonthEvents[startDay.getDate().toString()];
          multidayEvent = this.renderDay(
            app,
            containerDay,
            dayEvents,
            multidayEvent,
          );
        }
        startDay.setDate(startDay.getDate() + 1);
      }
      // Move currentWeekDate forward by 7 days for next week
      currentWeekDate.setDate(currentWeekDate.getDate() + 7);
    }
  }

  getCyclicMonth(dateStr) {
    let monthStr = "";
    const inputDate = new Date(dateStr);

    for (let i = 0; i < this.cyclesArray.length - 1; i++) {
      const cycleStart = new Date(this.cyclesArray[i]);
      const cycleEnd = new Date(this.cyclesArray[i + 1]);

      if (inputDate >= cycleStart && inputDate < cycleEnd) {
        monthStr = this.cycles.get(this.cyclesArray[i]).substring(0, 7);
        break;
      }
    }
    return monthStr;
  }

  renderDailyCyclic(app, containerDay, monthFile, dayFile) {
    // //(dayFile.file);
    const day = dayFile.file.day.day;
    const month = dayFile.file.day.month;
    const events = monthFile?.events
      ? monthFile.events[month.toString()][day.toString()]
      : [];
    this.renderDay(app, containerDay, events);
  }

  renderCyclic(app, container, currentFile) {
    const som = currentFile.som;
    const eom = currentFile.eom;
    const events = currentFile.events;
    let multidayEvent = null;

    const monthStart = new Date(som);
    const monthEnd = new Date(eom);
    let startDay = this.getMonday(monthStart);

    // Calculate number of weeks between start and end
    const daysBetween = Math.ceil(
      (monthEnd - monthStart) / (1000 * 60 * 60 * 24),
    );
    const numberOfWeeks = Math.ceil(daysBetween / 7);

    // //("numberOfWeeks", numberOfWeeks);

    let table = container.createEl("div", {
      cls: ["monthly-grid", numberOfWeeks > 4 ? "reset-week" : ""],
    });
    this.renderHeader(table);

    let currentWeekDate = new Date(startDay);

    for (let i = 0; i < numberOfWeeks; i++) {
      if (i == 4) {
        table.createEl("div", {
          cls: ["monthly-reset-title"],
          text: "Reset Woche",
        });
      }
      // Determine the year for the current week
      const weekYear = this.getWeekYear(currentWeekDate);
      const weekNumber = this.getWeek(currentWeekDate);

      // create link to weekly note
      let weekContainer = table.createEl("div", {
        cls: ["monthly-day-container", "monthly-week"],
      });
      weekContainer.createEl("a", {
        attr: {
          "data-href": `${weekYear}-W${this.leadingZero(weekNumber)}`,
          href: `${weekYear}-W${this.leadingZero(weekNumber)}`,
          target: "_blank",
          rel: "noopener",
        },
        cls: ["internal-link"],
        text: `${weekNumber}`,
      });
      for (let j = 0; j < 7; j++) {
        const day = startDay.getDate();
        const month = startDay.getMonth() + 1;
        const year = startDay.getFullYear();
        // create container for each day
        let containerDay = table.createEl("div", {
          cls: ["monthly-day-container"],
        });
        // create date title
        let dateDiv = containerDay.createEl("div", {
          cls: [
            "monthly-date",
            this.isToday(startDay) ? "monthly-date-today" : "",
          ],
        });
        // create link to daily note
        dateDiv.createEl("a", {
          attr: {
            "data-href": `${year}-${this.leadingZero(month)}-${this.leadingZero(
              day,
            )}`,
            href: `${year}-W${this.leadingZero(weekNumber)}`,
            target: "_blank",
            rel: "noopener",
          },
          cls: ["internal-link"],
          text: day,
        });

        if (events[month.toString()][day.toString()]) {
          let dayEvents = events[month.toString()][day.toString()];
          multidayEvent = this.renderDay(
            app,
            containerDay,
            dayEvents,
            multidayEvent,
          );
        }
        startDay.setDate(startDay.getDate() + 1);
      }
      // Move currentWeekDate forward by 7 days for next week
      currentWeekDate.setDate(currentWeekDate.getDate() + 7);
    }
  }

  renderYearlyWorkoutCalendar(
    app,
    container,
    monthlyFiles,
    startDateStr,
    endDateStr,
  ) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const currentDate = new Date(startDateStr);

    const events = {};
    // collect all events from the monthly files
    for (let monthFile of monthlyFiles) {
      const monthEvents = monthFile.events;
      for (let monthKey of Object.keys(monthEvents)) {
        if (!events[monthKey]) {
          events[monthKey] = {};
        }
        for (let dayKey of Object.keys(monthEvents[monthKey])) {
          if (!events[monthKey][dayKey]) {
            events[monthKey][dayKey] = [];
          }
          events[monthKey][dayKey] = events[monthKey][dayKey].concat(
            monthEvents[monthKey][dayKey],
          );
        }
      }
    }

    const daysBetween = Math.ceil(
      (endDate - startDate) / (1000 * 60 * 60 * 24),
    );
    const numberOfWeeks = Math.ceil(daysBetween / 7);
    let table = container.createEl("div", {
      cls: ["monthly-grid"],
    });
    this.renderHeader(table);

    for (let i = 0; i < numberOfWeeks; i++) {
      const weekYear = this.getWeekYear(currentDate);
      const weekNumber = this.getWeek(currentDate);
      let weekContainer = table.createEl("div", {
        cls: ["monthly-day-container", "monthly-week"],
      });
      weekContainer.createEl("a", {
        attr: {
          "data-href": `${weekYear}-W${this.leadingZero(weekNumber)}`,
          href: `${weekYear}-W${this.leadingZero(weekNumber)}`,
          target: "_blank",
          rel: "noopener",
        },
        cls: ["internal-link"],
        text: `${weekNumber}`,
      });
      for (let j = 0; j < 7; j++) {
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        // create container for each day
        let containerDay = table.createEl("div", {
          cls: ["monthly-day-container"],
        });

        if (events[month.toString()][day.toString()]) {
          let dayEvents = events[month.toString()][day.toString()].filter(
            (event) => this.isWorkoutEvent(event),
          );
          this.renderDay(app, containerDay, dayEvents, null, true);
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  }
}
