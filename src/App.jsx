import { Fragment } from "react"
import {
  BackgroundImage,
  CheckInCard,
  FloatActions,
  ModeSwitch,
} from "./components"
import { useCardScanner } from "./hooks/useCardScanner"

import bgImage from "./assets/SOX_SF2026_BG.png"
import soxLogo from "./assets/SOXLogo_landscape_light.png"
import iconLaughing from "./assets/laughing.png"
import iconSad from "./assets/sad.png"
import "./App.scss"

function App() {
  const {
    icon,
    title,
    subtitle,
    mode,
    handleModeClick,
    handleResetClick,
    handleExportToCSV,
    useKeyboardListener,
  } = useCardScanner()

  useKeyboardListener(iconSad, iconLaughing)

  return (
    <Fragment>
      <BackgroundImage src={bgImage} />
      <CheckInCard
        logo={soxLogo}
        icon={icon}
        title={title}
        subtitle={subtitle}
      />
      <ModeSwitch checked={mode === "single"} onChange={handleModeClick} />
      <FloatActions
        mode={mode}
        onModeClick={handleModeClick}
        onResetClick={handleResetClick}
        onExportClick={handleExportToCSV}
      />
    </Fragment>
  )
}

export default App
