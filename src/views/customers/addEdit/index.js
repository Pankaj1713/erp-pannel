import React, { useEffect, useRef, useState } from "react";
import { AdaptableCard } from "components/shared";
import {
  Button,
  Drawer,
  FormItem,
  FormContainer,
  toast,
  Notification,
  Select,
  Input,
} from "components/ui";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { getApi, postApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { AiOutlineSave, AiOutlineCloseCircle } from "react-icons/ai";
import { MuiTelInput } from "mui-tel-input";
import { availableForOptions } from "views/services";
import BannerImage from "components/custom/banner";
import { useSelector } from "react-redux";

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().required("Required").email("Invalid email"),
  phoneNumber: Yup.string().required("Required"),
  age: Yup.number()
    .required("Required")
    .max(100, "Must be less than or equal to 100 years old"),
  houseNumber: Yup.string().when("address", {
    is: (address) => !!address,
    then: Yup.string().required("Required"),
  }),
  pinCode: Yup.string().when("address", {
    is: (address) => !!address,
    then: Yup.string().required("Required"),
  }),
});

const DrawerFooter = ({ editData, onCancel, onSave, isLoading }) => {
  return (
    <div className="text-right w-full">
      <Button
        className="mr-2"
        onClick={onCancel}
        disabled={isLoading}
        icon={<AiOutlineCloseCircle />}
      >
        Cancel
      </Button>
      <Button
        variant="solid"
        type="submit"
        onClick={onSave}
        disabled={isLoading}
        icon={<AiOutlineSave />}
      >
        {editData?._id ? "Update" : "Save"}
      </Button>
    </div>
  );
};

const BasicFields = ({
  touched,
  errors,
  values,
  setFieldValue,
  file,
  editData,
}) => {
  const [image, setImage] = useState();
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  useEffect(() => {
    getApi(APIS.GET_APP_COUNTRY, { data: 1 })
      .then((res) => {
        setStateList(res?.data?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching country list:", error);
      });
  }, []);

  useEffect(() => {
    if (values?.state?.isoCode) {
      getApi(APIS.GET_APP_COUNTRY, {
        data: 2,
        stateCode: values?.state?.isoCode,
      })
        .then((res) => {
          setCityList(res.data.data);
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
        });
    }
  }, [values?.state?.isoCode]);

  const ImageHandler = (e) => {
    setImage(URL.createObjectURL(e[0]));
  };

  const handlePhoneNumberChange = (newValue, info) => {
    setFieldValue("phoneNumber", newValue);
    setFieldValue("countryCode", `+${info.countryCallingCode}`);
  };

  return (
    <div className="">
      <FormItem
        label="Name"
        invalid={errors?.name && touched?.name}
        errorMessage={errors?.name}
      >
        <Field
          type="text"
          autoComplete="off"
          name="name"
          placeholder="Name"
          component={Input}
        />
      </FormItem>
      <FormItem
        label="Phone Number"
        invalid={errors?.phoneNumber && touched?.phoneNumber}
        errorMessage={errors?.phoneNumber}
      >
        <MuiTelInput
          defaultCountry="IN"
          value={values.phoneNumber}
          onChange={handlePhoneNumberChange}
          inputProps={{
            style: { padding: "12px", width: "300px", height: "23px" },
          }}
        />
      </FormItem>
      <FormItem
        label="Email"
        invalid={errors?.email && touched?.email}
        errorMessage={errors?.email}
      >
        <Field
          type="email"
          autoComplete="off"
          name="email"
          placeholder="Email"
          component={Input}
        />
      </FormItem>

      <FormItem
        label="Age"
        invalid={errors?.age && touched?.age}
        errorMessage={errors?.age}
      >
        <Field
          type="text"
          autoComplete="off"
          name="age"
          placeholder="Age"
          component={Input}
          onChange={(e) => {
            const { value } = e.target;
            const numericValue = value.replace(/[^0-9]/g, "");
            setFieldValue("age", numericValue);
          }}
        />
      </FormItem>
      <FormItem
        label="Select Gender"
        invalid={errors?.gender && touched?.gender}
        errorMessage={errors?.gender}
      >
        <Field
          as="select"
          value={values.gender}
          name="gender"
          component={Select}
          options={availableForOptions}
          onChange={(e) => {
            setFieldValue("gender", e);
          }}
          placeholder="Select Gender"
        />
      </FormItem>

      {editData?.address && (
        <>
          <FormItem
            label="House Number"
            invalid={errors?.houseNumber && touched?.houseNumber}
            errorMessage={errors?.houseNumber}
          >
            <Field
              type="text"
              autoComplete="off"
              name="houseNumber"
              placeholder="House Number"
              component={Input}
            />
          </FormItem>
          <FormItem
            label="Address Line"
            invalid={errors?.addressLine && touched?.addressLine}
            errorMessage={errors?.addressLine}
          >
            <Field
              type="text"
              autoComplete="off"
              name="addressLine"
              placeholder="House Number"
              component={Input}
            />
          </FormItem>
          <FormItem
            label="State"
            invalid={errors?.state?.name && touched?.state?.name}
            errorMessage={errors?.state?.name}
          >
            <Field
              component={Select}
              options={stateList}
              type="text"
              autoComplete="off"
              placeholder="Enter State"
              name="state"
              value={values?.state}
              getOptionLabel={(v) => v?.name}
              getOptionValue={(v) => v?.isoCode}
              onChange={(e) => {
                setFieldValue("state", e);
              }}
            />
          </FormItem>
          <FormItem
            label="City"
            invalid={errors?.city?.name && touched?.city?.name}
            errorMessage={errors?.city?.name}
          >
            <Field
              component={Select}
              options={cityList}
              type="text"
              autoComplete="off"
              placeholder="Enter City"
              name="city"
              value={values?.city}
              getOptionLabel={(v) => v?.name}
              getOptionValue={(v) => v?.name}
              onChange={(e) => {
                setFieldValue("city", e);
              }}
            />
          </FormItem>

          <FormItem
            label="Pin Code"
            invalid={errors?.pinCode && touched?.pinCode}
            errorMessage={errors?.pinCode}
          >
            <Field
              type="text"
              autoComplete="off"
              name="pinCode"
              placeholder="Pin Code"
              component={Input}
            />
          </FormItem>
        </>
      )}

      <FormItem
        label="File"
        invalid={errors?.file && touched?.file}
        errorMessage={errors?.file}
      >
        <BannerImage
          {...{
            touched,
            title: "Customers Image",
            errors,
            values,
            file,
            setFieldValue,
          }}
        />
      </FormItem>
    </div>
  );
};

const AddEditCustomers = ({ editData, show, onClose, setRefresh }) => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const url = useSelector((state) => state.auth?.session?.imageUrl);

  const imageUrl = editData?.image?.length
    ? `${url}${editData?.image[0]?.original}`
    : "";

  const initialValues = {
    name: editData?.name || "",
    age: editData?.age || "",
    gender:
      availableForOptions.find((option) => option.value === editData?.gender) ||
      availableForOptions[1],
    email: editData?.email || "",
    countryCode: editData?.countryCode || "",
    phoneNumber: editData?.countryCode
      ? editData.countryCode + editData.phoneNumber
      : "",
    file: imageUrl,
    state: editData?.address?.state || {},
    city: editData?.address?.city || {},
    addressLine: editData?.address?.addressLine || "",
    houseNumber: editData?.address?.houseNumber || "",
    pinCode: editData?.address?.pinCode || "",
  };

  const onSubmit = ({ _id, ...data }) => {
    setLoading(true);
    const payload = new FormData();
    payload.append("name", data?.name);
    payload.append("age", data?.age);
    payload.append("gender", data?.gender?.value);
    payload.append("email", data?.email);
    payload.append("countryCode", data?.countryCode);

    let address = {};

    if (data?.city) {
      address.city = data?.city;
    }

    if (data?.state) {
      address.state = data?.state;
    }

    if (data?.houseNumber) {
      address.houseNumber = data.houseNumber;
    }

    if (data?.pinCode) {
      address.pinCode = data.pinCode;
    }

    if (data?.addressLine) {
      address.addressLine = data.addressLine;
    }

    payload.append("address", JSON.stringify(address));

    if (data.phoneNumber) {
      payload.append(
        "phoneNumber",
        data.phoneNumber.substring(data.countryCode.length).replace(/\s/g, "")
      );
    }
    if (data.file) {
      payload.append("file", data.file);
    }
    if (editData && editData._id) {
      payload.append("customerId", editData?.code);
    }

    postApi(APIS.ADD_EDIT_CUSTOMERS, payload)
      .then(() => {
        onClose();
        setRefresh((r) => !r);
        toast.push(<Notification type="success">Customer saved!</Notification>);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Drawer
      isOpen={show}
      onClose={onClose}
      onRequestClose={onClose}
      closable={false}
      bodyClass="p-0"
      title={editData?._id ? "Edit Customer" : "Add Customer"}
      footer={
        <DrawerFooter
          onCancel={onClose}
          onSave={() => formRef?.current?.submitForm()}
          isLoading={loading}
          editData={editData}
        />
      }
    >
      <AdaptableCard>
        <Formik
          innerRef={formRef}
          initialValues={initialValues}
          validationSchema={SignupSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="p-5">
              <FormContainer>
                <BasicFields
                  touched={touched}
                  errors={errors}
                  values={values}
                  setFieldValue={setFieldValue}
                  file={imageUrl}
                  editData={editData}
                />
              </FormContainer>
            </Form>
          )}
        </Formik>
      </AdaptableCard>
    </Drawer>
  );
};

export default AddEditCustomers;
