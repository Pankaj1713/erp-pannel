import React, { useRef, useState } from "react";
import { AdaptableCard } from "components/shared";
import {
  Button,
  Drawer,
  Input,
  FormItem,
  FormContainer,
  toast,
  Notification,
  Switcher,
} from "components/ui";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { postApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { AiOutlineSave, AiOutlineCloseCircle } from "react-icons/ai";

//////// DRAWFOOTER BUTTONS ////////

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

const initialValues = {
  taxName: "",
  taxPrice: "",
  cityName: "",
  localTaxRate: "",
  localTax: false,
  interStateTax: false,
};

////// YUP VALIDATION //////

const SignupSchema = Yup.object().shape({
  taxPrice: Yup.string().required("Required"),
  taxName: Yup.string().required("Required"),
  localTaxRate: Yup.string().when("localTax", {
    is: true,
    then: Yup.string().required("Required"),
  }),
  cityName: Yup.string().when("localTax", {
    is: true,
    then: Yup.string().required("Required"),
  }),
});

///// INITIAL VALUES //////

/////  ADD EDIT TAXATION  /////

const AddEditTaxation = ({ editData, show, onClose, setRefresh }) => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  //// HANDLER FOR SUBMIT FORM /////

  const onSubmit = ({ _id, ...data }) => {
    setLoading(true);

    /// PAYLOAD   OBJECT FOR  POST DATA ///

    const payload = {
      taxName: data?.taxName,
      taxPrice: data?.taxPrice,
      interState: data?.interStateTax === true ? 1 : 0,
    };

    if (data?.localTax) {
      payload.localSaleTax = [
        {
          cityName: data?.cityName,
          localTaxRate: data?.localTaxRate,
        },
      ];
    } else {
      payload.localSaleTax = [];
    }

    if (_id) {
      payload.taxId = _id;
    }


    postApi(APIS.ADD_EDIT_TAXATION, payload)
      .then(() => {
        onClose();
        setRefresh((r) => !r);
        toast.push(<Notification type="success">Taxation saved!</Notification>);
      })
      .finally(() => setLoading(false));
  };

  /////// RETURN //////

  return (
    <Drawer
      isOpen={show}
      onClose={onClose}
      onRequestClose={onClose}
      closable={false}
      bodyClass="p-0"
      title={editData?._id ? "Edit Taxation" : "Add Taxation"}
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
          initialValues={
            {
              ...initialValues,
              ...editData,
              localTax: !!editData?.cityName,
            } || initialValues
          }
          validationSchema={SignupSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ errors, touched, values, setFieldValue }) => {
            return (
              <Form className="p-5">
                <FormContainer>
                  <FormItem
                    label="Tax Name"
                    invalid={errors?.taxName && touched?.taxName}
                    errorMessage={errors?.taxName}
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="taxName"
                      placeholder="Name"
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label="Tax Percentage"
                    invalid={errors?.taxPrice && touched?.taxPrice}
                    errorMessage={errors?.taxPrice}
                  >
                    <Field
                      type="number"
                      autoComplete="off"
                      name="taxPrice"
                      placeholder="E.g. 100"
                      component={Input}
                    />
                  </FormItem>
                  <FormItem label="Select Local Tax">
                    <Switcher
                      checked={values?.localTax}
                      onChange={(checked) => {
                        const newValue = !checked;
                        setFieldValue("localTax", newValue);
                      }}
                      checkedLabel="Local Tax"
                      id="localTax"
                      name="localTax"
                      uncheckedLabel="Local Tax"
                    />
                  </FormItem>
                  {values?.localTax && (
                    <>
                      <FormItem
                        label="City Name"
                        invalid={errors?.cityName && touched?.cityName}
                        errorMessage={errors?.cityName}
                      >
                        <Field
                          type="text"
                          autoComplete="off"
                          name="cityName"
                          placeholder="E.g. Mohali"
                          component={Input}
                        />
                      </FormItem>
                      <FormItem
                        label="Local Tax Rate"
                        invalid={errors?.localTaxRate && touched?.localTaxRate}
                        errorMessage={errors?.localTaxRate}
                      >
                        <Field
                          type="number"
                          autoComplete="off"
                          name="localTaxRate"
                          placeholder="E.g. 100"
                          component={Input}
                        />
                      </FormItem>
                    </>
                  )}

                  <FormItem label=" Inter State ">
                    <Switcher
                      checked={values?.interStateTax}
                      onChange={(checked) => {
                        const newValue = !checked;
                        setFieldValue("interStateTax", newValue);
                      }}
                      checkedLabel="Local Tax"
                      id="interStateTax"
                      name="interStateTax"
                      uncheckedLabel="Local Tax"
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

export default AddEditTaxation;
