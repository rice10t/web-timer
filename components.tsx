import React, {useState, useEffect, InputHTMLAttributes, useRef} from "react"
import {secondsToTimeString, usePrevious} from "./utils"
import styles from "./button.css"
import alarmSound from './alarm.mp3'

const Time: React.FC<{ time: number }> = ({time}) => {
  return <div className={styles.time}>
    {secondsToTimeString(time)}
  </div>
}

const Button: React.FC<{ onClick: () => void, children?: React.ReactNode }> = ({onClick, children}) => {
  return <div className={styles.button} onClick={onClick}>
    {children}
  </div>
}

const TimerNameInput: React.FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return <input className={styles.timerName} type="text" {...props} />
}

const ClearButton: React.FC<{ onClick: () => void, children?: React.ReactNode }> = ({onClick, children}) => {
  return <div className={styles.clearButton} onClick={onClick}>{children}</div>
}

const Initializer: React.FC = () => {
  useEffect(() => {
    Notification.requestPermission()
  }, [])
  return null
}

const AudioC = React.memo<{ playing: boolean, src: string }>((props = {playing: false, src: ""}) => {
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


const DesktopNotification: React.FC<{ currentTime: number, timerName: string }> = ({currentTime, timerName}) => {
  const prevTime = usePrevious(currentTime)
  useEffect(() => {
    if (currentTime === 0 && prevTime === 1 && Notification.permission === "granted") {
      new Notification("Time is up!", {
        body: timerName
      })
    }
  })

  return null;
}

export const Root: React.FC = () => {
  const timerStartTime = useRef(performance.now())
  const timerId = useRef<number>(null)

  const [state, setState] = useState({
    startTime: 0,
    displayTime: 0,
    progressing: false,
    timerName: ""
  })

  useEffect(() => {
    const timerName = state.timerName !== "" ? ` - ${state.timerName}` : ""
    document.title = secondsToTimeString(state.displayTime) + timerName
  }, [state.timerName, state.displayTime])

  const addTime = (seconds) => {
    setState({
      ...state,
      startTime: state.startTime + seconds,
      displayTime: state.startTime + seconds,
    })
  }

  const toggleTimer = () => {
    if (!state.progressing) {
      // start
      const id = setInterval(() => {
        setState(prev => {
          const nextTime = prev.startTime - Math.floor((performance.now() - timerStartTime.current) / 1000)
          if (nextTime === prev.displayTime) {
            return prev
          } else {
            return {
              ...prev,
              displayTime: nextTime
            }
          }
        })
      }, 50)
      timerStartTime.current = performance.now()
      timerId.current = id
      setState({
        ...state,
        progressing: true,
      })
    } else {
      // stop
      clearInterval(timerId.current)
      timerId.current = null
      setState({
        ...state,
        startTime: state.displayTime,
        progressing: false,
      })
    }
  }

  const clearTimer = () => {
    if (timerId.current !== null) {
      clearInterval(timerId.current)
    }
    timerId.current = null
    setState({
      ...state,
      startTime: 0,
      displayTime: 0,
      progressing: false,
    })
  }

  const updateTimerName = (e) => {
    setState({
      ...state,
      timerName: e.target.value
    })
  }

  return <div className={styles.root}>
    <div>
      <div className={styles.timerHeader}>
        <TimerNameInput placeholder="Name" onChange={updateTimerName}/>
        <ClearButton onClick={() => clearTimer()}>x</ClearButton>
      </div>
      <Time time={state.displayTime}/>
      <div className={styles.buttonContainer}>
        <div>
          <Button onClick={() => addTime(300)}>
            +5m
          </Button>
          <Button onClick={() => addTime(60)}>
            +1m
          </Button>
          <Button onClick={() => addTime(10)}>
            +10s
          </Button>
        </div>
        <div>
          <Button onClick={() => toggleTimer()}>
            {state.progressing ? "Stop" : "Start"}
          </Button>
        </div>
      </div>
    </div>
    <Initializer/>
    <AudioC playing={state.displayTime <= 0 && state.progressing} src={alarmSound}/>
    <DesktopNotification currentTime={state.displayTime} timerName={state.timerName}/>
  </div>
}
