import PropTypes from "prop-types"
import { Card, Image, Typography } from "antd"
import "./CheckInCard.scss"

const { Title } = Typography

const CheckInCard = ({ logo, icon, title, subtitle }) => {
  return (
    <Card className="check-in-card">
      <Image width={210} src={logo} preview={false} />
      <Title level={3} className="check-in-card__title">
        {title}
      </Title>
      <Image
        width={200}
        height={200}
        src={icon}
        preview={false}
        className={`check-in-card__icon ${icon ? "check-in-card__icon--visible" : ""}`}
      />
      <Title level={5} className="check-in-card__subtitle">
        {subtitle}
      </Title>
    </Card>
  )
}

CheckInCard.propTypes = {
  logo: PropTypes.string.isRequired,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
}

export default CheckInCard
