function generateWorkSchedule(startTime = "08:00", startTimeVariance = 15, roundTo = 5) {
  const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
  const schedule = [];

  // Hilfsfunktion: Zeit in Minuten umwandeln
  function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  // Hilfsfunktion: Minuten auf 5 oder 10 runden
  function roundMinutes(minutes) {
    return Math.round(minutes / roundTo) * roundTo;
  }

  // Hilfsfunktion: Minuten in Zeit umwandeln
  function minutesToTime(minutes) {
    const rounded = roundMinutes(minutes);
    const hours = Math.floor(rounded / 60);
    const mins = rounded % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  }

  // Hilfsfunktion: Zufällige Zahl zwischen min und max
  function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const startMinutes = timeToMinutes(startTime);

  // Ziel: 40 Stunden ± 15 Minuten pro Woche
  const totalWeeklyMinutes = 40 * 60 + random(-15, 15);
  const baseDailyMinutes = Math.floor(totalWeeklyMinutes / 5);

  for (let i = 0; i < 5; i++) {
    const day = days[i];

    // Tägliche Arbeitszeit mit größerer Variation: ±1 Stunde (60 Minuten)
    const dayWorkMinutes = baseDailyMinutes + random(-60, 60);

    // Vormittag: Start um Input-Zeit (± 20 Minuten)
    const morningStart =
      startMinutes + random(-startTimeVariance, startTimeVariance);

    // Vormittag endet zwischen 11:00 und 12:30
    const morningEnd = timeToMinutes("11:00") + random(0, 90);
    const morningDuration = morningEnd - morningStart;

    // Mittagspause: 30-45 Minuten
    const lunchBreak = random(30, 45);

    // Nachmittag: Start nach der Pause
    const afternoonStart = morningEnd + lunchBreak;

    // Restliche Arbeitszeit für den Nachmittag
    const afternoonDuration = dayWorkMinutes - morningDuration;
    const afternoonEnd = afternoonStart + afternoonDuration;

    schedule.push({
      day: day,
      morning: {
        start: minutesToTime(morningStart),
        end: minutesToTime(morningEnd),
        duration: Math.round((morningDuration / 60) * 100) / 100,
      },
      lunch: `${lunchBreak} min`,
      afternoon: {
        start: minutesToTime(afternoonStart),
        end: minutesToTime(afternoonEnd),
        duration: Math.round((afternoonDuration / 60) * 100) / 100,
      },
      totalHours: Math.round((dayWorkMinutes / 60) * 100) / 100,
    });
  }

  return schedule;
}

// Verwendung:
const workPlan = generateWorkSchedule("08:30", 40, 5); // roundTo: 5 oder 10

// Ausgabe formatieren
console.log("🕐 ARBEITSZEIT-PLAN (Mo-Fr)\n");
console.log("=".repeat(60));

workPlan.forEach((day) => {
  console.log(`📅 ${day.day.toUpperCase()}`);
  console.log(
    `   Vormittag:  ${day.morning.start} - ${day.morning.end} (${day.morning.duration}h)`
  );
  console.log(`   Pause:      ${day.lunch}`);
  console.log(
    `   Nachmittag: ${day.afternoon.start} - ${day.afternoon.end} (${day.afternoon.duration}h)`
  );
  console.log(`   📊 Gesamt:   ${day.totalHours} Stunden`);
  console.log("");
});

// Wochenstatistik
const totalWeekHours = workPlan.reduce((sum, day) => sum + day.totalHours, 0);
console.log("=".repeat(60));
console.log(
  `📈 WOCHENSUMME: ${Math.round(totalWeekHours * 100) / 100} Stunden`
);

// Mit Standard-Startzeit 08:00
// const plan1 = generateWorkSchedule();

// Mit eigener Startzeit und Rundung auf 10 Minuten
// const plan2 = generateWorkSchedule("07:45", 15, 10);
