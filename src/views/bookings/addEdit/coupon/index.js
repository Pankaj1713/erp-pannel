import { AdaptableCard } from "components/shared";
import { FormItem, Select } from "components/ui";
import { APIS } from "constants/api.constant";
import { Field } from "formik";
import React, { useCallback } from "react";
import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";
import { getApi } from "services/CommonService";
import { statusDisabled } from "utils/helpers";

const Coupon = ({
  touched,
  errors,
  values,
  setFieldValue,
  setTaxes,
  onDiscountPress = undefined,
}) => {
  const loadCouponOption = async (inputValue, resolve) => {
    try {
      const result = await getApi(APIS.GET_DISCOUNTS, { pattern: inputValue });
      resolve(result?.data?.data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      resolve([]);
    }
  };

  const loadCoupon = debounce(loadCouponOption, 300);

  const fetchApplicableTaxes = useCallback(
    async (coupon) => {
      try {
        const params = {
          serviceId: values?.services?.map((s) => s?.serviceId?._id).join(","),
          location: values?.location?.value,
          city: values?.city,
          state: values?.state,
          couponId: coupon?._id,
        };
        const result = await getApi(APIS.GET_APPLICABLE_TAXES, params);
        setTaxes(result?.data?.data);
      } catch (error) {
        console.error("Error fetching taxes:", error);
        setTaxes([]);
      }
    },
    [setTaxes]
  );

  const handleCouponChange = (coupon) => {
    setFieldValue("coupon", coupon);
    if (coupon) {
      fetchApplicableTaxes(coupon);
    }
    if (onDiscountPress) {
      onDiscountPress(coupon);
    }
  };

  return (
    <AdaptableCard className="p-2 mt-8 bg-slate-100" divider>
      <FormItem label="Select Coupon">
        <Field
          component={Select}
          defaultOptions
          cacheOptions
          loadOptions={loadCoupon}
          componentAs={AsyncSelect}
          className={`font-semibold`}
          value={values?.coupon}
          name="coupon"
          placeholder="Type something..."
          onChange={handleCouponChange}
          getOptionLabel={(v) => `${v?.couponCode} (${v?.couponAmount})`}
          getOptionValue={(v) => v?._id}
          isDisabled={statusDisabled(values?.status)}
        />
      </FormItem>
    </AdaptableCard>
  );
};

export default Coupon;
