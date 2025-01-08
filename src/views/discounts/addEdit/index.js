import React, { useEffect, useState } from "react";
import { AdaptableCard, StickyFooter } from "components/shared";
import { Button, FormContainer, toast, Notification } from "components/ui";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { getApi, postApi } from "services/CommonService";
import moment from "moment";
import { APIS } from "constants/api.constant";
import { AiOutlineSave, AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import BasicFields from "./baiscFields";

const typeOptions = [
  { label: "Percentage", value: 0 },
  { label: "Flat", value: 1 },
];

///// INITIAL VALUES //////
const initialValues = {
  couponCode: "",
  offType: typeOptions[0],
  limitCount: 0,
  couponAmount: 10,
  minimumAmount: 0,
  userLimitCount: 0,
  startDate: moment().format(),
  endDate: moment().add(1, "month").format(),
  specificCustomer: [],
  specificService: [],
  specificPackage: [],
};

////// YUP VALIDATION //////

const SignupSchema = Yup.object().shape({
  couponCode: Yup.string().required("Required"),
  offType: Yup.mixed().required("Required"),
  startDate: Yup.string().required("Required"),
  endDate: Yup.string().required("Required"),
  couponAmount: Yup.number()
    .required("Required")
    .min(1, "Coupon Amount must be greater than 0"),
  minimumAmount: Yup.number()
    .required("Required")
    .min(1, "Minimum Order Amount must be greater than 0"),
});

/////  ADD EDIT DISCOUNTS  /////

const AddEditDiscounts = () => {
  const { id } = useParams();
  const [editData, setEditData] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getDiscountsData();
    }
  }, [id]);

  const getDiscountsData = () => {
    getApi(APIS.GET_DISCOUNTS, { id: id }).then((res) => {
      const editDiscount = res?.data?.data?.[0];
      const editDataObj = {
        couponCode: editDiscount?.couponCode || "",
        offType: editDiscount?.offType ? typeOptions[1] : typeOptions[0],
        limitCount: editDiscount?.limitCount || 0,
        couponAmount: editDiscount?.couponAmount || 0,
        minimumAmount: editDiscount?.minimumAmount || 0,
        userLimitCount: editDiscount?.userLimitCount || 0,
        startDate: editDiscount?.startDate || "",
        endDate: editDiscount?.endDate || "",
        specificCustomer:
          editDiscount?.specificCustomer?.map((service) => ({
            label: service?.name,
            value: service?._id,
          })) || [],
        specificService:
          editDiscount?.specificService?.map((service) => ({
            label: service?.name,
            value: service?._id,
          })) || [],
        specificPackage:
          editDiscount?.specificPackage?.map((service) => ({
            label: service?.name,
            value: service?._id,
          })) || [],
      };
      setEditData(editDataObj);
    });
  };

  //// HANDLER FOR SUBMIT FORM /////

  const onSubmit = ({ ...data }, { setSubmitting }) => {
    setLoading(true);

    const payloadObj = {
      couponCode: data?.couponCode,
      offType: data?.offType?.value,
      limitCount: data?.limitCount,
      couponAmount: data?.couponAmount,
      minimumAmount: data?.minimumAmount,
      userLimitCount: data?.userLimitCount,
      startDate: data?.startDate,
      endDate: data?.endDate,
    };

    payloadObj.specificCustomer = data?.specificCustomer?.map(
      (item) => item?.value
    );
    payloadObj.specificService = data?.specificService?.map(
      (item) => item?.value
    );
    payloadObj.specificPackage = data?.specificPackage?.map(
      (item) => item?.value
    );

    if (id) {
      payloadObj.discountId = id;
    }

    postApi(APIS.ADD_EDIT_DISCOUNTS, payloadObj)
      .then((res) => {
        navigate("/app/discounts");
        toast.push(
          <Notification type="success">Discounts saved!</Notification>
        );
      })
      .finally(() => {
        setLoading(false);
        setSubmitting(false);
      });
  };

  /////// RETURN //////

  return (
    <AdaptableCard>
      <Formik
        initialValues={editData || initialValues}
        validationSchema={SignupSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ errors, touched, values, isSubmitting, setFieldValue }) => {
          return (
            <Form className="p-5">
              <FormContainer>
                <BasicFields
                  typeOptions={typeOptions}
                  {...{ touched, errors, values, setFieldValue }}
                />

                <StickyFooter
                  className="-mx-8 px-8 flex items-center justify-between py-4"
                  stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                  <div></div>
                  <div className="md:flex items-center">
                    <Button
                      size="sm"
                      className="ltr:mr-3 rtl:ml-3"
                      onClick={() => navigate("/app/discounts")}
                      type="button"
                    >
                      Discard
                    </Button>
                    <Button
                      size="sm"
                      variant="solid"
                      loading={isSubmitting}
                      icon={<AiOutlineSave />}
                      type="submit"
                    >
                      Save
                    </Button>
                  </div>
                </StickyFooter>
              </FormContainer>
            </Form>
          );
        }}
      </Formik>
    </AdaptableCard>
  );
};

export default AddEditDiscounts;
