import React, {useState, useEffect} from "react"
import {secondsToTimeString, usePrevious} from "./utils"
import styles from "./button.css"
import alarmSound from './alarm.mp3'

export const Time = ({time}) => {
  return <div className={styles.time}>
    {secondsToTimeString(time)}
  </div>
}

export const Button = ({onClick, children}) => {
  return <div className={styles.button} onClick={onClick}>
    {children}
  </div>
}

export const AudioC = React.memo((props = {playing: false, src: ""}) => {
  const prev = usePrevious(props.playing)
  const prevPlaying = prev === undefined ? false : prev

  useEffect(() => {
    const a = new Audio(props.src)

    if (prevPlaying === false && props.playing === true) {
      // 再生した
      a.play()
    } else if (prevPlaying === true && props.playing === false) {
      // 停止した
      a.pause()
    }

    return () => {
      a.pause()
    }
  })

  return null
})

// TODO パフォーマンスの改善
// コンポーネントの更新頻度
export const Root = () => {
  const [state, setState] = useState({
    time: 0,
    timerStartTime: performance.now(),
    progressing: false,
    timerId: null
  })

  const currentTime = state.progressing
    ? state.time - Math.floor((performance.now() - state.timerStartTime) / 1000) : state.time

  useEffect(() => {
    document.title = secondsToTimeString(currentTime)
  }, [currentTime])

  const addTime = (seconds) => {
    setState({
      ...state,
      time: state.time + seconds
    })
  }

  const toggleTimer = () => {
    if (!state.progressing) {
      // start
      const id = setInterval(() => setState(prev => ({
        ...prev,
      })), 100)
      setState({
        ...state,
        timerStartTime: performance.now(),
        progressing: true,
        timerId: id,
      })
    } else {
      // stop
      clearInterval(state.timerId)
      setState({
        ...state,
        time: currentTime,
        progressing: false,
        timerId: null,
      })
    }
  }

  const clearTimer = () => {
    if (state.timerId !== null) {
      clearInterval(state.timerId)
    }
    setState({
      ...state,
      time: 0,
      progressing: false,
      timerId: null
    })
  }

  return <div className={styles.root}>
    <div>
      <Time time={currentTime}/>
      <AudioC playing={currentTime <= 0 && state.progressing} src={alarmSound}/>
      <Button onClick={() => addTime(300)}>
        +5m
      </Button>
      <Button onClick={() => addTime(60)}>
        +1m
      </Button>
      <Button onClick={() => addTime(10)}>
        +10s
      </Button>
      <Button onClick={() => clearTimer()}>
        Clear
      </Button>
      <Button onClick={() => toggleTimer()}>
        {state.progressing ? "stop" : "start"}
      </Button>
    </div>
  </div>
}
