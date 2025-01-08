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
} from "components/ui";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { postApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { AiOutlineSave, AiOutlineCloseCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import appConfig from "configs/app.config";
import BannerImage from "components/custom/banner";
import { randomColors } from "utils/utils";

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
  category: Yup.string().required("Required"),
});

const AddEditCategory = ({ editData, show, onClose, setRefresh, file }) => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [randomColor, setRandomColor] = useState(null);

  useEffect(() => {
    if (show) {
      const res = randomColors();
      if (!!res) {
        setRandomColor(res);
      }
    }
  }, [show]);

  const Url = useSelector((state) => state.auth?.session?.imageUrl);

  const { token } = useSelector((state) => state.auth.session);
  const imageUrl = !!editData?.image[0]?.original
    ? `${Url}${editData?.image[0]?.original}`
    : "";

  const onSubmit = (values) => {
    setLoading(true);
    const formdata = new FormData();
    if (values.file) formdata.append("file", values?.file);

    formdata.append("category", values?.category);
    formdata.append("color", values?.color);

    if (editData && editData._id) {
      formdata.append("categoryId", editData?.code);
    }

    postApi(APIS.ADD_EDIT_CATEGORY, formdata)
      .then(() => {
        onClose();
        setRefresh((prev) => !prev);
        toast.push(<Notification type="success">Category saved!</Notification>);
      })
      .finally(() => setLoading(false));
  };

  const initialValues = {
    category: editData?.category || "",
    file: editData?.file || "",
    color: editData?.color || randomColor,
  };

  return (
    <Drawer
      isOpen={show}
      onClose={onClose}
      onRequestClose={onClose}
      closable={false}
      bodyClass="p-0"
      title={editData?._id ? "Edit Category" : "Add Category"}
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
                    label="Category Name"
                    invalid={errors?.category && touched?.category}
                    errorMessage={errors?.category}
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="category"
                      placeholder="Enter Category"
                      component={Input}
                    />
                  </FormItem>

                  <FormItem
                    label="Select Background Color"
                    invalid={errors?.color && touched?.color}
                    errorMessage={errors?.color}
                  >
                    <input
                      type="color"
                      name="color"
                      value={values.color}
                      onChange={(e) => {
                        setFieldValue("color", e.target.value);
                      }}
                    />
                  </FormItem>

                  <FormItem
                    label="File"
                    invalid={errors?.file && touched?.file}
                    errorMessage={errors?.file}
                  >
                    <BannerImage
                      {...{
                        touched,
                        title: "Category Image/Icon",
                        errors,
                        file: imageUrl || file || "",
                        values,
                        setFieldValue,
                      }}
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

export default AddEditCategory;
