import React, { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import RestoreIcon from "@mui/icons-material/Restore";
import CalculateIcon from "@mui/icons-material/Calculate";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";

import PurchaseHeaderModal from "./PurchaseHeaderModal";

// Reusable Button Component
const ActionButton = ({ Icon, label, onClick }) => (
  <IconButton aria-label={label} className="text-white text-xs" onClick={onClick}>
    <Icon className="text-white" />
    <span className="text-white text-xs ml-2">{label}</span>
  </IconButton>
);

const HeaderPurchase = () => {
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility

  const handleFolder = () => {
    setOpenModal(true); // Open the modal when "Open" button is clicked
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal
  };

  return (
    <header className="flex justify-between items-center p-3" style={{ backgroundColor: "#164e7f" }}>
      {/* Left Section with icons */}
      <div className="flex gap-4">
        <ActionButton Icon={FolderIcon} label="Open" onClick={handleFolder} />
        <ActionButton Icon={DeleteIcon} label="Delete" />
        <ActionButton Icon={ContentCopyIcon} label="Copy" />
        <ActionButton Icon={CloseIcon} label="Cancel" />
        <ActionButton Icon={RestoreIcon} label="Restore" />
      </div>

      {/* Right Section with icons */}
      <div className="flex gap-4">
        <ActionButton Icon={CalculateIcon} label="Calculator" />
        <ActionButton Icon={HelpOutlineIcon} label="Help" />
        <ActionButton Icon={SettingsIcon} label="Configuration" />
      </div>

      {/* Modal Component */}
      {openModal && <PurchaseHeaderModal open={openModal} onClose={handleCloseModal} />}
    </header>
  );
};

export default HeaderPurchase;
