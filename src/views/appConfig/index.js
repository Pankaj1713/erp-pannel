import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Drawer,
  InputLabel,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { getApi, postApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { Button, Notification, Select, toast } from "components/ui";
import { AiOutlineSave } from "react-icons/ai";
import { BusinessSvg, MarketPlaceSvg, TimingSvg } from "assets/svg";
import currencyList from "utils/currencyList";
import MarketplaceProfile from "./addEdit/marketPlaceProfile";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "store/auth/userSlice";
import BannerImage from "components/custom/banner";
import { debounce } from "lodash";
import AsyncSelect from "react-select/async";

const BusinessProfileSchema = Yup.object().shape({
  businessName: Yup.string().required("Business Name is required"),
  address: Yup.string().required("Address is required"),
  currency: Yup.mixed().required("Business Currency is required"),
});

const initialValues = {
  businessName: "",
  businessCountry: "",
  businessState: "",
  address: "",
  currency: "",
  file: "",
};

const AppConfigCards = ({ title, subTitle, icon }) => (
  <>
    <CardContent sx={{ fontSize: "400px" }}>
      {icon}
      <Typography sx={{ marginTop: "10px" }} variant="h5" component="div">
        {title}
      </Typography>
      <Typography
        sx={{ marginTop: "10px", fontSize: 14 }}
        color="text.secondary"
        gutterBottom
      >
        {subTitle}
      </Typography>
    </CardContent>
  </>
);

const AppConfig = () => {
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openMarketplaceDrawer, setOpenMarketplaceDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const data = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [countryList, setCountryList] = useState([]);
  const [statesList, setStatesList] = useState([]);

  useEffect(() => {
    if (openDrawer) {
      getData();
    }
  }, [openDrawer]);

  useEffect(() => {
    if (openDrawer) {
      getApi(APIS.GET_APP_COUNTRY, { data: 0 })
        .then((res) => {
          setCountryList(res?.data?.data || []);
        })
        .catch((error) => {
          console.error("Error fetching country list:", error);
        });
    }
  }, [openDrawer]);

  const handleOpenDrawer = () => setOpenDrawer(true);
  const handleCloseDrawer = () => setOpenDrawer(false);
  const handleOpenMarketplaceDrawer = () => setOpenMarketplaceDrawer(true);
  const handleCloseMarketplaceDrawer = () => setOpenMarketplaceDrawer(false);

  const Url = useSelector((state) => state.auth?.session?.imageUrl);

  const loadCountryOption = (inputValue, resolve) => {
    if (!inputValue) {
      resolve(countryList);
      return;
    }

    const filteredCountries = countryList.filter((country) =>
      country.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    resolve(filteredCountries);
  };

  const loadCountry = debounce(loadCountryOption, 300);

  const loadStateOption = (inputValue, resolve) => {
    if (!inputValue) {
      resolve(statesList);
      return;
    }

    const filteredStates = statesList.filter((state) =>
      state.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    resolve(filteredStates);
  };

  const loadState = debounce(loadStateOption, 300);

  useEffect(() => {
    getState();
  }, [editData?.businessCountry]);

  const getState = () => {
    if (editData?.businessCountry) {
      getApi(APIS.GET_APP_COUNTRY, {
        data: 1,
        countryCode: editData.businessCountry.isoCode,
      })
        .then((res) => {
          setStatesList(res.data.data);
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
        });
    }
  };

  const getData = () => {
    getApi(APIS.GET_APP_CONFIG)
      .then((res) => {
        try {
          const editConfig = res?.data?.data[0];

          const editDataObj = {
            businessName: editConfig?.businessName || "",
            address: editConfig?.businessAddress || "",
            businessCountry: editConfig?.businessCountry || "",
            businessState: editConfig?.businessState || "",
            businessLogo: Url + editConfig?.businessLogo[0]?.original || "",
            currency:
              currencyList.find((values) => {
                if (values.sign === editConfig?.globalCurrency) return values;
              }) || "",
            id: editConfig?._id,
          };

          const newLogoData = {
            ...data,
            appConfig: data?.appConfig?.map((it) => ({
              ...it,
              businessName: editConfig?.businessName,
              businessLogo: editConfig?.businessLogo[0]?.original,
            })),
          };
          dispatch(setUser(newLogoData));
          setEditData(editDataObj);
        } catch (error) {
          toast.push(
            <Notification closable type="error" duration={2000}>
              Error fetching Data
            </Notification>
          );
        }
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const formdata = new FormData();
    if (values.file) formdata.append("file", values?.file);

    formdata.append("businessName", values?.businessName);
    formdata.append("businessAddress", values?.address);
    formdata.append("businessCountry", JSON.stringify(values.businessCountry));
    formdata.append("businessState", JSON.stringify(values.businessState));
    formdata.append("globalCurrency", values?.currency.sign);
    formdata.append("currencyName", values?.currency.label);

    if (editData?.id) {
      formdata.append("configId", editData?.id);
    }

    setLoading(true);
    postApi(APIS.ADD_EDIT_BUSINESS_PROFILE, formdata)
      .then(() => {
        const newData = {
          ...data,
          appConfig: data?.appConfig?.map((it) => ({
            _id: it?._id,
            currencyName: values?.currency?.label,
            globalCurrency: values.currency.sign,
          })),
        };
        dispatch(setUser(newData));
        toast.push(
          <Notification type="success">Configuration saved!</Notification>
        );
        handleCloseDrawer();
      })
      .catch((error) => {
        toast.push(
          <Notification type="error">
            Error saving configuration: {error.message}
          </Notification>
        );
      })
      .finally(() => {
        setLoading(false);
        setSubmitting(false);
      });
  };
  return (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      mt={4}
      gap="40px"
      justifyContent="center"
    >
      <Box
        sx={{
          cursor: "pointer",
          width: "350px",
          mb: isMobile ? 2 : 0,
        }}
      >
        <Card
          onClick={() => navigate(`/app/appConfig/edit/${editData?.id}`)}
          variant="outlined"
          sx={{ height: "180px" }}
        >
          <AppConfigCards
            icon={<TimingSvg />}
            title="Timing"
            subTitle="Set your availability, manage bookable resources and online booking
        preferences."
          />
        </Card>
      </Box>
      <Box
        sx={{
          cursor: "pointer",
          width: "350px",
          mb: isMobile ? 2 : 0,
        }}
      >
        <Card
          onClick={handleOpenDrawer}
          variant="outlined"
          sx={{ height: "180px" }}
        >
          <AppConfigCards
            icon={<BusinessSvg />}
            title="Business"
            subTitle=" Customize Business details, manage locations, and client referral
        sources."
          />
        </Card>
      </Box>
      <Box
        sx={{
          cursor: "pointer",
          width: "350px",
          mb: isMobile ? 2 : 0,
        }}
      >
        <Card
          onClick={handleOpenMarketplaceDrawer}
          variant="outlined"
          sx={{ height: "180px" }}
        >
          <AppConfigCards
            icon={<MarketPlaceSvg />}
            title="Marketplace Profile"
            subTitle=" Select Mobile App Theme Color"
          />
        </Card>
      </Box>

      <Drawer anchor="right" open={openDrawer} onClose={handleCloseDrawer}>
        <Box
          sx={{
            width: 400,
            padding: 4,
          }}
        >
          <Typography variant="h6" component="h2" mb={2}>
            Business Profile
          </Typography>
          <Formik
            initialValues={editData || initialValues}
            validationSchema={BusinessProfileSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched, values, setFieldValue }) => {
              return (
                <Form>
                  <Box mb={2}>
                    <Field
                      as={TextField}
                      name="businessName"
                      label="Business Name"
                      fullWidth
                      error={
                        touched.businessName && Boolean(errors.businessName)
                      }
                      helperText={touched.businessName && errors.businessName}
                    />
                  </Box>
                  <Box mb={2}>
                    <Field
                      as={TextField}
                      name="address"
                      label="Address"
                      fullWidth
                      error={touched.address && Boolean(errors.address)}
                      helperText={touched.address && errors.address}
                    />
                  </Box>

                  <Box mb={2}>
                    <InputLabel>Select Country</InputLabel>
                    <Field
                      component={Select}
                      defaultOptions
                      cacheOptions
                      loadOptions={loadCountry}
                      componentAs={AsyncSelect}
                      name="businessCountry"
                      value={values?.businessCountry}
                      onChange={(selectedOption) => {
                        setStatesList([]);

                        setFieldValue("businessCountry", selectedOption);

                        if (selectedOption) {
                          getApi(APIS.GET_APP_COUNTRY, {
                            data: 1,
                            countryCode: selectedOption.isoCode,
                          })
                            .then((res) => {
                              setStatesList(res.data.data);
                              setFieldValue("businessState", "");
                            })
                            .catch((error) => {
                              console.error("Error fetching states:", error);
                            });
                        }
                      }}
                      getOptionLabel={(v) => v?.name}
                      getOptionValue={(v) => v?.isoCode}
                    />
                  </Box>

                  <Box mb={2}>
                    <InputLabel>Select State</InputLabel>
                    <Field
                      component={Select}
                      name="businessState"
                      value={values?.businessState}
                      onChange={(selectedOption) => {
                        setFieldValue("businessState", selectedOption);
                      }}
                      loadOptions={loadState}
                      defaultOptions={statesList}
                      cacheOptions
                      getOptionLabel={(v) => v?.name}
                      getOptionValue={(v) => v?.isoCode}
                      componentAs={AsyncSelect}
                    />
                  </Box>
                  <Box mb={2}>
                    <InputLabel>Select Currency</InputLabel>
                    <Field
                      as="select"
                      value={values.currency}
                      name="currency"
                      component={Select}
                      options={currencyList}
                      onChange={(e) => {
                        setFieldValue("currency", e);
                      }}
                      placeholder="Select Currency"
                    />
                  </Box>
                  <BannerImage
                    {...{
                      touched,
                      title: "Banner Image/Icon",
                      errors,
                      file: editData?.businessLogo || "",
                      values,
                      setFieldValue,
                    }}
                  />

                  <Box display="flex" justifyContent="space-between">
                    <Button
                      type="button"
                      onClick={handleCloseDrawer}
                      color="primary"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="solid"
                      loading={loading}
                      icon={<AiOutlineSave />}
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Submit
                    </Button>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Drawer>

      <MarketplaceProfile
        openDrawer={openMarketplaceDrawer}
        handleCloseDrawer={handleCloseMarketplaceDrawer}
        editData={editData}
      />
    </Box>
  );
};

export default AppConfig;
