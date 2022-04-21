import React, { useState, useEffect, useRef } from 'react'
import './styles/style.css'
import {
  FaArrowAltCircleDown,
  FaArrowAltCircleUp,
  FaPlayCircle,
  FaPauseCircle
} from 'react-icons/fa'
import { IoReloadCircle } from 'react-icons/io5'

const App = () => {
  const [breakLength, setBreakLength] = useState(5)
  const [sessionLength, setSessionLength] = useState(25)
  const [start, setStart] = useState(false)
  const [intervalId, setIntervalId] = useState(0)
  const [sessionTimer, setSessionTimer] = useState(true)
  const [millie, setMillie] = useState(convertToMillie(sessionLength))
  // const [timer, setTimer] = useState(convertToTimer())

  const audio = useRef(null)

  // listen to change of timer, session or break timer or when program switch timer
  useEffect(() => {
    sessionTimer
      ? setMillie(convertToMillie(sessionLength))
      : setMillie(convertToMillie(breakLength))
  }, [sessionTimer, sessionLength, breakLength])

  // set timer when user changes break or session
  useEffect(() => {
    // setTimer(convertToTimer())
    const current = convertToTimer(millie)
    if (current === '00:00') {
      console.log('times up')
      console.log(current)
      setSessionTimer(prev => !prev)
      audio.current.play()
    }

    // console.log(timer)
    // timer === '00:00' && console.log(timer)
    // console.log(audio.current.duration)
    // console.log(sessionTimer ? 'Session' : 'Break')
  }, [millie])

  // useEffect(() => {

  // }, [millie])

  // listen to start to start and stop countdown
  // useEffect(() => {
  //   console.log(start)
  //   start && interval
  //   !start && clearInterval(interval)

  // }, [start])

  // const interval = setInterval(countdown, 1000);

  // function countdown() {
  //   setMillie(prev => prev - 1000)
  // }

  // convert minutes to millieseconds
  function convertToMillie (num) {
    return Math.floor(num * 1000 * 60)
  }

  // use Date to create timer from millie state and return format mm:ss.
  function convertToTimer (num) {
    const date = new Date(0)
    date.setMilliseconds(num)
    return date.toISOString().substring(14, 19)

    // code below works as well
    // const minutes = Math.floor(millie / 60000)
    // const seconds = (millie % 60000) / 1000
    // return `${minutes
    //   .toString()
    //   .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // handle decrement and increment of break and session on click
  function handleTimerLength (event) {
    const id = event.currentTarget.id
    switch (id) {
      case 'break-decrement':
        setBreakLength(prev => (prev > 1 ? prev - 1 : prev))
        break
      case 'break-increment':
        setBreakLength(prev => (prev < 60 ? prev + 1 : prev))
        break
      case 'session-decrement':
        setSessionLength(prev => (prev > 1 ? prev - 1 : prev))
        break
      case 'session-increment':
        setSessionLength(prev => (prev < 60 ? prev + 1 : prev))
        break
      default:
        break
    }
  }
  console.log(sessionLength)

  // handle start state with true or false to switch play and start icon
  function handleStart () {
    setStart(prev => !prev)

    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(0)
      return
    }

    const newIntervalId = setInterval(() => {
      setMillie(prev => prev - 1000)
    }, 1000)
    setIntervalId(newIntervalId)
  }

  // handle reset of the app when click reset icon
  function handleReset () {
    intervalId && clearInterval(intervalId)
    intervalId && setIntervalId(0)
    setBreakLength(5)
    setSessionLength(25)
    setStart(false)
    setSessionTimer(true)
    setMillie(convertToMillie(sessionLength))
    audio.current.pause()
    audio.current.currentTime = 0
  }

  // create play and start icons bases on state
  const play = start ? (
    <FaPauseCircle id='start_stop' onClick={handleStart} />
  ) : (
    <FaPlayCircle id='start_stop' onClick={handleStart} />
  )

  // create the active timer title to be showed
  const timerTitle = sessionTimer ? 'Session' : 'Break'

  return (
    <div id='clock-container'>
      <h1>25 + 5 Clock</h1>
      <div id='header-controle-container'>
        <div className='header-controle-box'>
          <h3 id='break-label'>Break Length</h3>
          <div className='inner-controle-box'>
            <FaArrowAltCircleDown
              id='break-decrement'
              onClick={event => !intervalId && handleTimerLength(event)}
            />
            <h3 id='break-length'>{breakLength.toString()}</h3>
            <FaArrowAltCircleUp
              id='break-increment'
              onClick={event => !intervalId && handleTimerLength(event)}
            />
          </div>
        </div>
        <div className='header-controle-box'>
          <h3 id='session-label'>Session Length</h3>
          <div className='inner-controle-box'>
            <FaArrowAltCircleDown
              id='session-decrement'
              onClick={event => !intervalId && handleTimerLength(event)}
            />

            <h3 id='session-length'>{sessionLength}</h3>
            <FaArrowAltCircleUp
              id='session-increment'
              onClick={event => !intervalId && handleTimerLength(event)}
            />
          </div>
        </div>
      </div>
      <div id='timer-container'>
        <h3 id='timer-label'>{timerTitle}</h3>
        <div id='timer-controle-container'>
          {play}
          <div id='time-left'>{convertToTimer(millie)}</div>
          <IoReloadCircle id='reset' onClick={handleReset} />
        </div>
      </div>
      <div id='credentials-box'>
        <p>
          Concept bv{' '}
          <a
            rel="noreferrer"
            href='https://www.freecodecamp.org/learn/front-end-development-libraries/front-end-development-libraries-projects/build-a-25--5-clock'
            target='_blank'
          >
            FCC
          </a>{' '}
          | Build by{' '}
          <a rel="noreferrer" href='https://github.com/etrigo/' target='_blank'>
            Etrigo
          </a>
        </p>
      </div>
      <audio
        id='beep'
        ref={audio}
        src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'
        type='audio'
      />
    </div>
  )
}

export default App
