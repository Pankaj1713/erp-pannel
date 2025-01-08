import React, { useEffect, useRef, useState } from "react";
import { AdaptableCard } from "components/shared";
import {
  Button,
  Drawer,
  Input,
  FormItem,
  FormContainer,
  toast,
  Notification,
  Select,
} from "components/ui";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { postApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { AiOutlineSave, AiOutlineCloseCircle } from "react-icons/ai";
import { useSelector } from "react-redux";

export const timeUnit = [
  { label: "Hours", value: 0 },
  { label: "Days", value: 1 },
];

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

const SignupSchema = Yup.object().shape({
  startTime: Yup.number().required("Start time is required"),
  endTime: Yup.number().required("End time is required"),
  timeUnit: Yup.object().required("Time unit is required"),
  refundPercentage: Yup.number()
    .min(0, "Refund percentage cannot be less than 0")
    .max(100, "Refund percentage cannot exceed 100")
    .required("Refund percentage is required"),
});

const AddEditCancelation = ({ editData, show, onClose, setRefresh }) => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const onSubmit = (values) => {
    setLoading(true);

    const payload = {
      startTime: values.startTime,
      endTime: values.endTime,
      timeUnit: values.timeUnit.value,
      refundPercentage: values.refundPercentage,
    };

    if (editData && editData._id) {
      payload.ruleId = editData._id;
    }

    postApi(APIS.ADD_EDIT_REFUND_RULES, payload)
      .then(() => {
        onClose();
        setRefresh((prev) => !prev);
        toast.push(
          <Notification type="success">Cancellation policy saved!</Notification>
        );
      })
      .finally(() => setLoading(false));
  };

  const initialValues = {
    startTime: editData?.startTime || "",
    endTime: editData?.endTime || "",
    timeUnit:
      timeUnit.find((option) => option.value === editData?.timeUnit) ||
      timeUnit[0],
    refundPercentage: editData?.refundPercentage || "",
  };

  return (
    <Drawer
      isOpen={show}
      onClose={onClose}
      onRequestClose={onClose}
      closable={false}
      bodyClass="p-0"
      title={
        editData?._id ? "Edit Cancellation Policy" : "Add Cancellation Policy"
      }
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
          {({ errors, touched, setFieldValue, values }) => {
            return (
              <Form className="p-5">
                <FormContainer>
                  <FormItem
                    label="Time Unit"
                    invalid={errors?.timeUnit && touched?.timeUnit}
                    errorMessage={errors?.timeUnit}
                  >
                    <Field
                      as="select"
                      type="number"
                      name="timeUnit"
                      component={Select}
                      options={timeUnit}
                      value={values.timeUnit}
                      onChange={(e) => setFieldValue("timeUnit", e)}
                      placeholder="Select Time Unit"
                    />
                  </FormItem>

                  <FormItem
                    label="Start Time"
                    invalid={errors?.startTime && touched?.startTime}
                    errorMessage={errors?.startTime}
                  >
                    <Field
                      type="number"
                      name="startTime"
                      placeholder="Enter Start Time"
                      component={Input}
                    />
                  </FormItem>

                  <FormItem
                    label="End Time"
                    invalid={errors?.endTime && touched?.endTime}
                    errorMessage={errors?.endTime}
                  >
                    <Field
                      type="number"
                      name="endTime"
                      placeholder="Enter End Time"
                      component={Input}
                    />
                  </FormItem>

                  <FormItem
                    label="Refund Percentage"
                    invalid={
                      errors?.refundPercentage && touched?.refundPercentage
                    }
                    errorMessage={errors?.refundPercentage}
                  >
                    <Field
                      type="number"
                      name="refundPercentage"
                      placeholder="Enter Refund Percentage"
                      component={Input}
                    />
                  </FormItem>
                </FormContainer>
              </Form>
            );
          }}
        </Formik>
      </AdaptableCard>
    </Drawer>
  );
};

export default AddEditCancelation;
