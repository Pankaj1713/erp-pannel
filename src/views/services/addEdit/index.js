import React, { useEffect, useState } from "react";
import { FormContainer, toast, Notification } from "components/ui";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { postApi, getApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import cloneDeep from "lodash/cloneDeep";
import ServiceFields from "./service";

////// INITIALVALUES ///////

const initialValues = {
  name: "",
  price: "",
  time: "",
  categoryId: "",
  availableFor: "",
};

/////// Yup Validation ////////

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  price: Yup.number().required("Required"),
  time: Yup.string().required("Required"),
  categoryId: Yup.object().required("Required"),
  availableFor: Yup.object().required("Required"),
});

const AddEditService = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [editService, setEditService] = useState();
  const [refresh, setRefresh] = useState(false);

  ///// GET SERVICE DATA IN CASE OF EDIT ////////

  useEffect(() => {
    if (id) {
      getServices();
    }
  }, [refresh]);

  const getServices = () => {
    getApi(APIS.GET_SERVICES, { id })
      .then((res) => {
        let data = cloneDeep(res?.data?.data);
        setEditService(data);
      })
      .catch((error) => {
        navigate("booking-dashboard");
      });
  };

  //////HANDLER FOR FULL FORM SUBMIT////////////

  const onSubmit = ({ _id, ...data }, { setSubmitting }) => {
    const payload = new FormData();
    let payloadObject = {
      name: data?.name,
      price: data?.price,
      time: data?.time,
      categoryId: data?.categoryId?.value,
      availableFor: data?.availableFor?.value,
    };

    for (let key in payloadObject) {
      payload.append(key, payloadObject[key]);
    }

    if (_id) {
      payload.append("activityId", _id);
    }

    postApi(APIS.ADD_EDIT_ACTIVITY, payload)
      .then((res) => {
        navigate(`/app/activities/edit/${res?.data?._id}`);
        setRefresh((prev) => !prev);
        toast.push(<Notification type="success">Activity saved!</Notification>);
      })
      .finally(() => setSubmitting(false));
  };

  ////// RETURN //////

  return (
    <Formik
      initialValues={id ? editService : initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, touched, errors, isSubmitting, setFieldValue }) => (
        <Form>
          <FormContainer>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              <div className="lg:col-span-2">
                <ServiceFields
                  {...{ touched, errors, values, setFieldValue }}
                />
              </div>
            </div>
          </FormContainer>
        </Form>
      )}
    </Formik>
  );
};

export default AddEditService;
