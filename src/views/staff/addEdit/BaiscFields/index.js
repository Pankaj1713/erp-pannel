import React, { useState } from "react";
import { FormItem, Input, Select } from "components/ui";
import { Field } from "formik";
import { MuiTelInput } from "mui-tel-input";
import { availableForOptions } from "views/services";
import { roleOptions } from "views/staff";
import BannerImage from "components/custom/banner";

const BasicFields = ({ touched, errors, values, setFieldValue, file }) => {
  const [phoneNumber, setPhoneNumber] = useState();

  const handlePhoneNumberChange = (value, info) => {
    setFieldValue("phoneNumber", value);
    setFieldValue("countryCode", `+${info.countryCallingCode}`);
  };

  return (
    <div className="grid grid-cols-2 gap-x-4">
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
      <FormItem label="Age">
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
        label="Phone Number"
        invalid={errors?.phoneNumber && touched?.phoneNumber}
        errorMessage={errors?.phoneNumber}
      >
        <Field name="phoneNumber">
          {({ field, form }) => (
            <MuiTelInput
              {...field}
              defaultCountry="IN"
              value={values.phoneNumber}
              inputProps={{
                style: { padding: "12px" },
              }}
              onChange={(value, info) => {
                handlePhoneNumberChange(value, info);
                setPhoneNumber(info.nationalNumber);
                form.setFieldValue("phoneNumber", value);
              }}
            />
          )}
        </Field>
      </FormItem>
      <FormItem label="Type of Employee">
        <Field
          as="select"
          value={values.typeOfemployee}
          name="typeOfemployee"
          component={Select}
          options={roleOptions}
          onChange={(e) => {
            setFieldValue("typeOfemployee", e);
          }}
          placeholder="Select Type"
        />
      </FormItem>
      <FormItem
        label="Role Name"
        invalid={errors?.roles && touched?.roles}
        errorMessage={errors?.roles}
      >
        <Field
          type="text"
          autoComplete="off"
          name="roles"
          placeholder="Add Designation of Role"
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
            title: "Staff or Admin Image  Change ",
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

export default BasicFields;
