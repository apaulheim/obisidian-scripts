class DateUtil {

  getMonday(input) {
    const date = new Date(input);
    if (input.getDay() == 1) return date;
    if (input.getDay() == 0) {
      date.setDate(date.getDate() - 6);
      return date;
    } else {
      date.setDate(date.getDate() + 1 - date.getDay());
      return date;
    }
  }

  getTuesday(input) {
    if (input.getDay() == 2) return new Date(input);
    const date = new Date(input);
    date.setDate(date.getDate() + 2 - date.getDay());
    return date;
  }

  getWednesday(input) {
    if (input.getDay() == 3) return new Date(input);
    const date = new Date(input);
    date.setDate(date.getDate() + 3 - date.getDay());
    return date;
  }

  getThursday(input) {
    if (input.getDay() == 4) return new Date(input);
    const date = new Date(input);
    date.setDate(date.getDate() + 4 - date.getDay());
    return date;
  }

  getFriday(input) {
    if (input.getDay() == 5) return new Date(input);
    const date = new Date(input);
    date.setDate(date.getDate() + 5 - date.getDay());
    return date;
  }

  getSaturday(input) {
    if (input.getDay() == 6) return new Date(input);
    const date = new Date(input);
    date.setDate(date.getDate() + 6 - date.getDay());
    return date;
  }

  getSunday(input) {
    if (input.getDay() == 0) return new Date(input);
    const date = new Date(input);
    date.setDate(date.getDate() + 7 - date.getDay());
    return date;
  }

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

  leadingZero(num) {
    return num < 10 ? `0${num.toString()}` : num.toString();
  }
}
