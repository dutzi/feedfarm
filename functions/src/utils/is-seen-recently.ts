export default function isSeenRecently(lastSeen: any) {
  if (lastSeen) {
    return new Date().getTime() - lastSeen._seconds * 1000 < 5 * 60 * 1000;
  } else {
    return false;
  }
}
