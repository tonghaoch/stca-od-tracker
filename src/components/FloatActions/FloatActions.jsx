import PropTypes from "prop-types"
import { FloatButton } from "antd"
import {
  SettingOutlined,
  ReloadOutlined,
  PrinterOutlined,
  UsergroupAddOutlined,
  UserAddOutlined,
} from "@ant-design/icons"
import "./FloatActions.scss"

const FloatActions = ({ mode, onModeClick, onResetClick, onExportClick }) => {
  return (
    <FloatButton.Group
      trigger="hover"
      type="primary"
      className="float-actions"
      icon={<SettingOutlined />}
    >
      <FloatButton
        icon={mode === "single" ? <UserAddOutlined /> : <UsergroupAddOutlined />}
        onClick={onModeClick}
      />
      <FloatButton icon={<ReloadOutlined />} onClick={onResetClick} />
      <FloatButton icon={<PrinterOutlined />} onClick={onExportClick} />
    </FloatButton.Group>
  )
}

FloatActions.propTypes = {
  mode: PropTypes.oneOf(["single", "dual"]).isRequired,
  onModeClick: PropTypes.func.isRequired,
  onResetClick: PropTypes.func.isRequired,
  onExportClick: PropTypes.func.isRequired,
}

export default FloatActions
