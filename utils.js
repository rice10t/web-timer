import {useEffect, useRef} from "react"

/**
 * 秒数を HH:mm:ss の形式の文字列に変換する
 * マイナスの秒数を渡した場合、結果もマイナスになる
 */
export function secondsToTimeString(timeSeconds) {
  const isPositive = timeSeconds >= 0
  const absSeconds = Math.abs(timeSeconds)

  const hours = (absSeconds >= 3600) ? Math.floor(absSeconds / 3600) : 0
  const minutes = (absSeconds >= 60) ? (Math.floor(absSeconds / 60)) % 60 : 0
  const seconds = absSeconds % 60

  const hoursStr = hours.toString().padStart(2, "0")
  const minutesStr = minutes.toString().padStart(2, "0")
  const secondsStr = seconds.toString().padStart(2, "0")

  return `${isPositive ? "" : "-"}${hoursStr}:${minutesStr}:${secondsStr}`
}

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
