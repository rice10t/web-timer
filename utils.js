export function secondsToTimeString(timeSeconds) {
  const hours = (timeSeconds >= 3600) ? Math.floor(timeSeconds / 3600) : 0
  const minutes = (timeSeconds >= 60) ? (Math.floor(timeSeconds / 60)) % 60 : 0
  const seconds = timeSeconds % 60

  const hoursStr = hours.toString().padStart(2, "0")
  const minutesStr = minutes.toString().padStart(2, "0")
  const secondsStr = seconds.toString().padStart(2, "0")

  return `${hoursStr}:${minutesStr}:${secondsStr}`
}

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
