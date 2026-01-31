import PropTypes from "prop-types"
import "./BackgroundImage.scss"

const BackgroundImage = ({ src }) => {
  return <img src={src} className="background-image" alt="background" />
}

BackgroundImage.propTypes = {
  src: PropTypes.string.isRequired,
}

export default BackgroundImage
