import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import { toast, cssTransition } from 'react-toastify'
import StaticTimePicker from '@mui/lab/StaticTimePicker'
import MobileTimePicker from '@mui/lab/MobileTimePicker'

import MainLayout from 'layouts/MainLayout'
import { useClockState } from 'contexts/SidebarProvider'
import { sendBrowserNotif } from 'utils/sendBrowserNotif'
import aibLogo from '../../assets/img/aib-logo.jpg'
import './SleepCalculator.scss'

export default function SleepCalculator(props) {
  document.title = 'Sleep Time Calculator'

  const clockState = useClockState()
  const [notifyTime, setNotifyTime] = useState(null)
  const [resultsShowed, setResultsShowed] = useState(false)
  const [moreInfoShowed, setMoreInfoShowed] = useState(false)

  const [time, setTime] = useState(new Date())

  const [calculatedTime, setCalculatedTime] = useState([
    { hour: 0, minute: 0 },
    { hour: 0, minute: 0 },
    { hour: 0, minute: 0 },
    { hour: 0, minute: 0 },
  ])

  const calSleepTime = () => {
    let calculatingTime = [
      { hour: 0, minute: 0 },
      { hour: 0, minute: 0 },
      { hour: 0, minute: 0 },
      { hour: 0, minute: 0 },
    ]

    const hour = ~~time.toString().slice(16, 18),
      minute = ~~time.toString().slice(19, 21)

    for (let i = 0; i < 4; i++) {
      switch (i) {
        case 0: {
          //'3 cycles'
          calculatingTime[i].hour = hour - 4
          calculatingTime[i].minute = minute - 45
          break
        }
        case 1: {
          //'4 cycles'
          calculatingTime[i].hour = hour - 6
          calculatingTime[i].minute = minute - 15
          break
        }
        case 2: {
          //'5 cycles'
          calculatingTime[i].hour = hour - 7
          calculatingTime[i].minute = minute - 45
          break
        }
        case 3: {
          //'6 cycles'
          calculatingTime[i].hour = hour - 9
          calculatingTime[i].minute = minute - 15
          break
        }
        default: {
          break
        }
      }

      if (calculatingTime[i].minute < 0) {
        calculatingTime[i].minute = 60 + calculatingTime[i].minute
        calculatingTime[i].hour -= 1
      }
      if (calculatingTime[i].hour < 0) {
        calculatingTime[i].hour = 12 + calculatingTime[i].hour
        calculatingTime[i].minute += ' PM'
      } else {
        calculatingTime[i].minute += ' AM'
      }

      // add '0' before if hour or minute is less than 10
      if (calculatingTime[i].hour < 10) {
        calculatingTime[i].hour = '0' + calculatingTime[i].hour
      }
      if (~~calculatingTime[i].minute.toString().slice(0, 2) < 10) {
        calculatingTime[i].minute = '0' + calculatingTime[i].minute
      }
    }

    return calculatingTime
  }

  function handleChangeCalculatedTime() {
    setCalculatedTime(calSleepTime)
  }

  function handleSetNotifySleepTime(time) {
    setNotifyTime(time)
    toast(`✅ Sleep time notification at ${time} saved!`, {
      position: 'top-right',
      hideProgressBar: true,
      closeOnClick: true,
      progress: undefined,
      transition: cssTransition({
        enter: 'animate__animated animate__fadeIn',
        exit: 'animate__animated animate__fadeOut',
      }),
    })
  }

  useEffect(() => {
    if (notifyTime) {
      if (notifyTime.localeCompare(clockState) === 0) {
        sendBrowserNotif(
          'Habit Tracker',
          `Hey! Now is ${clockState}. It's time to sleep.\nHave a good night! 😴😴😴`,
          aibLogo,
        )
      }
    }
  }, [clockState, notifyTime])

  return (
    <MainLayout>
      <div className={resultsShowed ? 'sleep-container has-overflow' : 'sleep-container'}>
        <div className="sleep-cal">
          <h3>You want to wake up at...</h3>

          <div className="selector-wrapper">
            {props.windowWidth > 480 ? (
              <StaticTimePicker
                ampm
                orientation={props.windowWidth > 768 ? 'landscape' : 'portrait'}
                openTo="hours"
                value={time}
                onChange={(newValue) => {
                  setTime(newValue)
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            ) : (
              <MobileTimePicker
                label="Select time"
                orientation="portrait"
                ampm
                value={time}
                onChange={(newValue) => {
                  setTime(newValue)
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            )}

            <button
              className="cal-btn"
              onClick={() => {
                handleChangeCalculatedTime()
                setResultsShowed(true)
              }}>
              Calculate
            </button>
          </div>
        </div>

        <div className={resultsShowed ? 'results' : 'results inactive'}>
          <h3>You should try to fall asleep at one of these following times:</h3>

          <div className="calculated-time">
            <div></div>

            <div
              className="item"
              onClick={() => {
                handleSetNotifySleepTime(`${calculatedTime[0].hour}:${calculatedTime[0].minute}`)
              }}>
              <h1>{`${calculatedTime[0].hour} : ${calculatedTime[0].minute}`}</h1>
              <p>(3 sleep cycles)</p>
            </div>
            <div
              className="item"
              onClick={() => {
                handleSetNotifySleepTime(`${calculatedTime[1].hour}:${calculatedTime[1].minute}`)
              }}>
              <h1>{`${calculatedTime[1].hour} : ${calculatedTime[1].minute}`}</h1>
              <p>(4 sleep cycles)</p>
            </div>

            <div></div>
            <div></div>

            <div
              className="item"
              onClick={() => {
                handleSetNotifySleepTime(`${calculatedTime[2].hour}:${calculatedTime[2].minute}`)
              }}>
              <h1>{`${calculatedTime[2].hour} : ${calculatedTime[2].minute}`}</h1>
              <p>(5 sleep cycles)</p>
            </div>
            <div
              className="item"
              onClick={() => {
                handleSetNotifySleepTime(`${calculatedTime[3].hour}:${calculatedTime[3].minute}`)
              }}>
              <h1>{`${calculatedTime[3].hour} : ${calculatedTime[3].minute}`}</h1>
              <p>(6 sleep cycles)</p>
            </div>

            <div></div>
          </div>

          <p className="reminder-text">
            Select one of those to set a reminder to fall asleep at that time.
          </p>

          <div className="more-info-wrapper">
            <button
              className="learn-more-btn"
              onClick={() => {
                setMoreInfoShowed(!moreInfoShowed)
              }}>
              {!moreInfoShowed ? 'Learn more' : 'Hide info'}
            </button>

            <div className={moreInfoShowed ? 'more-info' : 'more-info inactive'}>
              <p>
                The average human takes <strong>fifteen minutes</strong> to fall asleep, so we added
                it to the calculation.
              </p>
              <p>
                Waking up in the middle of a sleep cycle leaves you feeling tired and groggy, but
                waking up in between cycles wakes you up feeling refreshed and alert!
              </p>
              <a
                href="https://www.sleephealthfoundation.org.au/good-sleep-habits.html"
                target="_blank"
                rel="noreferrer">
                Click here to find out more about good sleep habits
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
