// Format seconds into mm:ss
export function formatTime(seconds) {
  if (seconds === null || seconds === undefined) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Format duration for history display
export function formatDuration(seconds) {
  if (!seconds) return '0m';
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) {
    const remainMins = mins % 60;
    return remainMins > 0 ? `${hrs}h ${remainMins}m` : `${hrs}h`;
  }
  return `${mins}m`;
}

// Get day name from timestamp
export function getDayName(timestamp) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[new Date(timestamp).getDay()];
}

// Get relative time string
export function getRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

// Group history items by date
export function groupByDate(items) {
  const groups = {};
  items.forEach((item) => {
    const date = new Date(item.startTime).toLocaleDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  });
  return groups;
}

// Get most used mood from history
export function getMostUsedMood(history) {
  if (!history.length) return null;
  const counts = {};
  history.forEach((item) => {
    counts[item.moodId] = (counts[item.moodId] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

// Get total listening time in seconds
export function getTotalListeningTime(history) {
  return history.reduce((sum, item) => sum + (item.duration || 0), 0);
}

// Get streak data (consecutive days with sessions)
export function getStreak(history) {
  if (!history.length) return 0;
  const dates = [...new Set(
    history.map((h) => new Date(h.startTime).toDateString())
  )].sort((a, b) => new Date(b) - new Date(a));

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = new Date(dates[i - 1]) - new Date(dates[i]);
    if (diff <= 86400000) streak++;
    else break;
  }
  return streak;
}
