import { DatePicker, FormItem, Input, Select } from "components/ui";
import { APIS } from "constants/api.constant";
import { Field, useField } from "formik";
import debounce from "lodash.debounce";
import React from "react";
import AsyncSelect from "react-select/async";
import { getApi } from "services/CommonService";
import moment from "moment";

const BasicFields = ({
  touched,
  errors,
  values,
  setFieldValue,
  typeOptions,
}) => {
  const loadCustomerOption = (inputValue, resolve) => {
    getApi(APIS.GET_CUSTOMERS, { pattern: inputValue }).then((result) => {
      const options = result?.data?.data?.map((item) => ({
        label: item.name,
        value: item._id,
      }));
      resolve(options);
    });
  };

  const loadCustomer = debounce(loadCustomerOption, 300);

  const loadServiceOption = (inputValue, resolve) => {
    getApi(APIS.GET_SERVICES, { pattern: inputValue }).then((result) => {
      const options = result?.data?.data?.map((item) => ({
        label: item.name,
        value: item._id,
      }));
      resolve(options);
    });
  };

  const loadService = debounce(loadServiceOption, 300);

  const loadPackageOption = (inputValue, resolve) => {
    getApi(APIS.GET_PACKAGES, { pattern: inputValue }).then((result) => {
      const options = result?.data?.data?.map((item) => ({
        label: item.name,
        value: item._id,
      }));
      resolve(options);
    });
  };

  const loadPackage = debounce(loadPackageOption, 300);

  return (
    <div className="grid grid-cols-2 gap-x-4">
      <FormItem
        label="Coupon Code"
        invalid={errors?.couponCode && touched?.couponCode}
        errorMessage={errors?.couponCode}
      >
        <Field
          type="text"
          autoComplete="off"
          name="couponCode"
          placeholder="Coupon Code"
          component={Input}
        />
      </FormItem>
      <FormItem
        label="Type"
        invalid={errors?.type && touched?.type}
        errorMessage={errors?.type}
      >
        <Field
          name="offType"
          placeholder="Select Type"
          component={Select}
          options={typeOptions}
          value={values?.offType}
          onChange={(event) => setFieldValue("offType", event)}
        />
      </FormItem>
      <FormItem
        label="Coupon Amount"
        invalid={errors?.couponAmount && touched?.couponAmount}
        errorMessage={errors?.couponAmount}
      >
        <Field
          type="number"
          min="0"
          onWheel={(e) => e.target.blur()}
          autoComplete="off"
          name="couponAmount"
          placeholder="Coupon Amount"
          component={Input}
        />
      </FormItem>
      <FormItem
        label="Select Customer Specific"
        invalid={errors?.specificCustomer && touched?.specificCustomer}
        errorMessage={errors?.specificCustomer}
      >
        <AsyncSelectField
          name="specificCustomer"
          loadOptions={loadCustomer}
          defaultValue={values.specificCustomer}
          setFieldValue={setFieldValue}
        />
      </FormItem>
      <FormItem
        label="Select Service Specific"
        invalid={errors?.specificService && touched?.specificService}
        errorMessage={errors?.specificService}
      >
        <AsyncSelectField
          name="specificService"
          loadOptions={loadService}
          defaultValue={values.specificService}
          setFieldValue={setFieldValue}
        />
      </FormItem>
      <FormItem
        label="Select Package Specific"
        invalid={errors?.specificPackage && touched?.specificPackage}
        errorMessage={errors?.specificPackage}
      >
        <AsyncSelectField
          name="specificPackage"
          loadOptions={loadPackage}
          defaultValue={values.specificPackage}
          setFieldValue={setFieldValue}
        />
      </FormItem>
      <FormItem label="Coupon Limit Count">
        <Field
          type="number"
          min="0"
          onWheel={(e) => e.target.blur()}
          autoComplete="off"
          name="limitCount"
          placeholder="Limit Count"
          component={Input}
        />
      </FormItem>

      <FormItem
        label="Minimum Order Amount"
        invalid={errors?.minimumAmount && touched?.minimumAmount}
        errorMessage={errors?.minimumAmount}
      >
        <Field
          type="number"
          min="0"
          onWheel={(e) => e.target.blur()}
          autoComplete="off"
          name="minimumAmount"
          placeholder="Minimum Amount"
          component={Input}
        />
      </FormItem>
      <FormItem label="User Limit Count">
        <Field
          type="number"
          min="0"
          onWheel={(e) => e.target.blur()}
          autoComplete="off"
          name="userLimitCount"
          placeholder="User Limit Count"
          component={Input}
        />
      </FormItem>
      <FormItem
        label="Start Date"
        invalid={errors?.startDate && touched?.startDate}
        errorMessage={errors?.startDate}
      >
        <Field
          component={DatePicker}
          name="startDate"
          value={values?.startDate ? moment(values?.startDate).toDate() : null}
          placeholder="Select Start Date"
          onChange={(date) =>
            setFieldValue(
              "startDate",
              date ? moment(date).format("YYYY-MM-DD") : ""
            )
          }
        />
      </FormItem>
      <FormItem
        label="End Date"
        invalid={errors?.endDate && touched?.endDate}
        errorMessage={errors?.endDate}
      >
        <Field
          component={DatePicker}
          name="endDate"
          value={values?.endDate ? moment(values?.endDate).toDate() : null}
          placeholder="Select End Date"
          onChange={(date) =>
            setFieldValue(
              "endDate",
              date ? moment(date).format("YYYY-MM-DD") : ""
            )
          }
        />
      </FormItem>
    </div>
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

export default BasicFields;
