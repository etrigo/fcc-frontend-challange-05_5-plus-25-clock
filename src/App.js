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
  const [timerTitle, setTimerTitle] = useState('Session')
  const [millie, setMillie] = useState(convertToMillie(sessionLength))

  // use of hook for audio
  const audio = useRef(null)

  // listen to change of timer type and timer title
  useEffect(() => {
    sessionTimer
      ? setMillie(convertToMillie(sessionLength))
      : setMillie(convertToMillie(breakLength))

    sessionTimer ? setTimerTitle('Session') : setTimerTitle('Break')
  }, [sessionTimer])

  // Listen to change in session timer length
  useEffect(() => {
    sessionTimer && setMillie(convertToMillie(sessionLength))
  }, [sessionLength])

  // listen to change in break length
  useEffect(() => {
    !sessionTimer && setMillie(convertToMillie(breakLength))
  }, [breakLength])

  // set timer to length in state on timer switch
  useEffect(() => {
    // setTimer(convertToTimer())
    // const current = convertToTimer(millie)
    if (millie === 0) {
      setStart(prev => !prev)

      audio.current.play()
      setTimeout(() => {
        setSessionTimer(prev => !prev)
        // audio.current.pause()
        setStart(prev => !prev)
        if (intervalId) {
          clearInterval(intervalId)
          setIntervalId(0)
        }

        const newIntervalId = setInterval(() => {
          setMillie(prev => prev - 1000)
        }, 1000)

        setIntervalId(newIntervalId)
      }, 1000)
    }
  }, [millie])

  // convert minutes to millieseconds
  function convertToMillie (num) {
    return Math.floor(num * 1000 * 60)
  }

  // convert current milliseconds in to timer of format mm:ss
  function convertToTimer () {
    const minutes = Math.floor(millie / 60000)
    const seconds = (millie % 60000) / 1000
    return `${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // handle decrement and increment of break and session on click
  // if intervalId state is true dont run the switch statement
  function handleTimerLength (event) {
    const id = event.currentTarget.id
    if (!intervalId) {
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
    return
  }

  // handle start state with true or false to switch play and start icon
  // and set or clear countdown interval
  function handleStart () {
    setStart(prev => !prev)
    // console.log('start_stop')
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
    setIntervalId(0)
    setBreakLength(5)
    setSessionLength(25)
    setSessionTimer(true)
    setTimerTitle('Session')
    setStart(false)
    setMillie(convertToMillie(sessionLength))
    audio.current.pause()
    audio.current.currentTime = 0
  }

  // create play and start buttons with icons bases on state
  const play = start ? (
    <button id='start_stop' onClick={handleStart}>
      <FaPauseCircle />
    </button>
  ) : (
    <button id='start_stop' onClick={handleStart}>
      <FaPlayCircle />
    </button>
  )

  return (
    <div id='clock-container'>
      <h1>25 + 5 Clock</h1>
      <div id='header-controle-container'>
        <div className='header-controle-box'>
          <h3 id='break-label'>Break Length</h3>
          <div className='inner-controle-box'>
            <button
              id='break-decrement'
              onClick={event => handleTimerLength(event)}
            >
              <FaArrowAltCircleDown />
            </button>
            <h3 id='break-length'>{breakLength}</h3>
            <button
              id='break-increment'
              onClick={event => handleTimerLength(event)}
            >
              <FaArrowAltCircleUp />
            </button>
          </div>
        </div>
        <div className='header-controle-box'>
          <h3 id='session-label'>Session Length</h3>
          <div className='inner-controle-box'>
            <button
              id='session-decrement'
              onClick={event => handleTimerLength(event)}
            >
              <FaArrowAltCircleDown />
            </button>
            <h3 id='session-length'>{sessionLength}</h3>

            <button
              id='session-increment'
              onClick={event => handleTimerLength(event)}
            >
              <FaArrowAltCircleUp />
            </button>
          </div>
        </div>
      </div>
      <div id='timer-container'>
        <h3 id='timer-label'>{timerTitle}</h3>
        <div id='timer-controle-container'>
          {play}
          <div id='time-left'>{convertToTimer()}</div>
          <button id='reset' onClick={event => handleReset(event)}>
            <IoReloadCircle />
          </button>
        </div>
      </div>
      <div id='credentials-box'>
        <p>
          Concept bv{' '}
          <a
            rel='noreferrer'
            href='https://www.freecodecamp.org/learn/front-end-development-libraries/front-end-development-libraries-projects/build-a-25--5-clock'
            target='_blank'
          >
            FCC
          </a>{' '}
          | Build by{' '}
          <a rel='noreferrer' href='https://github.com/etrigo/' target='_blank'>
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
