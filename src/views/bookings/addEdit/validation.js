import { object, string, mixed, number } from "yup";

export default object().shape({
  email: string().required("Required").email(),
  slot: mixed().required("Slot is required"),
  phoneNumber: string().required("Required"),
  location: mixed().required("Required"),
  bookingPlace: mixed().required("Required"),
  houseNumber: string().when("location.value", {
    is: 1,
    then: string().required("Required"),
    otherwise: string().notRequired(),
  }),
  city: string()
    .transform((value, originalValue) => {
      if (typeof value === "object") {
        return value.name;
      }
      return originalValue;
    })
    .when("location.value", {
      is: 1,
      then: string().required("City name is required"),
      otherwise: string().notRequired(),
    }),
  state: string()
    .transform((value, originalValue) => {
      if (typeof value === "object") {
        return value.name;
      }
      return originalValue;
    })
    .when("location.value", {
      is: 1,
      then: string().required("State name is required"),
      otherwise: string().notRequired(),
    }),
  addressLine: string().when("location.value", {
    is: 1,
    then: string().required("Required"),
    otherwise: string().notRequired(),
  }),
  pinCode: number().when("location.value", {
    is: 1,
    then: number().required("Required"),
    otherwise: number().notRequired(),
  }),
  // services: array()
  //   .of(
  //     object().shape({
  //       serviceId: mixed().required("Service is required"),
  //     })
  //   )
  //   .min(1, "At least one service must be added"),
  // packages: array()
  //   .of(
  //     object().shape({
  //       packageId: mixed().required("Package is required"),
  //     })
  //   )
  //   .min(1, "At least one package must be added"),
});
