import React, { useEffect, useRef, useState } from "react";
import { AdaptableCard } from "components/shared";
import {
  Input,
  FormItem,
  FormContainer,
  Button,
  toast,
  Notification,
  Select,
} from "components/ui";
import { AiOutlineCloseCircle, AiOutlineSave } from "react-icons/ai";
import { Formik, Form, Field, useField } from "formik";
import * as Yup from "yup";
import { getApi, postApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import appConfig from "configs/app.config";
import BannerImage from "components/custom/banner";
import AsyncSelect from "react-select/async";
import debounce from "lodash.debounce";
import { Grid } from "@mui/material";
import currencyList from "utils/currencyList";

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  price: Yup.number().required("Required"),
  time: Yup.string().required("Required"),
});

const ActivityFields = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const formRef = useRef();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth.session);
  const { id } = useParams();
  const Url = useSelector((state) => state.auth?.session?.imageUrl);

  useEffect(() => {
    if (id) {
      getData(id);
    }
  }, [id]);

  const getData = (id) => {
    getApi(APIS.GET_PACKAGES, { id })
      .then((res) => {
        const packageData = res?.data?.data[0];
        setData({
          ...res?.data,
          services: packageData.services.map((service) => ({
            label: service.name,
            value: service,
          })),
        });
      })
      .finally(() => setLoading(false));
  };

  const imageUrl = !!data?.data[0]?.image[0]?.original
    ? `${Url}${data?.data[0]?.image[0]?.original}`
    : "";

  const serviceOptions = (inputValue, resolve) => {
    const params = { pattern: inputValue };

    getApi(APIS.GET_SERVICES, params).then((result) => {
      const options = result?.data?.data?.map((item) => ({
        label: item.name,
        value: item._id,
      }));
      resolve(options);
    });
  };

  const loadOptions = debounce(serviceOptions, 300);

  const initialValues = {
    file: imageUrl || "",
    name: data?.data?.[0]?.name || "",
    price: data?.data?.[0]?.price || "",
    strikePrice: data?.data?.[0]?.strikePrice || "",
    // currency: !!data?.data?.length
    //   ? currencyList.find((values) => {
    //       if (values.sign === data?.data[0]?.currency) return values;
    //     })
    //   : "",
    time: data?.data?.[0]?.time || "",
    description: data?.data?.[0]?.description || "",
    services:
      data?.data?.[0]?.services.map((service) => ({
        label: service.name,
        value: service,
      })) || [],
    offers: data?.data?.[0]?.offers || "",
  };

  const onSubmit = (values) => {
    setLoading(true);
    const formdata = new FormData();

    if (values?.file) formdata.append("file", values?.file);
    formdata.append("name", values?.name);
    formdata.append("price", values?.price);
    formdata.append("strikePrice", values?.strikePrice);
    // formdata.append("currency", values?.currency?.sign);
    formdata.append("time", values?.time);
    formdata.append("description", values?.description);
    formdata.append(
      "services",
      values?.services.map((service) => service.value._id)
    );
    formdata.append("offers", values?.offers);

    if (id) formdata.append("packageId", data?.data?.[0]?.code);

    postApi(APIS.ADD_EDIT_PACKAGES, formdata)
      .then(() => {
        toast.push(<Notification type="success">Package saved!</Notification>);
        navigate("/app/packages");
      })
      .finally(() => setLoading(false));
  };

  return (
    <AdaptableCard divider>
      <h5>Package Information</h5>
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={SignupSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({
          errors,
          touched,
          isSubmitting,
          handleSubmit,
          values,
          setFieldValue,
        }) => (
          <Form className="p-5">
            <FormContainer>
              <FormItem
                label="Package Name"
                invalid={errors?.name && touched?.name}
                errorMessage={errors?.name}
              >
                <Field
                  type="text"
                  value={values.name}
                  autoComplete="off"
                  name="name"
                  placeholder="Enter Package Name"
                  component={Input}
                />
              </FormItem>

              <FormItem label="Select Services">
                <AsyncSelectField
                  name="services"
                  loadOptions={loadOptions}
                  defaultValue={values.services}
                  setFieldValue={setFieldValue}
                />
              </FormItem>
              {/* <Grid container spacing={2}>
                <Grid item xs={6}> */}
              <FormItem
                label="Price"
                invalid={errors?.price && touched?.price}
                errorMessage={errors?.price}
              >
                <Field
                  type="string"
                  autoComplete="off"
                  value={values.price}
                  name="price"
                  placeholder="Enter Price"
                  component={Input}
                  onChange={(e) => {
                    const { value } = e.target;
                    const numericValue = value.replace(/[^0-9]/g, "");
                    setFieldValue("price", numericValue);
                  }}
                />
              </FormItem>

              <FormItem
                label="Strike Price"
                invalid={errors?.strikePrice && touched?.strikePrice}
                errorMessage={errors?.strikePrice}
              >
                <Field
                  type="string"
                  autoComplete="off"
                  value={values.strikePrice}
                  name="strikePrice"
                  placeholder="Enter Strike Price"
                  component={Input}
                  onChange={(e) => {
                    const { value } = e.target;
                    const numericValue = value.replace(/[^0-9]/g, "");
                    setFieldValue("strikePrice", numericValue);
                  }}
                />
              </FormItem>
              {/* </Grid> */}
              {/* <Grid item xs={6}>
                  <FormItem label="Select Currency">
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
                  </FormItem>
                </Grid> */}
              {/* </Grid> */}

              <FormItem
                label="Time in minutes"
                invalid={errors?.time && touched?.time}
                errorMessage={errors?.time}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  value={values.time}
                  name="time"
                  placeholder="Enter Time"
                  component={Input}
                  onChange={(e) => {
                    const { value } = e.target;
                    const numericValue = value.replace(/[^0-9]/g, "");
                    setFieldValue("time", numericValue);
                  }}
                />
              </FormItem>

              <FormItem label="Description">
                <Field
                  textArea
                  type="text"
                  autoComplete="off"
                  name="description"
                  value={values.description}
                  placeholder="Enter Description"
                  component={Input}
                />
              </FormItem>

              <FormItem label="Offers">
                <Field
                  type="text"
                  autoComplete="off"
                  name="offers"
                  value={values.offers}
                  placeholder="Enter Offers"
                  component={Input}
                />
              </FormItem>

              <FormItem
                label="File"
                invalid={errors?.file && touched?.file}
                errorMessage={errors?.file}
              >
                <BannerImage
                  {...{
                    touched,
                    title: "Packages Image",
                    errors,
                    values,
                    setFieldValue,
                    file: imageUrl || "",
                  }}
                />
              </FormItem>

              <div className="md:flex items-center">
                <Button
                  size="sm"
                  className="ltr:mr-3 rtl:ml-3"
                  onClick={() => navigate("/app/service")}
                  icon={<AiOutlineCloseCircle />}
                  type="button"
                >
                  Discard
                </Button>
                <Button
                  size="sm"
                  variant="solid"
                  onClick={handleSubmit}
                  loading={loading}
                  icon={<AiOutlineSave />}
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </AdaptableCard>
  );
};

const AsyncSelectField = ({
  name,
  loadOptions,
  defaultValue,
  setFieldValue,
}) => {
  const [field, , helpers] = useField(name);
  return (
    <AsyncSelect
      isMulti
      cacheOptions
      loadOptions={loadOptions}
      defaultOptions
      value={field.value}
      onChange={(selectedOption) => {
        helpers.setValue(selectedOption);
        setFieldValue(name, selectedOption);
      }}
      defaultValue={defaultValue}
    />
  );
};

export default ActivityFields;
