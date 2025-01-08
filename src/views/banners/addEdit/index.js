import React, { useEffect, useState } from "react";
import { FormContainer, Button, toast, Notification } from "components/ui";
import { StickyFooter } from "components/shared";
import { Form, Formik } from "formik";
import BannerImage from "components/custom/banner";
import { AiOutlineSave } from "react-icons/ai";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { getApi, postApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import BannerFields from "./banners";
import { useSelector } from "react-redux";
import { randomColors } from "utils/utils";

/* Yup Validation */
const validationSchema = Yup.object().shape({
  title: Yup.string(),
  subTitle: Yup.string(),
});

const AddEditPackage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [randomColor, setRandomColor] = useState(null);
  const Url = useSelector((state) => state.auth?.session?.imageUrl);

  const { token } = useSelector((state) => state.auth.session);

  useEffect(() => {
    const res = randomColors();
    if (!!res) {
      setRandomColor(res);
    }
    if (id) {
      getData(id);
    }
  }, [id, limit, search, refresh, page]);

  const getData = async (id) => {
    try {
      const res = await getApi(APIS.GET_BANNERS, { id });
      setEditData(res?.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const imageUrl = !!editData?.data[0]?.image[0]?.original
    ? `${Url}${editData?.data[0]?.image[0]?.original}`
    : "";

  const onSubmit = async ({ ...data }, { setSubmitting }) => {
    const formdata = new FormData();

    formdata.append("title", data?.title);
    formdata.append("subTitle", data?.subTitle);
    formdata.append("description", data?.description);
    formdata.append("textColor", data?.textColor);
    if (data?.file?.name) {
      formdata.append("file", data?.file);
    }
    if (id) {
      formdata.append("bannerId", editData?.data[0]?.code);
    }

    try {
      postApi(APIS.ADD_EDIT_BANNERS, formdata)
        .then(() => {
          setRefresh((prev) => !prev);
          toast.push(
            <Notification type="success">
              {" "}
              Banner Saved SuccessFully!
            </Notification>
          );
          navigate("/app/banners/");
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("Failed to save data", error);
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    title: !!editData?.data?.length ? editData?.data[0]?.title : "",
    description: !!editData?.data?.length ? editData?.data[0]?.description : "",
    subTitle: !!editData?.data?.length ? editData?.data[0]?.subTitle : "",
    file: !!editData?.data?.length ? editData : "",
    textColor: !!editData?.data?.length
      ? editData?.data[0]?.textColor
      : randomColor,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnChange={false}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, touched, errors, isSubmitting, setFieldValue }) => {
        return (
          <Form>
            <FormContainer>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                <div className="lg:col-span-2">
                  <BannerFields
                    {...{ touched, errors, values, setFieldValue }}
                  />
                </div>
                <div className="lg:col-span-1">
                  <BannerImage
                    {...{
                      touched,
                      title: "Banner Image",
                      values,
                      file: imageUrl || "",
                      setFieldValue,
                    }}
                  />
                </div>
              </div>
              <StickyFooter
                className="-mx-8 px-8 flex items-center justify-between py-4"
                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <div></div>
                <div className="md:flex items-center">
                  <Button
                    size="sm"
                    className="ltr:mr-3 rtl:ml-3"
                    onClick={() => navigate("/app/banners")}
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
                    {id ? "Update" : "Save"}
                  </Button>
                </div>
              </StickyFooter>
            </FormContainer>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEditPackage;
