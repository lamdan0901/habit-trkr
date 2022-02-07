import Modal from 'react-modal'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Checkbox } from '@nextui-org/react'
import { BsTrash } from 'react-icons/bs'

import HabitModal from 'components/HabitModal/HabitModal'
import { useClockState } from 'contexts/SidebarProvider'
import * as habitColor from 'constants/habitColors'
import './HabitList.scss'

export default function HabitList(props) {
  const [habitModalOpened, setHabitModalOpened] = useState(false)
  const [confirmDialogOpened, setConfirmDialogOpened] = useState(false)

  const [currentHabit, setCurrentHabit] = useState({})
  const [tempHabit, setTempHabit] = useState() //habit that is saved before being deleted

  function handleChooseHabit(habit) {
    setCurrentHabit(habit)
    setHabitModalOpened(true)
  }

  function handleDeleteHabit() {
    props.onDeleteHabit(tempHabit)
  }

  function handleOpenDialog(habit) {
    setTempHabit(habit)
    setConfirmDialogOpened(true)
  }

  function handleCloseConfirmDialog() {
    setConfirmDialogOpened(false)
  }

  //**---- handle update habit checkboxes list ----**//

  const habitIds = props.habitsList.map((habit) => habit.id)
  const [habitsCheck, setHabitsCheck] = useState([])
  const [allHabitsCheck, setAllHabitsCheck] = useState(false)

  const updateHabitCheckBoxes = useCallback(() => {
    let habitsCheckList = []
    props.habitsList.forEach((habit) => {
      if (habit.checked) habitsCheckList.push(habit.id)
    })
    return habitsCheckList
  }, [props.habitsList])

  const updateAllDoneBox = useCallback(() => {
    if (habitsCheck.length === props.habitsList.length) return true
    return false
  }, [habitsCheck, props.habitsList])

  useEffect(() => {
    setHabitsCheck(updateHabitCheckBoxes)
  }, [updateHabitCheckBoxes])

  useEffect(() => {
    setAllHabitsCheck(updateAllDoneBox)
  }, [updateAllDoneBox])

  // const handleAllHabitsCheck = () => {
  // if (allHabitsCheck) {
  //   setAllHabitsCheck(false)
  //   setHabitsCheck([])
  //   props.habitsList.forEach((habit) => {
  //     habit.checked = false
  //     props.onEditHabit(habit, 'no notification')
  //   })
  // } else {
  //   setAllHabitsCheck(true)
  //   setHabitsCheck(habitIds)
  //   props.habitsList.forEach((habit) => {
  //     if (!habit.checked) {
  //       habit.checked = true
  //       props.onEditHabit(habit, 'no notification')
  //     }
  //   })
  // }
  // }

  const handleSingleHabitCheck = (habit) => {
    const id = habit.id

    if (habitsCheck.includes(id)) {
      setHabitsCheck(habitsCheck.filter((checked_ID) => checked_ID !== id))
      setAllHabitsCheck(false)
      habit.checked = false
    } else {
      habitsCheck.push(id)
      setHabitsCheck([...habitsCheck])
      setAllHabitsCheck(habitsCheck.length === habitIds.length)
      habit.checked = true
    }

    props.onEditHabit(habit, 'no notification')
  }

  //**---- handle change 'gridTemplateColumns' of the habits list according to width ----**//

  const habitsListRef = useRef()
  const [habitsListStyle, setHabitsListStyle] = useState({
    display: 'grid',
    gridTemplateColumns: 'auto auto',
  })

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const habitsListElement = entries[0]

      if (habitsListElement.contentRect.width < 530) {
        setHabitsListStyle((prevValue) => ({ ...prevValue, gridTemplateColumns: 'auto' }))
      } else {
        setHabitsListStyle((prevValue) => ({ ...prevValue, gridTemplateColumns: 'auto auto' }))
      }
    })
    resizeObserver.observe(habitsListRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [habitsListRef])

  //**---- handle display habit color according to clockState and habitTime ----**//

  const clockState = useClockState()
  const [habitMainColors, setHabitMainColors] = useState([])

  useEffect(() => {
    const currentColorsList = []

    props.habitsList.forEach((habit) => {
      if (!habit.checked) {
        const formattedHabitTime = formatHabitTime(habit.time)
        const am_pmCompareRes = clockState.slice(6, 8).localeCompare(formattedHabitTime.slice(6, 8))

        //PM-PM || AM-AM
        if (am_pmCompareRes === 0) {
          const formattedTimeHour = ~~formattedHabitTime.slice(0, 2)
          const formattedTimeMinute = ~~formattedHabitTime.slice(3, 5)

          const clockStateHour = ~~clockState.slice(0, 2)
          const clockStateMinute = ~~clockState.slice(3, 5)

          if (formattedTimeHour === clockStateHour) {
            if (formattedTimeMinute < clockStateMinute) {
              currentColorsList.push(habitColor.expirationColor)
            } else {
              currentColorsList.push(habitColor.normalColor)
            }
          } else if (formattedTimeHour !== 12 && clockStateHour !== 12) {
            if (formattedTimeHour < clockStateHour) {
              currentColorsList.push(habitColor.expirationColor)
            } else {
              currentColorsList.push(habitColor.normalColor)
            }
          } else if (formattedTimeHour === 12) {
            currentColorsList.push(habitColor.expirationColor)
          } else {
            currentColorsList.push(habitColor.normalColor)
          }
        }
        //PM-AM
        else if (am_pmCompareRes === 1) {
          currentColorsList.push(habitColor.expirationColor)
        }
        //AM-PM
        else {
          currentColorsList.push(habitColor.normalColor)
        }
      } else {
        currentColorsList.push(habitColor.checkColor)
      }
    })

    setHabitMainColors(currentColorsList)
  }, [clockState, props.habitsList])

  function formatHabitTime(habitTime) {
    let formattedHabitTime = new Date(habitTime).toString().slice(16, 21)
    const hour = ~~formattedHabitTime.slice(0, 2)
    const minute = formattedHabitTime.slice(3, 5)

    if (hour === 0) {
      formattedHabitTime = 12 + ':' + minute + ' AM'
    } else if (hour < 12) {
      if (hour < 10) formattedHabitTime = '0' + hour + ':' + minute + ' AM'
      else formattedHabitTime = hour + ':' + minute + ' AM'
    } else if (hour === 12) {
      formattedHabitTime = hour + ':' + minute + ' PM'
    } else {
      if (hour - 12 < 10) formattedHabitTime = '0' + (hour - 12) + ':' + minute + ' PM'
      else formattedHabitTime = hour - 12 + ':' + minute + ' PM'
    }

    return formattedHabitTime
  }

  //**---- handle send browser notification ----**//

  useEffect(() => {
    const today = new Date().toDateString().slice(0, 3)
    const currentHabitsList = props.habitsList.filter((habit) => habit.daysChecked.includes(today))

    currentHabitsList.forEach((habit) => {
      const formattedHabitTime = formatHabitTime(habit.time)
      if (formattedHabitTime.localeCompare(clockState) === 0) {
        sendBrowserNotif("It's time you did this habit", habit.name)
      }
    })
  }, [clockState, props.habitsList])

  function sendBrowserNotif(title, body, icon) {
    if (!('Notification' in window)) {
      console.warn('Your Browser does not support Chrome Notifications :(')
    } else if (Notification.permission === 'granted') {
      new Notification(title, {
        icon,
        body,
      })
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(title, {
            icon,
            body,
          })
        } else {
          console.warn(`Failed, Notification Permission is ${Notification.permission}`)
        }
      })
    } else {
      console.warn(`Failed, Notification Permission is ${Notification.permission}`)
    }
  }

  return (
    <>
      {habitModalOpened && (
        <HabitModal
          isEditMode={true}
          habit={currentHabit}
          habitsList={props.habitsList}
          isEditModalOpened={habitModalOpened}
          onEditHabit={props.onEditHabit}
          onDeleteHabit={handleDeleteHabit}
          onCloseModal={() => {
            setHabitModalOpened(false)
          }}
        />
      )}

      <div className="habits-view">
        <div>
          <Checkbox
            color="primary"
            className="check-all_done-box"
            title="Click to set all the habits done"
            checked={allHabitsCheck}
            // onChange={handleAllHabitsCheck}
          >
            All done
          </Checkbox>
        </div>

        <ul className="habits-list" ref={habitsListRef} style={habitsListStyle}>
          {props.habitsList.map((habit, index) => (
            <div key={index}>
              <Checkbox
                color="success"
                className="check-habit-box"
                title="Click to check this habit"
                checked={habitsCheck.includes(habit.id)}
                onChange={() => {
                  handleSingleHabitCheck(habit)
                }}
              />

              <li
                title="Click to view details"
                style={habitMainColors[index]}
                onClick={() => {
                  handleChooseHabit(habit)
                }}>
                <p className="habit-name">{habit.name}</p>

                <div className="habit-time">{formatHabitTime(habit.time)}</div>

                <div
                  title="Delete this habit"
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation() //so that when we click the child element, it won't call the parent element
                    handleOpenDialog(habit)
                  }}>
                  <BsTrash />
                </div>
              </li>
            </div>
          ))}
        </ul>
      </div>

      <Modal
        className="confirm-dialog"
        overlayClassName="confirm-dialog-overlay"
        isOpen={confirmDialogOpened}
        onRequestClose={handleCloseConfirmDialog}
        shouldCloseOnOverlayClick={false}
        closeTimeoutMS={200}>
        <div className="confirm-dialog-content">
          <h3>Delete Habit</h3>
          <p>Are you sure you want to delete this habit?</p>
          <div className="delete-btn-group">
            <button
              className="btn cancel-btn"
              onClick={() => {
                handleDeleteHabit()
                handleCloseConfirmDialog()
              }}>
              DELETE
            </button>
            <button className="btn confirm-btn" onClick={handleCloseConfirmDialog}>
              CANCEL
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
