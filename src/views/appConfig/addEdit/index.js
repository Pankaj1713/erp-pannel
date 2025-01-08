import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  TableContainer,
  Table,
  TableCell,
  TableBody,
  TableRow,
  Paper,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AiOutlineCloseCircle, AiOutlineSave } from "react-icons/ai";
import { Button, Notification, toast } from "components/ui";
import { useNavigate, useParams } from "react-router-dom";
import { getApi, postApi } from "services/CommonService";
import { daysOptions, openedOptions } from "utils/utils";
import { APIS } from "constants/api.constant";
import { useSelector } from "react-redux";

const initialValues = {
  timings: daysOptions?.map((day) => ({
    day: day.label,
    openingTime: dayjs().set("hour", 10).set("minute", 0),
    closingTime: dayjs().set("hour", 18).set("minute", 0),
    opened: 1,
    showAddIcon: true,
    disabled: false,
  })),
  slotGap: "",
};

const convertMinutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return dayjs().set("hour", hours).set("minute", mins);
};

const AddEditAppConfig = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState();
  const { id } = useParams();

  const currencyData = useSelector((state) => {
    return state?.auth?.user?.appConfig[0];
  });

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  const getData = () => {
    setLoading(true);
    getApi(APIS.GET_APP_CONFIG)
      .then((res) => {
        const apiData = res?.data?.data;

        setData(apiData);
        setEditData({
          timings: apiData?.length
            ? apiData?.[0]?.timings.map((timing) => ({
                ...timing,
                openingTime: convertMinutesToTime(timing.openingTime),
                closingTime: convertMinutesToTime(timing.closingTime),
                day: daysOptions.find(
                  (dayOption) => dayOption.value === timing.day
                )?.label,
              }))
            : daysOptions?.map((day) => ({
                day: day.label,
                openingTime: dayjs().set("hour", 10).set("minute", 0),
                closingTime: dayjs().set("hour", 18).set("minute", 0),
                opened: 1,
                showAddIcon: true,
                disabled: false,
              })),
          slotGap: !!apiData?.length ? apiData?.[0]?.slotGap : "",
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.push(
          <Notification type="error">Failed to fetch data</Notification>
        );
      })
      .finally(() => setLoading(false));
  };

  const validationSchema = Yup.object().shape({
    timings: Yup.array().of(
      Yup.object().shape({
        openingTime: Yup.date().required("Required"),
        closingTime: Yup.date().required("Required"),
        opened: Yup.number().required("Required"),
      })
    ),
    slotGap: Yup.string().required("Required"),
  });

  const handleSubmit = (values) => {
    const transformedValues = values.timings.map((timing) => ({
      day: daysOptions.find((value) => value.label === timing.day)?.value,
      openingTime: timing.openingTime.hour() * 60 + timing.openingTime.minute(),
      closingTime: timing.closingTime.hour() * 60 + timing.closingTime.minute(),
      opened: timing.opened || 0,
    }));

    const payload = {
      slotGap: values.slotGap,
      timings: transformedValues,
    };
    if (data[0]?._id) {
      payload.configId = data[0]?._id;
    }

    setLoading(true);
    postApi(APIS.ADD_EDIT_APP_CONFIG, payload)
      .then(() => {
        toast.push(
          <Notification type="success">Configuration saved!</Notification>
        );
        navigate("/app/appConfig");
      })
      .catch((error) => {
        console.error("Error saving configuration:", error);
        toast.push(
          <Notification type="error">Failed to save configuration</Notification>
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddRow = (index, setFieldValue, values) => {
    const updatedTimings = [...values.timings];

    const newOpeningTime = updatedTimings[index].closingTime;

    // Set showAddIcon to false for the current row to hide the AddIcon
    updatedTimings[index].showAddIcon = false;

    updatedTimings.splice(index + 1, 0, {
      day: values.timings[index].day,
      openingTime: newOpeningTime,
      closingTime: dayjs().set("hour", 18).set("minute", 0),
      opened: 1,
      showAddIcon: true,
      disabled: false,
    });

    setFieldValue("timings", updatedTimings);
  };

  const handleRemoveRow = (index, setFieldValue, values) => {
    const updatedTimings = [...values.timings];
    updatedTimings.splice(index, 1);

    setFieldValue("timings", updatedTimings);
  };

  return (
    <Formik
      initialValues={editData || initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, handleSubmit, errors }) => (
        <Form onSubmit={handleSubmit}>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <div className="md:w-1/2 p-2">
                  <Field
                    as={TextField}
                    name="slotGap"
                    label="Slot Gap (In Mins)"
                    fullWidth
                    variant="outlined"
                  />
                  <ErrorMessage
                    name="slotGap"
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
                {values.timings.map((timing, index) => (
                  <TableRow key={index}>
                    <TableCell>{timing.day}</TableCell>

                    {timing.opened ? (
                      <>
                        <TableCell style={{ minWidth: "140px" }}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              label="Opening Time"
                              value={timing.openingTime}
                              onChange={(newValue) =>
                                setFieldValue(
                                  `timings.${index}.openingTime`,
                                  newValue
                                )
                              }
                            />
                          </LocalizationProvider>
                        </TableCell>
                        <TableCell style={{ minWidth: "140px" }}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              label="Closing Time"
                              value={timing.closingTime}
                              onChange={(newValue) =>
                                setFieldValue(
                                  `timings.${index}.closingTime`,
                                  newValue
                                )
                              }
                            />
                          </LocalizationProvider>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell style={{ minWidth: "140px" }}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              disabled
                              label="Opening Time"
                              value={timing.openingTime}
                              onChange={(newValue) =>
                                setFieldValue(
                                  `timings.${index}.openingTime`,
                                  newValue
                                )
                              }
                            />
                          </LocalizationProvider>
                        </TableCell>
                        <TableCell style={{ minWidth: "140px" }}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              disabled
                              label="Closing Time"
                              value={timing.closingTime}
                              onChange={(newValue) =>
                                setFieldValue(
                                  `timings.${index}.closingTime`,
                                  newValue
                                )
                              }
                            />
                          </LocalizationProvider>
                        </TableCell>
                      </>
                    )}

                    <TableCell>
                      {timing?.day === values?.timings?.[index - 1]?.day || (
                        <Field
                          name={`timings.${index}.opened`}
                          as={Select}
                          displayEmpty
                          fullWidth
                          onChange={(e) => {
                            const openedValue = parseInt(e.target.value, 10);
                            setFieldValue(
                              `timings.${index}.opened`,
                              openedValue
                            );
                            setFieldValue(
                              `timings.${index}.disabled`,
                              openedValue === 0
                            );
                          }}
                        >
                          <MenuItem value="" disabled label="">
                            Select status
                          </MenuItem>
                          {openedOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Field>
                      )}
                      <ErrorMessage
                        name={`timings.${index}.opened`}
                        component="div"
                        style={{ color: "red" }}
                      />
                    </TableCell>
                    <TableCell>
                      {timing?.day === values?.timings?.[index - 1]?.day ? (
                        <RemoveIcon
                          onClick={() =>
                            handleRemoveRow(index, setFieldValue, values)
                          }
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <AddIcon
                          onClick={() =>
                            handleAddRow(index, setFieldValue, values)
                          }
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="md:flex mt-5 items-center">
            <div className="md:w-1/2 p-2 flex justify-end">
              <Button
                size="sm"
                className="ltr:mr-3 rtl:ml-3"
                onClick={() => navigate("/app/appConfig")}
                icon={<AiOutlineCloseCircle />}
                type="button"
              >
                Discard
              </Button>
              <Button
                size="sm"
                variant="solid"
                loading={loading}
                icon={<AiOutlineSave />}
                type="submit"
              >
                {id ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddEditAppConfig;
