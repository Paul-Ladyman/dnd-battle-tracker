export default function getSecondsElapsed(round) {
  if (!round || round <= 0) {
    return 0;
  }
  return (round - 1) * 6;
}
