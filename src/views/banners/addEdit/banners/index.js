import React from "react";
import { AdaptableCard } from "components/shared";
import { Input, FormItem } from "components/ui";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { AiOutlineCode } from "react-icons/ai";
import { Field } from "formik";

/////// BASIC INFO FIELDS /////////

const BannerFields = ({ touched, errors, values, setFieldValue }) => {
  //////// RETURN ////////

  return (
    <AdaptableCard divider>
      <FormItem
        label="Title"
        invalid={errors.title && touched.title}
        errorMessage={errors.title}
      >
        <Field
          type="text"
          autoComplete="off"
          name="title"
          placeholder="Enter Title"
          component={Input}
          prefix={<AiOutlineCode className="text-lg" />}
        />
      </FormItem>
      <FormItem
        label="Sub Title"
        invalid={errors.name && touched.name}
        errorMessage={errors.name}
      >
        <Field
          type="text"
          autoComplete="off"
          name="subTitle"
          placeholder="Enter Sub Title"
          component={Input}
          value={values?.subTitle}
          onChange={(e) => {
            setFieldValue("name", e?.target?.value);
            setFieldValue("subTitle", e?.target?.value);
          }}
          prefix={<HiOutlineBuildingOffice2 className="text-lg" />}
        />
      </FormItem>

      <FormItem
        label="Description"
        invalid={errors.description && touched.description}
        errorMessage={errors.description}
      >
        <Field
          textArea
          type="text"
          autoComplete="off"
          name="description"
          placeholder="Enter Description"
          value={values?.description}
          component={Input}
          onChange={(e) => setFieldValue("description", e?.target?.value)}
        />
      </FormItem>
      <FormItem
        label="Select Text Color"
        invalid={errors?.textColor && touched?.textColor}
        errorMessage={errors?.textColor}
      >
        <input
          type="color"
          name="color"
          value={values?.textColor}
          onChange={(e) => {
            setFieldValue("textColor", e.target.value);
          }}
        />
      </FormItem>
    </AdaptableCard>
  );
};

export default BannerFields;
