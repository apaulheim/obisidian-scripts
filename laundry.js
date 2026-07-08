class Laundry {
  getQuery() {
    return `TASK
            FROM "notes"
            WHERE file.day
            WHERE file.day >= this.som
            WHERE file.day <= this.eom
            WHERE contains(tags, "#wäsche")
            SORT file.day ASC`;
  }

  getEntries(tasks) {
    const entries = [];
    tasks.value.values.forEach((task) => {
      entries.push([task.text, task.file.name]);
    });
    return entries;
  }
}
