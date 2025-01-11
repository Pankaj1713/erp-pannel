import React from "react";
import { Dropdown } from "components/ui";
import classNames from "classnames";
import withHeaderItem from "utils/hoc/withHeaderItem";
import TuneIcon from "@mui/icons-material/Tune";
import { Link } from "react-router-dom";

export const Configuration = ({ className }) => {
  const selectedLanguage = (
    <div className={classNames(className, "flex items-center")}>
      <TuneIcon sx={{ color: "#1976d2", fontSize: "20px" }} />
    </div>
  );

  return (
    <Dropdown renderTitle={selectedLanguage} placement='bottom-end'>
      <Dropdown.Item
        eventKey={"Company Setup"}
        key={"Company Setup"}
        className='mb-1'
      >
        <Link className='flex gap-2 items-center' to={"/app/companySetup"}>
          Company Setup
        </Link>
      </Dropdown.Item>
    </Dropdown>
  );
};

export default withHeaderItem(Configuration);
