export const statusLevels = {
    low: {
        color: "#e11d48",
        background: "#ffe4e6",
        description: 'Your blood sugar tends to be lower than the healthy range',
        maxLevel: 4.5
    },
    healthy: {
        color: "#047857",
        background: "#d1fae5",
        description: 'Your blood sugar tends to be in the healthy range ',
        maxLevel: 7.2
    },
    high: {
        color: "#e11d48",
        background: "#ffe4e6",
        description: 'Your blood sugar tends to be higher than the healthy range',
        maxLevel: 30
    },
}



export function calculateAvgBloodSugar(globalData){
if (!globalData || Object.keys(globalData).length === 0) return null;

  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const cutoff = Date.now() - THIRTY_DAYS_MS;

  // collect bloodSugar values from the last 30 days
  const values = Object.entries(globalData)
    .filter(([ts, data]) => {
      const time = Number(ts);
      return (
        time > cutoff &&
        data &&
        typeof data.bloodSugar === "number" &&
        !isNaN(data.bloodSugar)
      );
    })
    .map(([_, data]) => data.bloodSugar);

  if (values.length === 0) return null;

  const sum = values.reduce((acc, v) => acc + v, 0);
  const avg = sum / values.length;
  // round to 1 decimal
  return Math.round(avg * 10) / 10;
}

export function countHighsLast30Days(globalData) {
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const cutoff = Date.now() - THIRTY_DAYS_MS;

  return Object.entries(globalData || {})
    .filter(([ts, entry]) => {
      const time = Number(ts);
      return (
        time > cutoff &&
        typeof entry.bloodSugar === "number" &&
        entry.bloodSugar > 9.0
      );
    })
    .length;
}

export function countLowsLast30Days(globalData) {
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const cutoff = Date.now() - THIRTY_DAYS_MS;

  return Object.entries(globalData || {})
    .filter(([ts, entry]) => {
      const time = Number(ts);
      return (
        time > cutoff &&
        typeof entry.bloodSugar === "number" &&
        entry.bloodSugar < 4.0
      );
    })
    .length;
}

export function calculateBloodSugarVariabilityLast30Days(globalData) {
  if (!globalData || Object.keys(globalData).length === 0) return null;

  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const cutoff = Date.now() - THIRTY_DAYS_MS;

  // collect valid readings
  const values = Object.entries(globalData)
    .filter(([ts, entry]) => 
      Number(ts) > cutoff &&
      entry &&
      typeof entry.bloodSugar === "number" &&
      !isNaN(entry.bloodSugar)
    )
    .map(([_, entry]) => entry.bloodSugar);

  if (values.length === 0) return null;

  // compute mean
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;

  // compute variance
  const variance = values
    .reduce((sum, v) => sum + Math.pow(v - mean, 2), 0)
    / values.length;

  // standard deviation
  const stdDev = Math.sqrt(variance);

  // round to 1 decimal place
  return Math.round(stdDev * 10) / 10;
}

export function calculateAvgEntriesPerDayLast30Days(globalData) {
  if (!globalData || !Object.keys(globalData).length) return null;

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const THIRTY_DAYS_MS = 30 * MS_PER_DAY;
  const now = Date.now();
  const cutoff = now - THIRTY_DAYS_MS;

  // get all timestamps in the last 30 days
  const timestamps = Object.keys(globalData)
    .map(ts => Number(ts))
    .filter(ts => ts > cutoff)
    .sort((a,b) => a - b);

  const count = timestamps.length;
  if (count === 0) return null;

  // find days since the earliest reading
  const first = timestamps[0];
  const daysElapsed = (now - first) / MS_PER_DAY;
  const daysConsidered = Math.max(1, Math.ceil(daysElapsed));

  const avg = count / daysConsidered;
  return Math.round(avg * 10) / 10;
}

export function calculateAvgMealPerDayLast30Days(globalData){
 if (!globalData || Object.keys(globalData).length === 0) return null;

  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const cutoff = Date.now() - THIRTY_DAYS_MS;

  // collect all entries in window
  const entries = Object.entries(globalData)
    .filter(([ts, e]) => Number(ts) >= cutoff && typeof e.carbs === "number")
    .map(([, e]) => e.carbs);

  const count = entries.length;
  if (count === 0) return null;

  const totalCarbs = entries.reduce((sum, c) => sum + c, 0);
  const avg = totalCarbs / count;
  return Math.round(avg * 10) / 10;

}



export function calculateInsulinToCarbRatioStringLast30Days(globalData) {
  if (!globalData || !Object.keys(globalData).length) return null;

  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const cutoff = Date.now() - THIRTY_DAYS_MS;

  // Gather entries in window
  const entries = Object.entries(globalData)
    .filter(([ts, entry]) =>
      Number(ts) > cutoff &&
      typeof entry.carbs === "number" &&
      typeof entry.insulin === "number"
    )
    .map(([, entry]) => entry);

  if (entries.length === 0) return null;

  const totalCarbs   = entries.reduce((sum, e) => sum + e.carbs,   0);
  const totalInsulin = entries.reduce((sum, e) => sum + e.insulin, 0);

  if (totalInsulin === 0) return null; // avoid divide-by-zero

  // carbs per unit
  const carbsPerUnit = totalCarbs / totalInsulin;
  const rounded      = Math.round(carbsPerUnit * 10) / 10;

  return `1 U : ${rounded} g`;
}



export function totalLast30Days(globalData) {
  const cutoff = Date.now() - 30*24*60*60*1000;
  return Object.keys(globalData||{})
    .filter(ts => Number(ts) > cutoff)
    .length;
}


export function timeSinceConsumption(utcMilliseconds) {
    const now = Date.now()
    const diffInMilliseconds = now - utcMilliseconds

    // Convert to seconds, minutes, hours, days, and months
    const seconds = Math.floor(diffInMilliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)

    // Get the remainder for each unit
    const remainingDays = days % 30
    const remainingHours = hours % 24
    const remainingMinutes = minutes % 60
    const remainingSeconds = seconds % 60

    // Construct the string
    let result = ''
    if (months > 0) result += `${months}M `
    if (remainingDays > 0) result += `${remainingDays}D `
    if (remainingHours > 0) result += `${remainingHours}H `
    if (remainingMinutes > 0) result += `${remainingMinutes}M `
    if (remainingSeconds > 0 || result === '') result += `${remainingSeconds}S` // Show seconds even if they're 0 if nothing else exists

    return result.trim() // Remove any trailing space
}


