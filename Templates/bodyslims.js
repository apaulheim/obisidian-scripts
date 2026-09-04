// ## ☑️ BodySlims

// ```dataviewjs
// const habits2 = [
//     ["bodyslimsMV", "🌞"],
//     ["habitK", "📋"],
//     ["habitS", "🚶‍♀️"],
//     ["habitW", "💪"],
//     ["bodyslimsS", "📺"],
//     ["bodyslimsEV", "🌛"],
//     ["bodyslimsPW", "🎧"],
//   ];
// const {HabitTrackerCyclic} = customJS
// const queryResult = await dv.query(HabitTrackerCyclic.getHabitQuery());

// if (queryResult.successful) {
//   const entries = await HabitTrackerCyclic.getEntries(queryResult, dv.current().som, dv.current().eom, habits2);
//   let habitTable2 = this.container.createEl('div', {cls: ["habit-grid"], attr: {style: `grid-template-columns: repeat(${habits2.length+1}, 1fr);`}});
//   await HabitTrackerCyclic.render(habitTable2, entries, habits2);
// }
// ```

// Program start must be a thursday
function bodyslims(programStartStr, currentDayStr, days) {
  const twystart = new Date(programStartStr);
  const twyend = new Date(programStartStr);
  twyend.setDate(twyend.getDate() + 70);
  const day = new Date(currentDayStr);
  if (days) day.setDate(day.getDate() + days);
  if (day < twystart || day > twyend) {
    return "";
  }
  const daysDifference = moment(currentDayStr, "YYYY-MM-DD").diff(
    moment(programStartStr, "YYYY-MM-DD"),
    "days",
  );
  const week = Math.ceil((daysDifference + 1) / 7);
  return `Week ${week} - Day ${(daysDifference % 7) + 1}`;
}

module.exports = bodyslims;
