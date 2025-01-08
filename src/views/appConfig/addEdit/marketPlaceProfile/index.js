import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Box, Drawer, TextField, Typography, InputLabel } from "@mui/material";
import { Button, FormItem, Notification, toast } from "components/ui";
import { AiOutlineSave } from "react-icons/ai";
import { randomColors } from "utils/utils";
import { getApi, postApi } from "services/CommonService";
import { APIS } from "constants/api.constant";

const MarketplaceProfileSchema = Yup.object().shape({
  color: Yup.string().required("Color is required"),
});

const MarketplaceProfile = ({ openDrawer, handleCloseDrawer }) => {
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const [randomColor, setRandomColor] = useState();

  useEffect(() => {
    if (openDrawer) {
      const res = randomColors();
      if (res) {
        setRandomColor(res);
      }
      getData();
    }
  }, [openDrawer]);

  const initialValues = {
    color: editData?.applicationColorCode || randomColor,
  };

  const getData = () => {
    setLoading(true);
    getApi(APIS.GET_APP_CONFIG)
      .then((res) => {
        const editConfig = res?.data?.data[0];
        setEditData(editConfig);
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const params = {
      applicationColorCode: values?.color,
      configId: editData?._id,
    };

    setLoading(true);
    postApi(APIS.ADD_EDIT_APP_CONFIG, params)
      .then(() => {
        toast.push(<Notification type="success">Color saved!</Notification>);
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
    <Drawer anchor="right" open={openDrawer} onClose={handleCloseDrawer}>
      <Box
        sx={{
          width: 400,
          padding: 4,
        }}
      >
        <Typography variant="h6" component="h2" mb={2}>
          Marketplace Profile
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={MarketplaceProfileSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, errors, touched, values, setFieldValue }) => (
            <Form>
              <Box mb={2}>
                <Field
                  as={TextField}
                  name="color"
                  label="Select Mobile App Theme Color"
                  fullWidth
                  value={values.color}
                  error={touched.color && Boolean(errors.color)}
                  helperText={touched.color && errors.color}
                />
              </Box>

              <Box mb={2}>
                <InputLabel>Select Color</InputLabel>
                <input
                  type="color"
                  name="color"
                  value={values.color}
                  onChange={(e) => {
                    setFieldValue("color", e.target.value);
                  }}
                />
              </Box>

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
          )}
        </Formik>
      </Box>
    </Drawer>
  );
};

export default MarketplaceProfile;
