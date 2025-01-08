import React, { useState, useRef, useEffect, useCallback } from "react";
import { AdaptableCard } from "components/shared";
import { Button, Select, FormItem, Notification, toast } from "components/ui";
import { Field, FieldArray } from "formik";
import { HiOutlinePlusCircle, HiOutlineTrash } from "react-icons/hi";
import { getApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";
import { useConfig } from "components/ui";
import { statusDisabled } from "utils/helpers";

const defaultService = { serviceId: "" };

const BookingService = ({
  id,
  touched,
  errors,
  values,
  setFieldValue,
  setTaxes,
}) => {
  const { themeColor } = useConfig();
  const arrayHelpersRef = useRef(null);
  const [removeService, setRemoveService] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadServices = debounce((inputValue, resolve) => {
    getApi(APIS.GET_SERVICES, { pattern: inputValue }).then((result) => {
      resolve(result?.data?.data);
    });
  }, 300);

  const handleRemoveService = (index, serviceId) => {
    arrayHelpersRef.current.remove(index);
    const updatedRemoveService = [...removeService, serviceId];
    setRemoveService(updatedRemoveService);
    setFieldValue("removeService", updatedRemoveService);
    fetchTaxesDebounced(getTaxParams(index));
  };

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

  const fetchTaxesDebounced = useCallback(debounce(fetchTaxes, 500), []);

  useEffect(() => {
    fetchTaxesDebounced({
      location: values?.location?.value,
      city: values?.city,
      state: values?.state,
    });
  }, []);

  const handleServiceChange = (index, service) => {
    setFieldValue(`services.${index}.serviceId`, service);
    fetchTaxesDebounced(getTaxParams(index, service?._id));
  };

  const getTaxParams = (
    index,
    serviceId = values?.services[index]?.serviceId?._id
  ) => ({
    serviceId,
    location: values?.location?.value,
    city: values?.city,
    state: values?.state,
  });

  return (
    <AdaptableCard divider border>
      {id && (
        <div className="flex justify-between">
          <div
            className={`font-semibold text-base bg-${themeColor}-50 mb-3 text-${themeColor}-600 px-2 rounded-lg`}
          >
            {`Service - #${values?.services[0]?.bookingNo || ""}`}
          </div>
        </div>
      )}
      <FieldArray
        name="services"
        render={(arrayHelpers) => {
          arrayHelpersRef.current = arrayHelpers;
          return (
            <div>
              {values?.services?.map((service, index) => (
                <div key={index} className="bg-slate-100 mb-10 p-5">
                  <div className="flex justify-between mb-3">
                    <h5>Service {index + 1}</h5>
                    <Button
                      size="sm"
                      variant="solid"
                      color="red-500"
                      icon={<HiOutlineTrash />}
                      type="button"
                      onClick={() =>
                        handleRemoveService(index, service?.serviceId?._id)
                      }
                      disabled={statusDisabled(values?.status)}
                    >
                      Delete Service {index + 1}
                    </Button>
                  </div>

                  <FormItem
                    label="Select Service"
                    invalid={
                      errors?.services?.[index]?.serviceId &&
                      touched?.services?.[index]?.serviceId
                    }
                    errorMessage={errors?.services?.[index]?.serviceId}
                  >
                    <Field
                      component={Select}
                      defaultOptions
                      cacheOptions
                      loadOptions={loadServices}
                      componentAs={AsyncSelect}
                      name={`services.${index}.serviceId`}
                      value={service?.serviceId}
                      onChange={(service) =>
                        handleServiceChange(index, service)
                      }
                      getOptionLabel={(v) => `${v?.name}, Price: ${v?.price}`}
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
      <Button
        type="button"
        className="mt-2 mb-3"
        variant="solid"
        icon={<HiOutlinePlusCircle className="text-lg" />}
        onClick={() => arrayHelpersRef.current.push(defaultService)}
        disabled={statusDisabled(values?.status)}
      >
        {`Add ${values?.services?.length > 0 ? "More" : ""} Services`}
      </Button>
    </AdaptableCard>
  );
};

export default BookingService;
