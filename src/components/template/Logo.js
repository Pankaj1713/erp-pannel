import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { APP_NAME } from "constants/app.constant";

const Logo = (props) => {
  const {
    type,
    mode,
    gutter,
    className,
    imgClass,
    style,
    logoWidth,
    imgHeight = 100,
    imgWidth = 100,
  } = props;

  const imageUrl = useSelector(
    (state) =>
      state.auth.user?.s3BucketBaseUrl +
      state?.auth?.user?.appConfig?.[0]?.businessLogo
  );

  return (
    <div
      className={classNames("logo", className, gutter)}
      style={{
        ...style,
        ...{ width: logoWidth },
      }}
    >
      <img
        className={imgClass}
        src={imageUrl}
        alt={`${APP_NAME} logo`}
        style={{ width: imgWidth, height: imgHeight, borderRadius: "100%" }}
      />
    </div>
  );
};

Logo.defaultProps = {
  mode: "light",
  type: "full",
  logoWidth: "auto",
};

Logo.propTypes = {
  mode: PropTypes.oneOf(["light", "dark"]),
  type: PropTypes.oneOf(["full", "streamline"]),
  gutter: PropTypes.string,
  imgClass: PropTypes.string,
  logoWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Logo;
