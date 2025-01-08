import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  FormContainer,
  Button,
  toast,
  Notification,
  Skeleton,
} from "components/ui";
import { StickyFooter } from "components/shared";
import { Form, Formik } from "formik";
import { AiOutlineSave } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { getApi, postApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import PrimaryContactFields, {
  bookingStatus,
  paymentStatus,
} from "./primaryContact";
import PriceBreakup from "./priceBreakup";
import validation from "./validation";
import { useConfig } from "components/ui";
import PaymentGatway from "./paymentGateway";
import PaymentLog from "./paymentLog";
import OrderNotes from "./orderNotes";
import BookingService from "./bookingService";
import BookingDiscount from "./bookingDiscount";
import Coupon from "./coupon";
import MannualPayment from "./manualPayment";
import BookingPackage from "./bookingPackage";
import BookingProfessionals from "./bookingProfessionals";
import BookingDate from "./bookingDate";
import { convertMinutesToTime, formatDate, placeOptions } from "utils/utils";
import dayjs from "dayjs";
import { debounce } from "lodash";
import moment from "moment";
import { statusDisabled } from "utils/helpers";

const AddEditBooking = () => {
  const navigate = useNavigate();
  const { themeColor } = useConfig();
  const { orderNumber } = useParams();
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const [taxes, setTaxes] = useState(null);
  const [discounts, setDiscounts] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [packagesData, setPackagesData] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [totalAmount, setTotalAmount] = useState();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getDiscountsData();
  }, [orderNumber]);

  useEffect(() => {
    if (orderNumber) {
      getData();
    }
  }, [orderNumber]);

  const initialValues = useMemo(
    () => ({
      userId: "",
      location: placeOptions?.[0],
      date: new Date(),
      slot: "",
      email: "",
      phoneNumber: "",
      coupon: [],
      professionals: [],
      bookingStatus: bookingStatus?.[0],
      orderId: "",
      services: [],
      packages: [],
      city: {},
      state: {},
      houseNumber: "",
      pinCode: "",
      addressLine: "",
      bookingNotes: "",
      discount: 0,
      total: 0,
      taxableAmount: 0,
      amountPaid: 0,
      bookingPlace: paymentStatus?.[0],
    }),
    []
  );

  const getDiscountsData = async () => {
    setLoading(true);
    try {
      const res = await getApi(APIS.GET_DISCOUNTS);
      setDiscounts(res?.data?.data);
    } catch (error) {
      toast.push(
        <Notification closable type="error" duration={2000}>
          Error fetching Data
        </Notification>
      );
    } finally {
      setLoading(false);
    }
  };

  const onDiscountPress = (it) => {
    setSelectedCoupon(it);
  };

  const onPackagePress = (it) => {
    setPackagesData(it);
  };

  const onServicePress = (it) => {
    setServiceData(it);
  };

  const getData = async () => {
    setLoading(true);

    try {
      const res = await getApi(APIS.GET_BOOKINGS, { orderNumber });
      if (res?.data?.data?.length) {
        const editBooking = res?.data?.data?.[0];
        const editDataObj = {
          ...editBooking,
          fullName: editBooking?.userId,
          phoneNumber: editBooking?.userId?.phoneNumber,
          email: editBooking?.userId?.email,
          date: new Date(editBooking?.date) || "",
          slot:
            {
              label: convertMinutesToTime(editBooking?.slot),
              value: editBooking?.slot,
            } || "",
          professionals: editBooking?.selectedExpert
            ? [
                {
                  professionalId: editBooking?.selectedExpert,
                },
              ]
            : [],

          coupon: editBooking?.offerApplied || "",
          orderId: editBooking?.orderId || "",
          bookingNotes: editBooking?.bookingNotes || "",
          services:
            editBooking?.items?.services.map((service) => ({
              serviceId: service,
            })) || [],
          packages:
            editBooking?.items?.packages.map((pkg) => ({
              packageId: pkg,
            })) || [],
          location:
            placeOptions.find((x) => x.value === editBooking?.location) || "",
          transactionId: editBooking?.transactionId || "",
          city: editBooking?.address?.city || {},
          state: editBooking?.address?.state || {},
          houseNumber: editBooking?.address?.houseNumber || "",
          pinCode: editBooking?.address?.pinCode || "",
          addressLine: editBooking?.address?.addressLine || "",
          tax: editBooking?.tax || "",
          discount: editBooking?.discount || 0,
          bookingStatus:
            bookingStatus.find((item) => item.value === editBooking?.status) ||
            "",
          bookingPlace:
            paymentStatus.find((item) => item.value === editBooking?.payAt) ||
            "",
        };
        setEditData(editDataObj);
      }
    } catch (error) {
      toast.push(
        <Notification closable type="error" duration={2000}>
          Error fetching Data
        </Notification>
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data, { setSubmitting }) => {
    if (!data.services.length && !data.packages.length) {
      toast.push(
        <Notification closable type="danger" duration={2000}>
          At least one service or package must be selected.
        </Notification>
      );
      setSubmitting(false);
      return;
    }
    const formattedDate = moment(data.date).format("yy-MM-DD");
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let payloadObject = {
      userId: data?.fullName?._id,
      location: data?.location?.value,
      tzIdentifier: timeZone,
      date: formattedDate,
      slot: data?.slot.label ? data?.slot?.value : data?.slot,
      offerApplied: data?.coupon?.couponCode,
      selectedExpert: data?.professionals?.[0]?.professionalId?._id,
      bookingNotes: data?.bookingNotes,
      tax: data?.tax?.map((it) => ({
        taxId: it?._id,
        taxPercentage: it?.taxPrice || it?.taxPercentage,
        taxName: it?.taxName,
        taxAmount: it?.taxAmount,
      })),
      amountPaid: data?.amountPaid,
      taxableAmount: data?.taxableAmount,
      total: data?.total,
      items: {
        services: data?.services?.map((service) => service?.serviceId?._id),
        packages: data?.packages?.map((pkg) => pkg?.packageId?._id),
      },
      address: {
        city: data?.city,
        state: data?.state,
        houseNumber: data?.houseNumber,
        pinCode: data?.pinCode,
        addressLine: data?.addressLine,
      },
      discount: Number(data?.discount),
      status: data?.bookingStatus?.value,
      payAt: data?.bookingPlace?.value,
    };

    if (orderNumber || serviceData?.orderNumber) {
      payloadObject.orderNumber = orderNumber || serviceData?.orderNumber;
    }

    postApi(APIS.ADD_EDIT_BOOKING, payloadObject)
      .then((res) => {
        navigate(`/app/bookings/edit/${res?.data?.data?.orderNumber}`);
        setRefresh((prev) => !prev);
        toast.push(<Notification type="success">Booking saved!</Notification>);
      })
      .catch((error) => {
        toast.push(
          <Notification closable type="error" duration={2000}>
            Error saving booking
          </Notification>
        );
      })
      .finally(() => setSubmitting(false));
  };

  return loading ? (
    <div className="flex ">
      <div style={{ width: "65%" }}>
        <Skeleton height={400} />
        <Skeleton height={400} className="mt-3" />
        <Skeleton height={400} className="mt-3" />
      </div>
      <div className="ml-3" style={{ width: "35%" }}>
        <Skeleton height={100} width="100%" />
        <Skeleton height={500} width="100%" className="mt-3" />
      </div>
    </div>
  ) : (
    <Formik
      initialValues={!!editData ? editData : initialValues}
      validationSchema={validation}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, touched, errors, isSubmitting, setFieldValue }) => {
        return (
          <Form>
            <FormContainer>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                <div className="lg:col-span-2">
                  <BookingDate
                    {...{
                      orderNumber,
                      touched,
                      errors,
                      values,
                      setFieldValue,
                    }}
                  />
                  <BookingService
                    {...{
                      orderNumber,
                      touched,
                      errors,
                      values,
                      setFieldValue,
                      setTaxes,
                      onServicePress,
                      onPackagePress: serviceData,
                    }}
                  />
                  <BookingPackage
                    {...{
                      orderNumber,
                      touched,
                      errors,
                      values,
                      setFieldValue,
                      onPackagePress,
                      setTaxes,
                      onServicePress: serviceData,
                    }}
                  />
                  <BookingProfessionals
                    {...{ orderNumber, touched, errors, values, setFieldValue }}
                  />
                  <PriceBreakup
                    {...{
                      orderNumber,
                      touched,
                      errors,
                      values,
                      setFieldValue,
                      taxes,
                      selectedCoupon,
                      editData,
                      onServicePress: serviceData,
                      totalAmount,
                    }}
                  />
                </div>
                <div className="lg:col-span-1">
                  <PrimaryContactFields
                    {...{
                      touched,
                      errors,
                      values,
                      setFieldValue,
                      setTaxes,
                      orderNumber,
                      editData,
                    }}
                  />

                  <Coupon
                    {...{
                      touched,
                      errors,
                      values,
                      setTaxes,
                      setFieldValue,
                      onDiscountPress,
                    }}
                  />
                  <OrderNotes
                    {...{ orderNumber, touched, errors, values, setFieldValue }}
                  />
                  {/* {orderNumber && (
                    <BookingDiscount
                      {...{
                        orderNumber,
                        touched,
                        errors,
                        values,
                        setFieldValue,
                      }}
                    />
                  )}
                  <PaymentGatway
                    {...{ orderNumber, touched, errors, values, setFieldValue }}
                  />
                  {orderNumber && (
                    <MannualPayment
                      {...{
                        orderNumber,
                        touched,
                        errors,
                        values,
                        setFieldValue,
                      }}
                    />
                  )}
                  <PaymentLog
                    {...{ orderNumber, touched, errors, values, setFieldValue }}
                  />*/}
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
                    onClick={() => navigate("/app/bookings")}
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
                    disabled={statusDisabled(
                      editData?.bookingStatus?.value,
                      values.date
                    )}
                  >
                    Save Booking
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

export default AddEditBooking;
