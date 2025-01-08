import React, { useEffect, useRef, useState } from "react";
import { AdaptableCard } from "components/shared";
import {
  Input,
  FormItem,
  FormContainer,
  Button,
  Select,
  Switcher,
  toast,
  Notification,
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
import { debounce } from "lodash";
import AsyncSelect from "react-select/async";
import { availableForOptions } from "views/services";
import { Grid } from "@mui/material";
import currencyList from "utils/currencyList";

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  price: Yup.number().required("Required"),
  time: Yup.string().required("Required"),
  categoryId: Yup.object().required("Required"),
  availableFor: Yup.object().required("Required"),
});

const ServiceFields = () => {
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [servicesData, setServicesData] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);
  const formRef = useRef();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth.session);
  const Url = useSelector((state) => state.auth?.session?.imageUrl);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getData(id);
    }
  }, [id, search, page, limit]);

  const imageUrl = !!data?.data[0]?.image[0]?.original
    ? `${Url}${data?.data[0]?.image[0]?.original}`
    : "";

  const getData = () => {
    setLoading(true);
    getApi(APIS.GET_SERVICES, { id })
      .then((res) => {
        setData(res?.data);
      })
      .catch((error) => {
        navigate("booking-dashboard");
      })
      .finally(() => setLoading(false));
  };

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

  const loadServiceOptions = debounce(serviceOptions, 300);

  const categoryOptions = (inputValue, resolve) => {
    const params = { pattern: inputValue };
    if (search && search !== "") params.pattern = search;

    getApi(APIS.GET_CATEGORIES, params).then((result) => {
      const filter = result?.data.data?.map((item) => ({
        label: item.category,
        value: item._id,
      }));
      resolve(filter);
    });
  };
  const loadOptions = debounce(categoryOptions, 300);

  const initialValues = {
    name: !!data?.data?.length ? data?.data[0]?.name : "",
    price: !!data?.data?.length ? data?.data[0]?.price : "",
    strikePrice: !!data?.data?.length ? data?.data[0]?.strikePrice : "",
    // currency: !!data?.data?.length
    //   ? currencyList.find((values) => {
    //       if (values.sign === data?.data[0]?.currency) return values;
    //     })
    //   : "",
    time: !!data?.data?.length ? data?.data[0]?.time : "",
    description: !!data?.length ? data[0]?.description : "",
    categoryId: !!data?.data?.length
      ? {
          label: data?.data[0]?.categoryId?.category,
          value: data?.data[0]?.categoryId?._id,
        }
      : "",
    availableFor: !!data?.data?.length
      ? availableForOptions.find((values) => {
          if (values.value === data?.data[0]?.availableFor) return values;
        })
      : "",
    parentKey: !!data?.data?.length
      ? {
          label: data?.data[0]?.parentKey?.name,
          value: data?.data[0]?.parentKey?._id,
        }
      : "",
    file: !!data?.data?.length ? data[0]?.file : "",
    mainService: !!data?.data?.length ? !data?.data[0]?.parentKey : true,
    subService: !!data?.data?.length ? !!data?.data[0]?.parentKey : false,
  };

  const onSubmit = (values) => {
    setLoading(true);
    const formdata = new FormData();

    formdata.append("availableFor", values?.availableFor?.value);
    formdata.append("categoryId", values?.categoryId?.value);
    formdata.append("description", values?.description);
    formdata.append("name", values?.name);
    // formdata.append("currency", values?.currency?.sign);
    formdata.append("price", values?.price);
    formdata.append("strikePrice", values?.strikePrice);
    formdata.append("time", values?.time);

    if (!!values?.parentKey && values?.subService) {
      formdata.append("parentKey", values?.parentKey?.value);
    } else {
      formdata.append("parentKey", "");
    }

    formdata.append("specialists", []);

    if (values?.file) formdata.append("file", values?.file);

    if (id) formdata.append("serviceId", data?.data[0]?.code);

    postApi(APIS.ADD_EDIT_SERVICES, formdata)
      .then(() => {
        toast.push(<Notification type="success">Service saved!</Notification>);
        navigate("/app/service");
      })
      .finally(() => setLoading(false));
  };

  return (
    <AdaptableCard divider>
      <h5>Service Information</h5>
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={SignupSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ errors, touched, handleSubmit, values, setFieldValue }) => {
          return (
            <Form className="p-5">
              <FormContainer>
                <div style={{ display: "flex", columnGap: "10px" }}>
                  <FormItem label="Main Service">
                    <Switcher
                      checked={values?.mainService}
                      onChange={(checked) => {
                        const newValue = !checked;
                        setFieldValue("mainService", newValue);
                        if (newValue) {
                          setFieldValue("subService", false);
                        }
                      }}
                      checkedLabel="Main Service"
                      id="mainService"
                      name="mainService"
                      uncheckedLabel="Main Service"
                    />
                  </FormItem>
                  <FormItem
                    label="Sub Service"
                    invalid={errors?.subService && touched?.subService}
                    errorMessage={errors?.subService}
                  >
                    <Switcher
                      checked={values.subService}
                      onChange={(checked) => {
                        const newValue = !checked;
                        setFieldValue("subService", newValue);
                        if (newValue) {
                          setFieldValue("mainService", false);
                        }
                      }}
                      checkedLabel="Sub Service"
                      uncheckedLabel="Sub Service"
                      id="subService"
                      name="subService"
                    />
                  </FormItem>
                </div>

                <FormItem label="Categories">
                  <AsyncSelectField
                    name="categoryId"
                    loadOptions={loadOptions}
                    defaultValue={values.categoryId}
                    setFieldValue={setFieldValue}
                    onChange={(e) => {
                      setFieldValue("categoryId", e);
                      setSearch(e);
                    }}
                  />
                </FormItem>

                {values.subService && (
                  <FormItem label="Select Parent Service">
                    <ServicesField
                      name="parentKey"
                      loadServiceOptions={loadServiceOptions}
                      defaultValue={values.parentKey}
                      setFieldValue={setFieldValue}
                      onChange={(text) => setSearch(text)}
                    />
                  </FormItem>
                )}

                <FormItem
                  label="Available For"
                  invalid={errors?.availableFor && touched?.availableFor}
                  errorMessage={errors?.availableFor}
                >
                  <Field
                    as="select"
                    value={values.availableFor}
                    name="availableFor"
                    component={Select}
                    options={availableForOptions}
                    onChange={(e) => {
                      setFieldValue("availableFor", e);
                    }}
                    placeholder="Select Availability"
                  />
                </FormItem>

                <FormItem
                  label="Service Name"
                  invalid={errors?.name && touched?.name}
                  errorMessage={errors?.name}
                >
                  <Field
                    type="text"
                    value={values.name}
                    autoComplete="off"
                    name="name"
                    placeholder="Enter Service"
                    component={Input}
                  />
                </FormItem>

                {/* <Grid container spacing={2}> */}
                {/* <Grid item xs={6}> */}
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
                    type="string"
                    autoComplete="off"
                    value={values.time}
                    name="time"
                    placeholder="Enter time"
                    component={Input}
                    onChange={(e) => {
                      const { value } = e.target;
                      const numericValue = value.replace(/[^0-9]/g, "");
                      setFieldValue("time", numericValue);
                    }}
                  />
                </FormItem>

                <FormItem
                  label="Description"
                  invalid={errors?.description && touched?.description}
                  errorMessage={errors?.description}
                >
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

                <FormItem
                  label="File"
                  invalid={errors?.file && touched?.file}
                  errorMessage={errors?.file}
                >
                  <BannerImage
                    touched={touched}
                    title="Services Image"
                    errors={errors}
                    values={values}
                    file={imageUrl || ""}
                    setFieldValue={setFieldValue}
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
          );
        }}
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
      cacheOptions
      defaultOptions
      value={field.value}
      onChange={(selectedOption) => {
        helpers.setValue(selectedOption);
        setFieldValue(name, selectedOption);
      }}
      loadOptions={(inputValue, callback) => loadOptions(inputValue, callback)}
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      defaultValue={defaultValue}
    />
  );
};

const ServicesField = ({
  name,
  loadServiceOptions,
  defaultValue,
  setFieldValue,
}) => {
  const [field, , helpers] = useField(name);

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      value={field.value}
      onChange={(selectedOption) => {
        helpers.setValue(selectedOption);
        setFieldValue(name, selectedOption);
      }}
      loadOptions={(inputValue, callback) =>
        loadServiceOptions(inputValue, callback)
      }
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      defaultValue={defaultValue}
    />
  );
};

export default ServiceFields;
