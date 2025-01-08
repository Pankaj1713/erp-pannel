import React, { useEffect, useState } from "react";
import { AdaptableCard, StickyFooter } from "components/shared";
import { Button, FormContainer, toast, Notification } from "components/ui";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { getApi, postApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { AiOutlineSave, AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import BasicFields from "./BaiscFields";
import { useSelector } from "react-redux";
import { availableForOptions } from "views/services";
import { roleOptions } from "..";
import AccessControl, { PERMISSIONS } from "./accessControl/indes";

////// YUP VALIDATION //////

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().required("Required").email("Invalid email"),
  phoneNumber: Yup.string().required("Required"),
  age: Yup.number()
    .required("Required")
    .max(100, "Must be less than or equal to 100 years old"),
  roles: Yup.string().required("At least one role is required"),
});

///// INITIAL VALUES //////

/////  ADD EDIT STAFF  /////

const AddEditStaff = () => {
  const { id } = useParams();
  const [editStaff, setEditStaff] = useState();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(null);

  const { token } = useSelector((state) => state.auth.session);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);
  const getData = () => {
    getApi(APIS.GET_EMPLOYEE, { id }).then((res) => {
      setUrl(
        `${res?.data?.s3BucketBaseUrl}${res?.data?.data[0]?.image[0]?.original}`
      );
      setEditStaff(res?.data);
    });
  };

  const initialValues = {
    name: !!editStaff?.data?.length ? editStaff?.data[0]?.name : "",
    age: !!editStaff?.data?.length ? editStaff?.data[0]?.age : "",
    email: !!editStaff?.data?.length ? editStaff?.data[0]?.email : "",
    countryCode: !!editStaff?.data?.length
      ? editStaff?.data[0]?.countryCode
      : "",
    phoneNumber: !!editStaff?.data?.length
      ? editStaff?.data[0]?.countryCode + editStaff?.data[0]?.phoneNumber
      : "",
    gender: !!editStaff?.data?.length
      ? availableForOptions.find(
          (it) => it.value === editStaff?.data[0]?.gender
        )
      : "",
    file: !!editStaff?.data?.length ? editStaff?.data[0]?.image : "",
    access: editStaff?.data?.[0]?.access
      ? PERMISSIONS.map((permission) => {
          const matchedAccess = editStaff.data[0].access.find(
            (accessItem) => accessItem.name === permission.name
          );
          return matchedAccess
            ? {
                ...permission,
                read: matchedAccess.read,
                edit: matchedAccess.edit,
                delete: matchedAccess.delete,
              }
            : permission;
        })
      : PERMISSIONS,
    typeOfemployee: !!editStaff?.data?.length
      ? roleOptions.find((item) => item.value === editStaff?.data[0]?.type)
      : "",

    roles: !!editStaff?.data?.length ? editStaff?.data[0]?.role : "",
  };

  const onSubmit = (values, { setSubmitting }) => {
    setLoading(true);

    const payload = new FormData();
    payload.append("name", values.name);
    payload.append("age", values.age);
    payload.append("email", values.email);
    payload.append("countryCode", values.countryCode);

    if (!!values.phoneNumber) {
      payload.append(
        "phoneNumber",
        values?.phoneNumber.substring(4).replace(/\s/g, "")
      );
    }

    payload.append("gender", values.gender.value);
    payload.append("role", values.roles);

    // Transform the access array to have string values
    const transformedAccess = values.access.map((item) => ({
      label: item.label,
      name: item.name,
      read: item.read ? "true" : "false",
      edit: item.edit ? "true" : "false",
      delete: item.delete ? "true" : "false",
    }));

    payload.append(
      "access",
      transformedAccess.length
        ? JSON.stringify(transformedAccess)
        : JSON.stringify(PERMISSIONS)
    );

    payload.append("type", values.typeOfemployee.value);

    if (values.file?.name) {
      payload.append("file", values.file);
    }

    if (id) {
      payload.append("employeeId", editStaff?.data[0]?.code);
    }

    postApi(APIS.ADD_EDIT_STAFF, payload)
      .then(() => {
        toast.push(<Notification type="success">Staff saved!</Notification>);
        navigate("/app/staff");
      })
      .catch((error) => {
        toast.push(
          <Notification type="error">Failed to save staff!</Notification>
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
        initialValues={initialValues}
        validationSchema={SignupSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ errors, touched, values, isSubmitting, setFieldValue }) => {
          return (
            <Form className="p-5">
              <FormContainer>
                <BasicFields
                  {...{ touched, errors, values, setFieldValue, file: url }}
                />
                <AccessControl
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
                      onClick={() => navigate("/app/staff")}
                      icon={<AiOutlineCloseCircle />}
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

export default AddEditStaff;
