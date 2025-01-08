import React, { useState, useRef, useCallback } from "react";
import { AdaptableCard } from "components/shared";
import { Button, Select, FormItem, toast, Notification } from "components/ui";
import { Field, FieldArray } from "formik";
import { HiOutlinePlusCircle, HiOutlineTrash } from "react-icons/hi";
import { getApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";
import { useConfig } from "components/ui";
import { statusDisabled } from "utils/helpers";

const defaultValue = {
  packageId: "",
};

const BookingPackage = ({
  id,
  touched,
  errors,
  values,
  setFieldValue,
  setTaxes,
  onPackagePress = undefined,
}) => {
  const { themeColor } = useConfig();
  const arrayHelpersRef = useRef(null);
  const [removePackage, setRemovePackage] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPackagesOption = (inputValue, resolve) => {
    getApi(APIS.GET_PACKAGES, { pattern: inputValue }).then((result) => {
      resolve(result?.data?.data);
    });
  };
  const loadPackages = debounce(loadPackagesOption, 300);

  const fetchTaxes = async (params) => {
    try {
      const res = await getApi(APIS.GET_APPLICABLE_TAXES, params);
      setTaxes(res?.data?.data);
    } catch (error) {
      toast.push(
        <Notification closable type="error" duration={2000}>
          Error fetching Data
        </Notification>
      );
    }
  };

  const debouncedFetchTaxes = useCallback(debounce(fetchTaxes, 500), []);

  const handlePackageChange = (index, pkg) => {
    setFieldValue(`packages.${index}.packageId`, pkg);
    const params = {
      packageId: pkg?._id,
      location: values?.location?.value,
      city: values?.city,
      state: values?.state,
    };
    debouncedFetchTaxes(params);
  };

  const removePackageHandler = (index, id) => {
    arrayHelpersRef.current.remove(index);
    removePackage.push(id);
    setRemovePackage((removePackage) => [...removePackage]);
    setFieldValue("removePackage", removePackage);

    const params = {
      serviceId: values?.services[index]?.serviceId?._id,
      location: values?.location?.value,
      city: values?.city,
      state: values?.state,
    };
    debouncedFetchTaxes(params);
  };

  return (
    <>
      <AdaptableCard divider border>
        {id && (
          <div className="flex justify-between">
            <div
              className={`font-semibold text-base bg-${themeColor}-50 mb-3 text-${themeColor}-600 px-2 rounded-lg`}
            >{`Package - #${values?.packages[0]?.bookingNo || ""}`}</div>
            <div></div>
          </div>
        )}
        <div>
          <FieldArray
            name="packages"
            render={(arrayHelpers) => {
              arrayHelpersRef.current = arrayHelpers;
              return (
                <div>
                  {values?.packages?.map((pkg, index) => (
                    <div key={index} className="bg-slate-100 mb-10 p-5">
                      <div className="flex justify-between mb-3">
                        <h5>Package {index + 1}</h5>
                        <Button
                          size="sm"
                          variant="solid"
                          color="red-500"
                          icon={<HiOutlineTrash />}
                          type="button"
                          onClick={() => {
                            removePackageHandler(index, pkg?.packageId?._id);
                          }}
                          disabled={statusDisabled(values?.status)}
                        >
                          Delete Package {index + 1}
                        </Button>
                      </div>

                      <FormItem
                        label="Select Package"
                        invalid={
                          errors?.packages?.[index]?.packageId &&
                          touched?.packages?.[index]?.packageId
                        }
                        errorMessage={errors?.packages?.[index]?.packageId}
                      >
                        <Field
                          component={Select}
                          defaultOptions
                          cacheOptions
                          key={pkg?.packageId}
                          loadOptions={loadPackages}
                          componentAs={AsyncSelect}
                          name={`packages.${index}.packageId`}
                          value={pkg?.packageId}
                          onChange={(pkg) => handlePackageChange(index, pkg)}
                          getOptionLabel={(v) =>
                            `${v?.name}, Price: ${v?.price}`
                          }
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

        <Button
          type="button"
          className="mt-2 mb-3"
          variant="solid"
          icon={<HiOutlinePlusCircle className="text-lg" />}
          onClick={() => arrayHelpersRef.current.push(defaultValue)}
          disabled={statusDisabled(values?.status)}
        >
          {`Add ${values?.packages?.length > 0 ? "More" : ""} Packages`}
        </Button>
      </AdaptableCard>
    </>
  );
};

export default BookingPackage;
