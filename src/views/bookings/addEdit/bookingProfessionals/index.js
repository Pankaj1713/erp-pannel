import { AdaptableCard } from "components/shared";
import React, { useState, useRef } from "react";
import { Button, Select, FormItem, Input, DatePicker } from "components/ui";
import { Field, FieldArray } from "formik";
import {
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlineUser,
  HiUserGroup,
} from "react-icons/hi";

import { getApi } from "services/CommonService";
import { APIS } from "constants/api.constant";

import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";
import { useConfig } from "components/ui";
import { statusDisabled } from "utils/helpers";

const defaultValue = {
  professionalId: "",
};

const BookingProfessionals = ({
  id,
  touched,
  errors,
  values,
  setFieldValue,
}) => {
  const { themeColor } = useConfig();
  const arrayHelpersRef = useRef(null);
  const [removeProfessional, setRemoveProfessional] = useState([]);

  const loadSpecialistsOption = (inputValue, resolve) => {
    getApi(APIS.GET_EMPLOYEE, { pattern: inputValue }).then((result) => {
      const options = result?.data?.data || [];
      resolve([{ _id: "any", name: "Any", role: "professional" }, ...options]);
    });
  };

  const loadProfessional = debounce(loadSpecialistsOption, 300);

  const removeProfessionalHandler = (index, id) => {
    arrayHelpersRef.current.remove(index);
    removeProfessional.push(id);
    setRemoveProfessional((removeProfessional) => [...removeProfessional]);
    setFieldValue("removeProfessional", removeProfessional);
  };

  return (
    <>
      <AdaptableCard divider border>
        {id && (
          <div className="flex justify-between">
            <div
              className={`font-semibold text-base  bg-${themeColor}-50 mb-3 text-${themeColor}-600 px-2 rounded-lg`}
            >{`Professional - #${
              values?.professionals?.[0]?.bookingNo || ""
            }`}</div>
            <div></div>
          </div>
        )}
        <div>
          <FieldArray
            name="professionals"
            render={(arrayHelpers) => {
              arrayHelpersRef.current = arrayHelpers;
              return (
                <div>
                  {values?.professionals?.map((professional, index) => (
                    <div key={index} className="bg-slate-100 mb-10 p-5">
                      <div className="flex justify-between mb-3">
                        <h5>Professional </h5>

                        <Button
                          size="sm"
                          variant="solid"
                          color="red-500"
                          icon={<HiOutlineTrash />}
                          type="button"
                          onClick={() => {
                            removeProfessionalHandler(
                              index,
                              professional?.professionalId?._id
                            );
                          }}
                          disabled={statusDisabled(values?.status)}
                        >
                          Delete Professional
                        </Button>
                      </div>
                      <FormItem
                        label="Select Professional"
                        invalid={
                          errors?.professionals?.[index]?.professionalId &&
                          touched?.professionals?.[index]?.professionalId
                        }
                        errorMessage={
                          errors?.professionals?.[index]?.professionalId
                        }
                      >
                        <Field
                          component={Select}
                          defaultOptions
                          cacheOptions
                          key={professional?.professionalId}
                          loadOptions={loadProfessional}
                          componentAs={AsyncSelect}
                          name={`professionals.${index}.professionalId`}
                          value={professional?.professionalId}
                          onChange={(e) => {
                            setFieldValue(
                              `professionals.${index}.professionalId`,
                              e
                            );
                          }}
                          getOptionLabel={(v) => `${v?.name} (${v?.role})`}
                          getOptionValue={(v) => v?._id}
                          isDisabled={statusDisabled(values?.status)}
                        />
                      </FormItem>
                    </div>
                  ))}
                </div>
              );
            }}
          />
        </div>

        {values?.professionals?.length < 1 && (
          <Button
            type="button"
            className="mt-2 mb-3"
            variant="solid"
            icon={<HiOutlinePlusCircle className="text-lg" />}
            onClick={() => arrayHelpersRef.current.push(defaultValue)}
            disabled={statusDisabled(values?.status)}
          >
            Add Professional
          </Button>
        )}
      </AdaptableCard>
    </>
  );
};

export default BookingProfessionals;
