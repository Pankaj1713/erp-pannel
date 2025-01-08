import { AdaptableCard } from "components/shared";
import { Button, DatePicker, FormItem, Input, Notification, toast } from "components/ui";
import { APIS } from "constants/api.constant";
import { get } from "lodash";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { postApi } from "services/CommonService";
import { statusDisabled } from "utils/helpers";

const MannualPayment = ({ values, setFieldValue }) => {
  const [amount, setAmount] = useState();
  const [paymentId, setPaymentId] = useState();
  const [date, setDate] = useState();
  const [method, setMethod] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dateErrorMessage, setDateErrorMessage] = useState("");
  const [methodErrorMessage, setMethodErrorMessage] = useState("");
  const { id } = useParams();

  const manualPaymentHandler = () => {
    if (!date) {
      setDateErrorMessage("Required");
    }
    if (!method) {
      setMethodErrorMessage("Required");
    }
    if (!amount) {
      setErrorMessage("Required");
    }
    if (!amount && !method && !date) {
      return;
    }
    setLoading(true);
    const apiPayload = {
      bookingId: id,
      amount: amount,
      date: date,
      method: method,
    };
    if (paymentId) {
      apiPayload.paymentId = paymentId;
    }

    postApi(APIS.MANUAL_PAYMENT, apiPayload)
      .then((res) => {
        setFieldValue("paymentTransactions", res?.data);
        toast.push(
          <Notification type="success">Mannual Payment Added</Notification>
        );
      })
      .finally(() => {
        setAmount("");
        setDate(new Date());
        setMethod("");
        setPaymentId("");
        setLoading(false);
      });
  };
  const amountChangeHandler = (value) => {
    setAmount(value);
  };
  return (
    <AdaptableCard divider border>
      <div className="flex justify-between mb-4">
        <h5>Manual Payment</h5>
      </div>

      <FormItem
        label="Amount"
        invalid={!!errorMessage}
        errorMessage={errorMessage}
      >
        <Input
          type="number"
          invalid={!!errorMessage}
          min="0"
          placeholder="Enter Amount"
          onWheel={(e) => e.target.blur()}
          onChange={(e) =>
            setAmount(e.target.value ? Number(e.target.value) : "")
          }
          value={amount}
          disabled={statusDisabled(values?.status)}
        />
      </FormItem>
      <FormItem
        label="Date"
        invalid={!!dateErrorMessage}
        errorMessage={dateErrorMessage}
      >
        <DatePicker
          name="date"
          onChange={(e) => setDate(e)}
          value={date}
          defaultValue={new Date()}
          className="border-red-400"
          invalid={!!dateErrorMessage}
          disabled={statusDisabled(values?.status)}
        />
      </FormItem>
      <FormItem
        label="Method"
        invalid={!!methodErrorMessage}
        errorMessage={methodErrorMessage}
      >
        <Input
          name="method"
          placeholder="Enter Method"
          invalid={!!methodErrorMessage}
          onChange={(e) => setMethod(e?.target?.value)}
          value={method}
          disabled={statusDisabled(values?.status)}
        />
      </FormItem>
      <FormItem label="Payment Id">
        <Input
          placeholder="Enter Payment Id"
          onChange={(e) => setPaymentId(e.target.value)}
          value={paymentId}
          disabled={statusDisabled(values?.status)}
        />
      </FormItem>
      <Button
        loading={loading}
        type="button"
        variant="solid"
        size="sm"
        onClick={() => manualPaymentHandler()}
        disabled={statusDisabled(values?.status)}
      >
        Submit Manual Payment
      </Button>
    </AdaptableCard>
  );
};

export default MannualPayment;
