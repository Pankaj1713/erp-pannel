import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

const PurchaseHeaderModal = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth={false}  
      sx={{
        '& .MuiDialogTitle-root': {
          backgroundColor: "#164e7f", 
          color: 'white', 
          padding: '12px 16px', 
        },
        '& .MuiDialogContent-root': {
          padding: '16px', 
          fontSize: '14px', 
        },
        '& .MuiDialogActions-root': {
          padding: '8px 16px', 
          justifyContent: 'center', 
        },
        '& .MuiButton-root': {
          textTransform: 'capitalize', 
          fontSize: '14px', 
          backgroundColor: '#164e7f', 
          color: 'white',
          width: '120px', 
          margin: '0 8px', 
          '&:hover': {
            backgroundColor: '#164e7f', 
            transform: 'scale(1.05)', 
            transition: 'transform 0.3s ease',
          },
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" className="text-white">Confirm</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Do you want to discard current changes?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Yes</Button>
        <Button onClick={onClose}>No</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseHeaderModal;
