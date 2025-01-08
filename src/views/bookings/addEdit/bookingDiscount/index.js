import { AdaptableCard } from "components/shared";
import { FormItem, Button, Select } from "components/ui";
import { APIS } from "constants/api.constant";
import { Field } from "formik";
import debounce from "lodash/debounce";
import React from "react";
import { useParams } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { getApi, postApi } from "services/CommonService";
import { calculateAmount } from "utils/calculateAmount";
import { statusDisabled } from "utils/helpers";

const BookingDiscount = ({ values, setFieldValue, errors, touched }) => {
  const { id } = useParams();

  const loadStaysOption = (inputValue, resolve) => {
    getApi(APIS.GET_DISCOUNTS, { search: inputValue }).then((result) => {
      resolve(result?.data?.data);
    });
  };

  const loadStays = debounce(loadStaysOption, 300);

  const couponApplyHandler = () => {
    const subtotal = calculateAmount({ isSubTotal: true, values }) ?? 0;
    const discount =
      calculateAmount({
        isDiscount: true,
        values,
        discountAction: values?.couponId?.type,
      }) ?? null;

    postApi(APIS.APPLY_DISCOUNT, {
      bookingId: id,
      couponId: values?.couponId?._id,
      action: values?.isCouponApplied ? 2 : 1,
      subTotal: subtotal,
      discount: discount,
    }).then((res) => {
      setFieldValue("discount", discount);

      if (values?.isCouponApplied) {
        setFieldValue("isCouponApplied", false);
        setFieldValue("discount", 0);
        setFieldValue("couponId", "");
      } else {
        setFieldValue("isCouponApplied", true);
      }
    });
  };

  return (
    <AdaptableCard divider>
      <FormItem label="Discount">
        <Field
          component={Select}
          defaultOptions
          cacheOptions
          loadOptions={loadStays}
          componentAs={AsyncSelect}
          className={`font-semibold`}
          value={values?.couponId}
          name="couponId"
          placeholder="Select Coupon"
          onChange={(e) => {
            setFieldValue("couponId", e);
          }}
          getOptionLabel={(v) => v?.code}
          getOptionValue={(v) => v?._id}
          isDisabled={values?.isCouponApplied || statusDisabled(values?.status)}
        />
      </FormItem>
      <Button
        type="button"
        className="-mr-10"
        variant="twoTone"
        onClick={couponApplyHandler}
        disabled={!values?.couponId || statusDisabled(values?.status)}
      >
        {!values?.isCouponApplied ? "Apply" : "Remove"}
      </Button>
    </AdaptableCard>
  );
};

export default BookingDiscount;
