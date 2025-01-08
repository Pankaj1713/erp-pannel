import React, { useState } from "react";
import { Button, Dialog, Notification, toast } from "components/ui";
import { HiOutlineLockOpen, HiOutlineLockClosed } from "react-icons/hi";
import { APIS } from "constants/api.constant";
import appConfig from "configs/app.config";
import { useSelector } from "react-redux";

const StatusDialogBox = ({
  name,
  num,
  setRefresh,
  row,
  id,
  blockStatusEnum,
  status,
}) => {
  const [dialogIsOpen, setIsOpen] = useState(false);

  const { token } = useSelector((state) => state.auth.session);

  //// HANDLER FOR OPEN DIALOG BOX /////
  const openDialog = () => {
    setIsOpen(true);
  };

  ///// HANDLER FOR CLOSE DIALOG BOX /////
  const onDialogClose = (e) => {
    setIsOpen(false);
  };
  //// HANDLER FOR CHANGE STATUS FROM LIST ////
  const onChangeStatus = async (e, name) => {
    const url = `${appConfig.apiBaseUrl}${APIS.STATUS_DATA}/${blockStatusEnum}/${id}`;

    let payload = {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    };

    fetch(url, payload)
      .then((res) => res?.json())
      .then((response) => {
        setRefresh((prev) => !prev);
        toast.push(
          <Notification type="success">{name} Status Changed!</Notification>
        );
      })
      .finally(() => setIsOpen(false));
  };

  ///// RETURN ///////
  return (
    <div>
      {status === 1 ? (
        <HiOutlineLockOpen onClick={openDialog} style={{ color: "green" }} />
      ) : (
        <HiOutlineLockClosed onClick={openDialog} style={{ color: "red" }} />
      )}
      <Dialog
        isOpen={dialogIsOpen}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
      >
        <h5 className="mb-4">Change active status of {name}</h5>
        <p>
          Are you sure you want to change the status of this{" "}
          {name?.toLowerCase()}?
        </p>
        <div className="text-right mt-6">
          <Button
            size="sm"
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={onDialogClose}
          >
            No
          </Button>
          <Button
            variant="twoTone"
            size="sm"
            color="red-600"
            onClick={(e) => {
              onChangeStatus(e, name);
            }}
          >
            Yes
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default StatusDialogBox;
