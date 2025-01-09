import React, { useState, useRef } from "react";
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  TextField,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AddIcon from "@mui/icons-material/Add";

const stores = [
  { id: "0002", name: "Bhopal Store" },
  { id: "0001", name: "Sironj" },
  { id: "0003", name: "Vidisha Store" },
];

export default function SplitSelect() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState("Sironj");
  const anchorRef = useRef(null);

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleMenuItemClick = (store) => {
    setSelectedStore(store.name);
    setOpen(false);
  };

  const handleClear = () => {
    setSelectedStore("");
    setOpen(false);
  };

  return (
    <Box sx={{ p: 0, width: "100%" }}>
      {/* ButtonGroup with the selected store */}
      <ButtonGroup
        ref={anchorRef}
        variant='outlined'
        aria-label='store selector'
        sx={{
          width: "100%",
          justifyContent: "space-between",
          border: "1px solid #ccc",
          backgroundColor: "#fff",
          "& .MuiButton-root": {
            flex: 1,
            justifyContent: "space-between",
            textTransform: "none",
          },
        }}
      >
        <Button
          onClick={handleToggle}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "4px 12px",
          }}
        >
          <span>{selectedStore}</span>
          <ArrowDropDownIcon sx={{ fontSize: 18 }} />
        </Button>
      </ButtonGroup>

      {/* Popper for the dropdown */}
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        placement='bottom-start'
        disablePortal
        sx={{ zIndex: 2000 }}
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: "top left",
            }}
          >
            <Paper
              sx={{
                width: 300,
                mt: 1,
                border: "1px solid #1976d2",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Box>
                  <Box
                    sx={{
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "#fff",
                        width: "30px",
                        height: "30px",
                        borderRadius: "4px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mr: 1,
                      }}
                    >
                      <AddIcon sx={{ color: "#1976d2" }} />
                    </Box>
                  </Box>

                  {/* Search Input */}
                  <Box sx={{ p: 0.5 }}>
                    <TextField
                      placeholder='Search'
                      variant='outlined'
                      fullWidth
                      size='small'
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                    />
                  </Box>

                  {/* Store List */}
                  <List
                    sx={{
                      maxHeight: 200,
                      overflowY: "auto",
                      borderTop: "1px solid #ddd",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {filteredStores.map((store) => (
                      <ListItem
                        key={store.id}
                        button
                        selected={selectedStore === store.name}
                        onClick={() => handleMenuItemClick(store)}
                        sx={{
                          "&.Mui-selected": {
                            backgroundColor: "#e3f2fd",
                            "&:hover": {
                              backgroundColor: "#bbdefb",
                            },
                          },
                          "&:hover": {
                            backgroundColor: "#f5f5f5",
                          },
                          py: 0,
                        }}
                      >
                        <ListItemText secondary={store.id} />
                        <ListItemText secondary={store.name} />
                      </ListItem>
                    ))}
                  </List>

                  {/* Action Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 2,
                      backgroundColor: "#f9f9f9", // Button container background
                    }}
                  >
                    <Button
                      variant='outlined'
                      onClick={handleClose}
                      sx={{
                        width: "48%",
                        color: "#1976d2",
                        borderColor: "#1976d2",
                        "&:hover": {
                          backgroundColor: "#e3f2fd",
                        },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant='contained'
                      onClick={handleClear}
                      sx={{
                        width: "48%",
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#115293",
                        },
                      }}
                    >
                      Clear
                    </Button>
                  </Box>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}
