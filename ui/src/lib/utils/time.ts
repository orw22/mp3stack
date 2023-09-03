/**
 * Converts a float/integer number of seconds to a formatted string in MM:SS format.
 * @param seconds - Current time/duration in seconds.
 * @returns {string} A formatted string in MM:SS format.
 * @function
 */
export function secondsToMMSS(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds) % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
