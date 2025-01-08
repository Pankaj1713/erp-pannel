import { AdaptableCard } from "components/shared";
import {
  Button,
  FormItem,
  Input,
  Notification,
  Radio,
  toast,
  Tooltip,
} from "components/ui";
import { APIS } from "constants/api.constant";
import { Field } from "formik";
import React, { useState } from "react";
import { BiMailSend } from "react-icons/bi";
import { MdAccessTime, MdContentCopy } from "react-icons/md";
import { postApi } from "services/CommonService";
import { formatAmount, statusDisabled } from "utils/helpers";

import { useConfig } from "components/ui";
import { calculateAmount } from "utils/calculateAmount";

const PAYMENT_TYPE = {
  PARTIAL: "PARTIAL",
  FULL: "FULL",
};

const PaymentGatway = ({ id, values }) => {
  const [type, setType] = useState(PAYMENT_TYPE.FULL);
  const [url, setUrl] = useState(values?.paymentUrl);
  const [partialAmount, setPartialAmount] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { themeColor } = useConfig();

  const onTypeChange = (e) => {
    setType(e);
  };

  const paymentLinkAPI = (payload) => {
    return postApi(APIS.GENERATE_PAYMENT_LINK, {
      bookingId: id,
      ...payload,
    });
  };

  const generatePaymentLink = () => {
    if (type === PAYMENT_TYPE.PARTIAL && (!partialAmount || errorMessage)) {
      onPartialAmountChange(partialAmount);
      return;
    }

    setLoading(true);
    paymentLinkAPI({
      amount:
        type === PAYMENT_TYPE.FULL
          ? calculateAmount({ values })
          : partialAmount,
    })
      .then((res) => setUrl(res?.data?.url))
      .finally(() => setLoading(false));
  };

  const updateExpiry = () => {
    if(values?.status===5 || values?.status=== 6){
      return
    }
    paymentLinkAPI({
      updateTime: true,
    }).then(() => {
      toast.push(
        <Notification type="success">Expiry Date Updated!</Notification>
      );
    });
  };

  const resendNotification = () => {
    if(values?.status===5 || values?.status=== 6){
      return
    }
    paymentLinkAPI({
      resendNotification: true,
    }).then(() => {
      toast.push(
        <Notification type="success">Notification sent!</Notification>
      );
    });
  };

  const copyLink = async () => {
    await navigator?.clipboard?.writeText(values?.paymentUrl);
    toast.push(<Notification type="success">Link copied!</Notification>);
  };

  const onPartialAmountChange = (value) => {
    setPartialAmount(value);

    if (!value) {
      setErrorMessage("Amount required");
    } else if (value > calculateAmount({ values })) {
      setErrorMessage("Must be less than full amount");
    } else {
      setErrorMessage("");
    }
  };

  return (
    id && (
      <AdaptableCard divider border>
        <div className="flex justify-between">
          <h5 className="mr-10">Razorpay </h5>{" "}
          {url ? (
            <div className="flex justify-between ">
              <Tooltip title="Update Expiry">
                <MdAccessTime
                  className={`text-xl text-${themeColor}-600 bg-green-50 cursor-pointer`}
                  onClick={updateExpiry}
                />
              </Tooltip>
              <Tooltip title="Resend Notification">
                <BiMailSend
                  className={`text-xl text-${themeColor}-600 bg-green-50 ml-5  cursor-pointer`}
                  onClick={resendNotification}
                />
              </Tooltip>
              <Tooltip title="Copy Link">
                <MdContentCopy
                  className={`text-lg text-${themeColor}-600 bg-green-50 ml-5  cursor-pointer`}
                  onClick={copyLink}
                />
              </Tooltip>
            </div>
          ) : (
            <Button
              size="sm"
              variant="twoTone"
              type="button"
              onClick={generatePaymentLink}
              disabled={loading || statusDisabled(values?.status)}
            >
              {loading ? "Generating link" : "Generate link"}
            </Button>
          )}
        </div>

        {url ? (
          <div className=" flex text-slate-500 mt-3">
            Payment Link :
            <a
              className="text-green-600 hover:text-green-700   hover:underline ml-2"
              href={url}
              target="_blank"
            >
              {url}
            </a>
          </div>
        ) : (
          <>
            <div className="flex justify-between my-5">
              <Radio
                defaultChecked
                color="green-600"
                className="mr-3"
                name="payment"
                value={PAYMENT_TYPE.FULL}
                onChange={onTypeChange}
                disabled={statusDisabled(values?.status)}
              >
                Full Payment
              </Radio>
              <Radio
                color="green-600"
                name="payment"
                value={PAYMENT_TYPE.PARTIAL}
                onChange={onTypeChange}
                disabled={statusDisabled(values?.status)}
              >
                Partial Payment
              </Radio>
            </div>
            {type === PAYMENT_TYPE.PARTIAL && (
              <FormItem
                label="Partial Amount"
                invalid={!!errorMessage}
                errorMessage={errorMessage}
              >
                <Input
                  type="number"
                  min="0"
                  invalid={!!errorMessage}
                  name="partialPayment"
                  value={partialAmount}
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => {
                    onPartialAmountChange(
                      e.target.value ? Number(e.target.value) : ""
                    );
                  }}
                  disabled={statusDisabled(values?.status)}
                />
              </FormItem>
            )}
            {type === PAYMENT_TYPE.FULL && (
              <FormItem label="Total Amount">
                <Field
                  component={Input}
                  name="totalPayment"
                  value={formatAmount(calculateAmount({ values }))}
                  disabled
                />
              </FormItem>
            )}
          </>
        )}
      </AdaptableCard>
    )
  );
};

export default PaymentGatway;
