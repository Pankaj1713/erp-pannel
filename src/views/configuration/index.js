import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  ListAlt,
  Settings,
  ShoppingCart,
  Inventory,
  AttachMoney,
  IntegrationInstructions,
} from "@mui/icons-material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function Configuration() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Left Tabs */}
      <Tabs
        orientation='vertical'
        variant='scrollable'
        value={value}
        onChange={handleChange}
        aria-label='Vertical tabs example'
        sx={{
          backgroundColor: "#1565c0",
          color: "#fff",
          width: "250px",
          "& .MuiTab-root": {
            justifyContent: "flex-start",
            padding: "10px 10px",
            color: "#fff",
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          },
          "& .Mui-selected": {
            backgroundColor: "#0d47a1",
            fontWeight: "bold",
          },
          "& .MuiTabs-indicator": {
            width: "4px",
            backgroundColor: "#ffcc00",
          },
        }}
      >
        <Tab
          iconPosition='start'
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                textAlign: "left",
              }}
            >
              <ListAlt sx={{ fontSize: "24px", color: "#fff" }} />
              <Box>
                <Typography
                  variant='body1'
                  sx={{ fontWeight: "bold", color: "#fff" }}
                >
                  Basic
                </Typography>
                <Typography variant='body2' sx={{ color: "#bbdefb" }}>
                  Company Name, Address and Info
                </Typography>
              </Box>
            </Box>
          }
          {...a11yProps(0)}
        />
        <Tab
          iconPosition='start'
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                textAlign: "left",
              }}
            >
              <Settings sx={{ fontSize: "24px", color: "#fff" }} />
              <Box>
                <Typography
                  variant='body1'
                  sx={{ fontWeight: "bold", color: "#fff" }}
                >
                  General Setup
                </Typography>
                <Typography variant='body2' sx={{ color: "#bbdefb" }}>
                  Currency, Location, Preferences
                </Typography>
              </Box>
            </Box>
          }
          {...a11yProps(1)}
        />
        <Tab
          iconPosition='start'
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                textAlign: "left",
              }}
            >
              <ShoppingCart sx={{ fontSize: "24px", color: "#fff" }} />
              <Box>
                <Typography
                  variant='body1'
                  sx={{ fontWeight: "bold", color: "#fff" }}
                >
                  Sales Setup
                </Typography>
                <Typography variant='body2' sx={{ color: "#bbdefb" }}>
                  Billing Configuration
                </Typography>
              </Box>
            </Box>
          }
          {...a11yProps(2)}
        />
        <Tab
          iconPosition='start'
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                textAlign: "left",
              }}
            >
              <Inventory sx={{ fontSize: "24px", color: "#fff" }} />
              <Box>
                <Typography
                  variant='body1'
                  sx={{ fontWeight: "bold", color: "#fff" }}
                >
                  Purchase Setup
                </Typography>
                <Typography variant='body2' sx={{ color: "#bbdefb" }}>
                  Billing Preferences
                </Typography>
              </Box>
            </Box>
          }
          {...a11yProps(3)}
        />
        <Tab
          iconPosition='start'
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                textAlign: "left",
              }}
            >
              <Inventory sx={{ fontSize: "24px", color: "#fff" }} />
              <Box>
                <Typography
                  variant='body1'
                  sx={{ fontWeight: "bold", color: "#fff" }}
                >
                  Inventory
                </Typography>
                <Typography variant='body2' sx={{ color: "#bbdefb" }}>
                  Item Preferences
                </Typography>
              </Box>
            </Box>
          }
          {...a11yProps(4)}
        />
        <Tab
          iconPosition='start'
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                textAlign: "left",
              }}
            >
              <AttachMoney sx={{ fontSize: "24px", color: "#fff" }} />
              <Box>
                <Typography
                  variant='body1'
                  sx={{ fontWeight: "bold", color: "#fff" }}
                >
                  Finance
                </Typography>
                <Typography variant='body2' sx={{ color: "#bbdefb" }}>
                  Tax and COA Settings
                </Typography>
              </Box>
            </Box>
          }
          {...a11yProps(5)}
        />
        <Tab
          iconPosition='start'
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                textAlign: "left",
              }}
            >
              <IntegrationInstructions
                sx={{ fontSize: "24px", color: "#fff" }}
              />
              <Box>
                <Typography
                  variant='body1'
                  sx={{ fontWeight: "bold", color: "#fff" }}
                >
                  Integration
                </Typography>
                <Typography variant='body2' sx={{ color: "#bbdefb" }}>
                  Integration with Banks
                </Typography>
              </Box>
            </Box>
          }
          {...a11yProps(6)}
        />
      </Tabs>

      {/* Right Content */}
      <Box sx={{ flexGrow: 1, bgcolor: "#fff", p: 2 }}>
        <TabPanel value={value} index={0}>
          <Typography variant='h6' sx={{ fontWeight: "bold", mb: 2 }}>
            Basic
          </Typography>
          <Typography variant='body2'>
            This is the content for the <strong>Basic</strong> tab.
          </Typography>
        </TabPanel>
        <TabPanel value={value} index={1}>
          General Setup Content
        </TabPanel>
        <TabPanel value={value} index={2}>
          Sales Setup Content
        </TabPanel>
        <TabPanel value={value} index={3}>
          Purchase Setup Content
        </TabPanel>
        <TabPanel value={value} index={4}>
          Inventory Content
        </TabPanel>
        <TabPanel value={value} index={5}>
          Finance Content
        </TabPanel>
        <TabPanel value={value} index={6}>
          Integration Content
        </TabPanel>
      </Box>
    </Box>
  );
}
