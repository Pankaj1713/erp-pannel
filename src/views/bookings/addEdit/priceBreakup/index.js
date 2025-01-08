import React, { useEffect, useMemo, useCallback, useState } from "react";
import { AdaptableCard } from "components/shared";
import { Input, Notification, toast, useConfig } from "components/ui";
import { Field } from "formik";
import { useSelector } from "react-redux";
import { getApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import debounce from "lodash/debounce";
import {
  formatBookingAmount,
  formatAmount,
  roundedToFixed,
  statusDisabled,
} from "utils/helpers";
import { calculateAmount, subTotalPrice } from "utils/calculateAmount";

const PriceBreakup = ({
  values,
  setFieldValue,
  taxes,
  errors,
  editData,
  selectedCoupon,
  onPackagePress,
  orderNumber,
  totalAmount,
}) => {
  const { themeColor } = useConfig();

  const [newTax, setNewTax] = useState([]);
  const [newTaxes, setNewTaxes] = useState([]);

  const data = useSelector((state) => state.auth.user.appConfig[0]);

  const totalPrice = useMemo(() => {
    return (
      values?.services?.reduce((total, service) => {
        return total + (service?.serviceId?.price || 0);
      }, 0) +
      values?.packages?.reduce((total, pack) => {
        return total + (pack?.packageId?.price || 0);
      }, 0)
    );
  }, [values?.services, values?.packages]);

  const fetchTaxes = async () => {
    try {
      const res = await getApi(APIS.GET_APPLICABLE_TAXES, {
        location: values?.location?.value,
      });
      setNewTaxes(res?.data?.data);
    } catch (error) {
      toast.push(
        <Notification closable type="error" duration={2000}>
          Error fetching taxes
        </Notification>
      );
    }
  };

  const handleDiscountChange = (discountValue) => {
    setFieldValue("discount", Number(discountValue));
    setFieldValue("coupon", null);
    const params = {
      discount: discountValue,
      location: values?.location?.value,
      city: values?.city,
      state: values?.state,
    };

    fetchTaxes(params);
  };

  useEffect(() => {
    applyCouponAndCalculateAmounts();
  }, [selectedCoupon, editData?.coupon, totalPrice]);

  const applyCouponAndCalculateAmounts = () => {
    if (selectedCoupon || editData?.coupon) {
      const discountAmount = !!selectedCoupon
        ? selectedCoupon?.couponAmount
        : editData?.coupon?.couponAmount || 0;

      const offType = selectedCoupon?.offType || 0;

      let discount = 0;
      if (offType === 1) {
        discount = Number(discountAmount);
      } else if (offType === 0) {
        discount = totalPrice * (discountAmount / 100);
      }

      setFieldValue("discount", roundedToFixed(discount, 2));
      setFieldValue("roundOff", calculateAmount({ isRoundOff: true, values }));

      const params = {
        discount: discount,
        location: values?.location?.value,
        city: values?.city,
        state: values?.state,
      };
      fetchTaxes(params);
      setFieldValue("total", subTotalPrice({ values }));
      setFieldValue(
        "taxableAmount",
        calculateAmount({ isTaxable: true, values })
      );
      setFieldValue("amountPaid", calculateAmount({ values }));
    }
  };

  useEffect(() => {
    const discount = parseFloat(values?.discount || 0);
    const totalBeforeDiscount = subTotalPrice({ values });
    const discountedTotal = totalBeforeDiscount - discount;

    setFieldValue("total", totalBeforeDiscount.toString());
    setFieldValue(
      "taxableAmount",
      calculateAmount({
        isTaxable: true,
        values,
        total: discountedTotal,
      }).toString()
    );
    setFieldValue(
      "amountPaid",
      calculateAmount({ values, total: discountedTotal }).toString()
    );

    if (taxes?.length) {
      const updatedEditData = {
        ...editData,
        tax: taxes?.map((taxItem) => {
          const taxAmount = roundedToFixed(
            calculateAmount({
              isGst: true,
              values,
              tax: [taxItem],
              total: discountedTotal,
            }),
            2
          );

          return {
            ...taxItem,
            taxAmount: taxAmount !== undefined ? taxAmount : 0,
          };
        }),
      };

      if (
        JSON.stringify(values?.taxes) !== JSON.stringify(updatedEditData?.tax)
      ) {
        setFieldValue("tax", updatedEditData?.tax);
        setNewTax(updatedEditData?.tax);
      }
    } else {
      setNewTax(editData?.tax);
    }
  }, [values?.discount, taxes, values?.state, values?.city]);

  return (
    <AdaptableCard divider border>
      <div className="flex flex-col justify-between my-5">
        <div>
          <h4>Your Booking Summary</h4>
        </div>
        {values?.services?.map((activity, activityIndex) => (
          <div
            className="font-semibold border-b-2 p-3 my-2"
            key={activityIndex}
          >
            <div className="flex my-3 text-lg items-center">
              <p
                className={`text-semibold mr-3 bg-${themeColor}-100 text-${themeColor}-600 px-2 rounded-lg`}
              >
                Service {activityIndex + 1}
              </p>
              <p className={`text-${themeColor}-600`}>
                {activity?.serviceId?.name}
              </p>
            </div>
            <div className="flex justify-between text-lg text-slate-700 my-4">
              <p>Price</p>
              {activity?.serviceId?.price ? (
                <p>
                  {data?.globalCurrency}
                  {formatBookingAmount(activity?.serviceId?.price)}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
        ))}
        {values?.packages?.map((pack, packageIndex) => (
          <div className="font-semibold border-b-2 p-3 my-2" key={packageIndex}>
            <div className="flex my-3 text-lg items-center">
              <p
                className={`text-semibold mr-3 bg-${themeColor}-100 text-${themeColor}-600 px-2 rounded-lg`}
              >
                Package {packageIndex + 1}
              </p>
              <p className={`text-${themeColor}-600`}>
                {pack?.packageId?.name}
              </p>
            </div>
            <div className="flex justify-between text-lg text-slate-700 my-4">
              <p>Price</p>
              {pack?.packageId?.price ? (
                <p>
                  {data?.globalCurrency}
                  {formatBookingAmount(pack?.packageId?.price)}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
        ))}
        <div className="flex justify-between text-lg font-semibold mt-2">
          <p className="">Sub Total</p>
          <p>
            {data?.globalCurrency}
            {formatAmount(subTotalPrice({ values }))}
          </p>
        </div>
        <div className="flex justify-between items-center text-lg font-semibold mt-2">
          <p className="">
            Discount{" "}
            {selectedCoupon?.couponCode ? `(${selectedCoupon.couponCode})` : ""}
          </p>
          <p className="w-1/2 flex justify-end">
            <Field
              size="sm"
              className="w-2/5"
              autoComplete="off"
              step="any"
              component={Input}
              prefix={data?.globalCurrency}
              style={{ textAlign: "right" }}
              type="number"
              // onWheel={(e) => e.target.blur()}
              placeholder="Enter Discount"
              name="discount"
              value={values?.discount || 0}
              onChange={(e) => handleDiscountChange(e.target.value)}
              disabled={
                values?.isCouponApplied || statusDisabled(values?.status)
              }
            />
          </p>
        </div>
        <div className="flex justify-between text-lg font-semibold mt-2">
          <p className="">Taxable</p>
          <p>
            {data?.globalCurrency}
            {formatAmount(calculateAmount({ isTaxable: true, values }))}
          </p>
        </div>
        <div className=" text-lg font-semibold mt-2">
          {newTax?.map((tax, index) => (
            <div
              className="flex justify-between text-lg font-semibold"
              key={index}
            >
              <div>
                {tax?.taxName} ({tax?.taxPrice || tax?.taxPercentage}%)
              </div>
              <div>
                {data?.globalCurrency}{" "}
                {!!tax?.taxAmount
                  ? tax?.taxAmount
                  : roundedToFixed(
                      calculateAmount({
                        isGst: true,
                        values,
                        tax: [newTax[index]],
                      }),
                      2
                    ) || 0}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-lg font-semibold my-2">
          <p className="">Round Off</p>
          <p>
            {data?.globalCurrency}
            {calculateAmount({ isRoundOff: true, values })}
          </p>
        </div>{" "}
        {editData?.walletPaid ? (
          <div className="flex justify-between text-slate-700 mb-2 text-lg font-semibold">
            <p className="">Wallet Paid</p>

            <p>
              {data?.globalCurrency} {editData?.walletPaid}
            </p>
          </div>
        ) : null}
        <div className="flex justify-between text-slate-700 text-lg font-semibold">
          <p className="">Total</p>
          <div className="flex flex-col items-end">
            <p>{formatAmount(calculateAmount({ values }))}</p>
            <p className="text-sm text-slate-300">Including GST</p>
          </div>
        </div>
      </div>
    </AdaptableCard>
  );
};

export default PriceBreakup;
