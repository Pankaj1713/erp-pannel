import { FormItem, Select } from "components/ui";
import { APIS, GET_CATEGORIES_TYPE } from "constants/api.constant";
import { Field } from "formik";
import React, { useEffect, useState } from "react";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { getApi } from "services/CommonService";

const TaxIdSelect = ({ touched, errors, values, setFieldValue }) => {
  const [listTaxes, setListTaxes] = useState();
  useEffect(() => {
    getApi(APIS.GET_CATEGORIES, { type: GET_CATEGORIES_TYPE.TAXATION }).then(
      (res) => {
        setListTaxes(res?.data?.data);
      }
    );
  }, []);

  return (
    <div>
      <FormItem
        label="Select Tax"
        invalid={errors?.taxId && touched?.taxId}
        errorMessage={errors?.taxId}
      >
        <Field
          component={Select}
          name="taxId"
          value={listTaxes?.filter((Tax) => Tax?._id === values?.taxId)}
          onChange={(e) => setFieldValue("taxId", e?._id)}
          placeholder="Select Tax"
          options={listTaxes}
          getOptionLabel={(v) => `${v?.name} - ${v?.gst}  `}
          getOptionValue={(v) => v?._id}
        />
      </FormItem>
    </div>
  );
};

export default TaxIdSelect;
