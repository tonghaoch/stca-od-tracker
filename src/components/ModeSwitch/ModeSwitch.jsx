import PropTypes from "prop-types"
import { Switch } from "antd"
import "./ModeSwitch.scss"

const ModeSwitch = ({ checked, onChange }) => {
  return (
    <Switch
      checkedChildren="单次"
      unCheckedChildren="双次"
      checked={checked}
      className="mode-switch"
      onChange={onChange}
    />
  )
}

ModeSwitch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default ModeSwitch
