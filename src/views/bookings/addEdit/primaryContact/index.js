import { AdaptableCard } from "components/shared";
import {
  FormItem,
  Select,
  Input,
  Button,
  Dialog,
  toast,
  Notification,
} from "components/ui";
import { APIS } from "constants/api.constant";
import { BOOKING_STATUS } from "constants/booking";
import { Field } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { HiOutlinePlusCircle } from "react-icons/hi";
import debounce from "lodash/debounce";
import { getApi } from "services/CommonService";
import AddEditCustomers from "views/customers/addEdit";
import { statusDisabled } from "utils/helpers";
import { placeOptions } from "utils/utils";
import AsyncSelect from "react-select/async";

export const bookingStatus = [
  { label: "Pending", value: BOOKING_STATUS.PENDING },
  { label: "Partial payment", value: BOOKING_STATUS.PARTIAL_PAYMENT },
  { label: "Confirmed", value: BOOKING_STATUS.CONFIRMED },
  {
    label: "No payment received",
    value: BOOKING_STATUS.CANCEL_NO_PAYMENT_RECEIVED,
  },
  { label: "Cancel by user", value: BOOKING_STATUS.CANCEL_BY_USER },
  { label: "Cancel by admin", value: BOOKING_STATUS.CANCEL_BY_ADMIN },
  { label: "Completed", value: BOOKING_STATUS.COMPLETED },
];

export const paymentStatus = [
  { label: "Pay At Saloon", value: 1 },
  { label: "Paid Online", value: 2 },
];

const PrimaryContactFields = ({
  touched,
  errors,
  values,
  setFieldValue,
  setTaxes,
  orderNumber,
  editData,
}) => {
  const [drawer, setDrawer] = useState(false);
  const [refresh, setRefresh] = useState();
  const [defaultOptions, setDefaultOptions] = useState();
  const [stateList, setStateList] = useState([]);
  const [status, setStatus] = useState();
  const [dialogIsOpen, setIsOpen] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [walletData, setWalletData] = useState([]);

  useEffect(() => {
    getCustomerOptions();
  }, [refresh]);

  useEffect(() => {
    getApi(APIS.GET_APP_COUNTRY, { data: 1 })
      .then((res) => {
        setStateList(res?.data?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching country list:", error);
      });
  }, []);

  useEffect(() => {
    if (values?.state?.isoCode) {
      getApi(APIS.GET_APP_COUNTRY, {
        data: 2,
        stateCode: values?.state?.isoCode,
      })
        .then((res) => {
          setCityList(res.data.data);
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
        });
    }
  }, [values?.state?.isoCode]);

  useEffect(() => {
    if (editData) {
      setWalletData(editData?.fullName?.wallet);
    }
  }, [editData?.fullName?.wallet]);

  const openDialog = () => {
    setIsOpen(true);
  };

  const onDialogClose = (e) => {
    setIsOpen(false);
  };

  const loadUserOption = (inputValue, resolve) => {
    getApi(APIS.GET_CUSTOMERS, { pattern: inputValue }).then((result) => {
      resolve(result?.data?.data);
    });
  };

  const loadUsers = debounce(loadUserOption, 300);

  const loadCouponOption = (inputValue, resolve) => {
    getApi(APIS.GET_DISCOUNTS, { pattern: inputValue }).then((result) => {
      resolve(result?.data?.data);
    });
  };

  const loadCoupon = debounce(loadCouponOption, 300);

  const getCustomerOptions = () => {
    getApi(APIS.GET_CUSTOMERS).then((result) => {
      setDefaultOptions(result?.data?.data);
    });
  };

  const handlerOpenDrawer = () => {
    setDrawer(true);
  };

  const handlerCloseDrawer = () => {
    setDrawer(false);
  };

  const statusConfirmationHandler = (value) => {
    if (value === 4 || value === 5) {
      setStatus(value);
      openDialog();
    } else {
      setFieldValue(
        "bookingStatus",
        bookingStatus.find((_val) => _val.value === value)
      );
    }
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

  const deboundedFetchTaxes = useCallback(debounce(fetchTaxes, 500), []);

  const handleFieldChange = async (field, value) => {
    setFieldValue(field, value);

    const updatedValues = {
      ...values,
      [field]: value,
    };

    if (updatedValues.location?.value === 0) {
      setFieldValue("state", {});
      setFieldValue("city", {});
      setFieldValue("addressLine", "");
      setFieldValue("houseNumber", "");
      setFieldValue("pinCode", "");
      setCityList([]);
    }

    if (updatedValues.city?.name && updatedValues.state?.name) {
      const params = {
        location: updatedValues?.location?.value,
        city: updatedValues?.city,
        state: updatedValues?.state,
      };

      deboundedFetchTaxes(params);
    }
  };

  return (
    <>
      <AdaptableCard className="p-2  bg-slate-100" border divider>
        <h5 className="mb-2">Booking Status</h5>
        <FormItem>
          <Field
            autoComplete="off"
            placeholder="Select Status"
            component={Select}
            options={bookingStatus}
            value={values?.bookingStatus}
            onChange={(o) => statusConfirmationHandler(o?.value)}
            name={`status`}
            isSearchable={false}
            isDisabled={statusDisabled(
              values?.bookingStatus?.value,
              values.date
            )}
          />
        </FormItem>
      </AdaptableCard>
      <AdaptableCard className="p-2 bg-slate-100" divider>
        <div className="flex justify-between">
          <h5 className="mb-5">Primary Contact</h5>
          <Button
            size="xs"
            type="button"
            variant="solid"
            onClick={handlerOpenDrawer}
            icon={<HiOutlinePlusCircle />}
            disabled={statusDisabled(values?.bookingStatus?.value, values.date)}
          >
            Add Customer
          </Button>
        </div>

        {editData && (
          <div>
            <div className="mb-5">Wallet Amount: {walletData}</div>
            {editData.transactionId && (
              <div className="mb-5">
                Transaction Id: {editData.transactionId}
              </div>
            )}
          </div>
        )}

        <FormItem label="Select Customer">
          <Field
            component={Select}
            defaultOptions={defaultOptions}
            cacheOptions
            loadOptions={loadUsers}
            componentAs={AsyncSelect}
            className={`font-semibold`}
            value={values?.fullName}
            name="fullName"
            placeholder="Type something..."
            onChange={(e) => {
              setWalletData(e?.wallet);
              setFieldValue("fullName", e);
              setFieldValue("userId", e?._id);
              setFieldValue("email", e?.email);
              setFieldValue("phoneNumber", e?.phoneNumber);
              if (values?.location?.value === 1) {
                setFieldValue("state", e?.address?.state);
                setFieldValue("city", e?.address?.city);
                setFieldValue("addressLine", e?.address?.addressLine);
                setFieldValue("houseNumber", e?.address?.houseNumber);
                setFieldValue("pinCode", e?.address?.pinCode);
              }
            }}
            getOptionLabel={(v) => `${v?.name} (${v?.phoneNumber})`}
            getOptionValue={(v) => v?._id}
            isDisabled={statusDisabled(
              values?.bookingStatus?.value,
              values.date
            )}
          />
        </FormItem>
        <FormItem
          label="Email"
          invalid={errors.email && touched.email}
          errorMessage={errors.email}
        >
          <Field
            type="text"
            autoComplete="off"
            name="email"
            value={values?.fullName?.email}
            placeholder="johndoe@example.com"
            component={Input}
            disabled={statusDisabled(values?.bookingStatus?.value, values.date)}
          />
        </FormItem>
        <FormItem
          label="Phone"
          invalid={errors.phoneNumber && touched.phoneNumber}
          errorMessage={errors.phoneNumber}
        >
          <Field
            type="text"
            autoComplete="off"
            name="phoneNumber"
            value={`${values?.fullName?.countryCode || ""}${
              values?.phoneNumber || ""
            }`}
            placeholder="999-999-99"
            component={Input}
            disabled={statusDisabled(values?.bookingStatus?.value, values.date)}
          />
        </FormItem>

        <FormItem
          label="Payment Method"
          invalid={errors?.bookingPlace && touched?.bookingPlace}
          errorMessage={errors?.bookingPlace}
        >
          <Field
            as="select"
            value={values.bookingPlace}
            name="bookingPlace"
            component={Select}
            options={paymentStatus}
            onChange={(e) => {
              setFieldValue("bookingPlace", e);
            }}
            isDisabled={statusDisabled(
              values?.bookingStatus?.value,
              values.date
            )}
            placeholder="Select Payment Place"
          />
        </FormItem>

        <FormItem label="Select Service Place">
          <Field
            type="text"
            autoComplete="off"
            name="location"
            placeholder="Select Service Place"
            getLabelOptions={(v) => v?.label}
            value={values?.location}
            getValueOptions={(v) => v?.value}
            onChange={(e) => {
              setFieldValue("location", e);
              if (e?.value === 0) {
                // Clear fields for "At Saloon"
                setFieldValue("state", {});
                setFieldValue("city", {});
                setFieldValue("addressLine", "");
                setFieldValue("houseNumber", "");
                setFieldValue("pinCode", "");
                setCityList([]);

                // Call the GET_APPLICABLE_TAXES API for "At Saloon"
                const params = { location: e.value };
                deboundedFetchTaxes(params);
              } else if (e?.value === 1) {
                // Clear taxes when "At Home" is selected
                setTaxes([]);
              }
            }}
            options={placeOptions}
            component={Select}
            isDisabled={statusDisabled(
              values?.bookingStatus?.value,
              values.date
            )}
          />
        </FormItem>

        {values?.location?.value === 1 && (
          <>
            {" "}
            <FormItem
              label="Enter State"
              invalid={errors.state && touched.state}
              errorMessage={errors.state}
            >
              <Field
                component={Select}
                options={stateList}
                type="text"
                autoComplete="off"
                placeholder="Enter State"
                name="state"
                value={values?.state}
                getOptionLabel={(v) => v?.name}
                getOptionValue={(v) => v?.isoCode}
                onChange={(e) => {
                  handleFieldChange("state", e);
                }}
                isDisabled={statusDisabled(
                  values?.bookingStatus?.value,
                  values.date
                )}
              />
            </FormItem>
            <FormItem
              label="Enter City"
              invalid={errors.city && touched.city}
              errorMessage={errors.city}
            >
              <Field
                component={Select}
                type="text"
                autoComplete="off"
                placeholder="Enter City"
                name="city"
                options={cityList}
                value={values?.city}
                onChange={(e) => {
                  handleFieldChange("city", e);
                }}
                getOptionLabel={(v) => v?.name}
                getOptionValue={(v) => v?.name}
                isDisabled={statusDisabled(
                  values?.bookingStatus?.value,
                  values.date
                )}
              />
            </FormItem>
            <FormItem
              label="Enter Street Address"
              invalid={errors.addressLine && touched.addressLine}
              errorMessage={errors.addressLine}
            >
              <Field
                component={Input}
                type="text"
                autoComplete="off"
                placeholder="Enter Street Address"
                name="addressLine"
                value={values?.addressLine}
                onChange={(e) => setFieldValue("addressLine", e?.target?.value)}
                disabled={statusDisabled(
                  values?.bookingStatus?.value,
                  values.date
                )}
              />
            </FormItem>
            <FormItem
              label="Enter House Number"
              invalid={errors.houseNumber && touched.houseNumber}
              errorMessage={errors.houseNumber}
            >
              <Field
                component={Input}
                type="text"
                autoComplete="off"
                placeholder="Enter House Number"
                name="houseNumber"
                value={values?.houseNumber}
                onChange={(e) => setFieldValue("houseNumber", e?.target?.value)}
                disabled={statusDisabled(
                  values?.bookingStatus?.value,
                  values.date
                )}
              />
            </FormItem>
            <FormItem
              label="Enter Pincode"
              invalid={errors.pinCode && touched.pinCode}
              errorMessage={errors.pinCode}
            >
              <Field
                component={Input}
                type="number"
                autoComplete="off"
                placeholder="Enter Pincode"
                name="pinCode"
                value={values?.pinCode}
                onChange={(e) => setFieldValue("pinCode", e?.target?.value)}
                disabled={statusDisabled(
                  values?.bookingStatus?.value,
                  values.date
                )}
              />
            </FormItem>
          </>
        )}

        <AddEditCustomers
          show={drawer}
          onClose={handlerCloseDrawer}
          setRefresh={setRefresh}
        />
      </AdaptableCard>
      <Dialog
        isOpen={dialogIsOpen}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
      >
        <h5 className="mb-4">Confirmation</h5>
        <p>Are you sure you want to cancel this booking?</p>
        <div className="text-right mt-6">
          <Button
            size="sm"
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={onDialogClose}
          >
            Cancel
          </Button>
          <Button
            variant="twoTone"
            size="sm"
            color="red-600"
            onClick={() => {
              setFieldValue(
                "bookingStatus",
                bookingStatus.find((obj) => obj.value === status)
              );
              setIsOpen(false);
            }}
          >
            Confirm
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default PrimaryContactFields;
