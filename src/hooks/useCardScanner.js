import { useEffect, useCallback, useRef, useState } from "react"
import DataManager from "../services/DataManager"
import { REACTION_DELAY_TIME, MODE_SEARCH_PARAM, MESSAGES } from "../utils/constants"

const normalizeMode = (value) => (value === "dual" ? "dual" : "single")

const getModeFromLocation = () => {
  const params = new URLSearchParams(window.location.search)
  return normalizeMode(params.get(MODE_SEARCH_PARAM))
}

export const useCardScanner = () => {
  const [icon, setIcon] = useState(undefined)
  const [title, setTitle] = useState(MESSAGES.welcome.title)
  const [subtitle, setSubtitle] = useState(MESSAGES.welcome.subtitle)
  const [mode, setMode] = useState(getModeFromLocation)

  const scannedNumber = useRef("")
  const dataManager = useRef(null)

  useEffect(() => {
    dataManager.current = new DataManager(getModeFromLocation())
  }, [])

  useEffect(() => {
    const handlePopstate = () => {
      const nextMode = getModeFromLocation()
      setMode((current) => (current === nextMode ? current : nextMode))
    }

    window.addEventListener("popstate", handlePopstate)
    return () => {
      window.removeEventListener("popstate", handlePopstate)
    }
  }, [])

  const resetState = useCallback(() => {
    setIcon(undefined)
    setTitle(MESSAGES.welcome.title)
    setSubtitle(MESSAGES.welcome.subtitle)
  }, [])

  const handleScan = useCallback(
    (scannedNumberRef, iconSad, iconLaughing) => {
      const manager = dataManager.current
      if (!manager) {
        return
      }

      if (manager.isUserLogged(scannedNumberRef.current)) {
        setIcon(iconSad)
        setTitle(MESSAGES.alreadyCheckedIn.title)
        setSubtitle(MESSAGES.alreadyCheckedIn.subtitle)
        setTimeout(resetState, REACTION_DELAY_TIME)
      } else {
        manager.logUser(scannedNumberRef.current)
        setIcon(iconLaughing)
        setTitle(MESSAGES.success.title)
        setSubtitle(MESSAGES.success.subtitle)
        setTimeout(resetState, REACTION_DELAY_TIME)
      }

      scannedNumberRef.current = ""
    },
    [resetState]
  )

  const handleModeClick = useCallback(() => {
    const newMode = mode === "single" ? "dual" : "single"
    if (confirm(`Are you sure you want to switch to ${newMode} mode?`)) {
      dataManager.current?.setMode(newMode)
      setMode(newMode)

      const params = new URLSearchParams(window.location.search)
      if (params.get(MODE_SEARCH_PARAM) === newMode) {
        return
      }

      params.set(MODE_SEARCH_PARAM, newMode)
      const query = params.toString()
      const separator = query ? `?${query}` : ""
      const newUrl = `${window.location.pathname}${separator}${window.location.hash}`
      window.history.replaceState({}, "", newUrl)

      alert(`Switched to ${newMode} mode.`)
    }
  }, [mode])

  const handleResetClick = useCallback(() => {
    if (confirm("Are you sure you want to reset the name list?")) {
      dataManager.current?.emptyData()
    }
  }, [])

  const handleExportToCSV = useCallback(() => {
    const manager = dataManager.current
    if (!manager || manager.getTotalLogs() === 0) {
      alert("Sorry, the name list is empty.")
      return
    }

    let csvContent = "data:text/csv;charset=utf-8,"
    manager.getData().forEach(function (count, cardId) {
      csvContent += cardId + "," + count + "\r\n"
    })

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "name-list.csv")
    document.body.appendChild(link)
    link.click()

    setTimeout(() => {
      document.body.removeChild(link)
    }, 0)
  }, [])

  const useKeyboardListener = (iconSad, iconLaughing) => {
    const handleKeyDown = useCallback(
      (event) => {
        if (event.key === "Enter" && scannedNumber.current.length > 0) {
          handleScan(scannedNumber, iconSad, iconLaughing)
        } else if (!isNaN(event.key)) {
          scannedNumber.current = scannedNumber.current + event.key
        }
      },
      [iconSad, iconLaughing]
    )

    useEffect(() => {
      document.addEventListener("keydown", handleKeyDown)
      return () => {
        document.removeEventListener("keydown", handleKeyDown)
      }
    }, [handleKeyDown])
  }

  return {
    icon,
    title,
    subtitle,
    mode,
    handleModeClick,
    handleResetClick,
    handleExportToCSV,
    useKeyboardListener,
  }
}
