import { findDiffDays, roundedToFixed } from "./helpers";

// Function to calculate subTotal without discount and without addition of GST
export const subTotalPrice = (args = {}) => {
  const { isWithoutPackage = false, values } = args;
  const { services, packages } = values;

  let combinedServicesPrice = 0;
  let combinedPackagesPrice = 0;

  for (let packageIndex = 0; packageIndex < packages?.length; packageIndex++) {
    combinedPackagesPrice += packages?.[packageIndex]?.packageId?.price || 0;
  }

  for (let serviceIndex = 0; serviceIndex < services?.length; serviceIndex++) {
    combinedServicesPrice += services?.[serviceIndex]?.serviceId?.price || 0;
  }

  if (isWithoutPackage) {
    return combinedServicesPrice;
  }

  return combinedServicesPrice + combinedPackagesPrice;
};

const calculateDiscount = (values) => {
  const subTotal = subTotalPrice({ values });
  const roundDiscount = roundedToFixed(
    (values?.discount * 100) / subTotal, // converted into round amount for calculation
    4
  );

  if (values?.discount > subTotal) values.discount = subTotal;

  let discount = values?.discount
    ? (values?.discount * 100) / subTotal / 100
    : 0;

  if (values?.couponId?.type === 1) {
    // type 1 for percentage discount
    discount = (values?.discount || 0) / 100;
  } else if (values?.couponId?.type === 2) {
    // type 2 for flat discount
    discount = roundDiscount / 100;
  }
  return discount;
};

// Main function to calculate the amount
export const calculateAmount = (args = {}) => {
  const {
    isGst = false,
    isDiscount = false,
    isRoundOff = false,
    isTaxable = false,
    values,
  } = args;

  let tax = args?.values?.tax?.length
    ? [...args?.values?.tax]
    : args?.tax?.length
    ? args?.tax
    : [];

  const discount = calculateDiscount(values);
  const { services, packages } = values;
  const subTotal = subTotalPrice({ values });

  let combinedServicesPriceDiscount = 0;
  let combinedPackagesPriceDiscount = 0;

  for (let packageIndex = 0; packageIndex < packages?.length; packageIndex++) {
    const { packageId } = packages?.[packageIndex];
    const { price: packagePrice } = packageId;
    combinedPackagesPriceDiscount += discount * packagePrice;
  }

  for (let serviceIndex = 0; serviceIndex < services?.length; serviceIndex++) {
    const { serviceId } = services?.[serviceIndex];
    const { price: servicePrice } = serviceId;
    combinedServicesPriceDiscount += discount * servicePrice;
  }

  let taxable =
    subTotal - combinedServicesPriceDiscount - combinedPackagesPriceDiscount;

  // Ensure taxable is not negative
  taxable = Math.max(taxable, 0);

  let gstAmounts = tax?.map((taxItem) => {
    const gstAmount =
      taxable > 0
        ? (taxable * (taxItem.taxPrice || taxItem.taxPercentage)) / 100
        : 0;
    return {
      ...taxItem,
      taxAmount: roundedToFixed(gstAmount, 2) || 0,
    };
  });

  if (isTaxable) {
    return taxable;
  }

  if (isGst) {
    const gstForSpecificTax = gstAmounts.find(
      (taxItem) => taxItem._id === args.tax[0]._id
    );
    return gstForSpecificTax ? gstForSpecificTax.taxAmount : 0;
  }

  const totalGst = gstAmounts.reduce(
    (sum, taxItem) => sum + (parseFloat(taxItem.taxAmount) || 0),
    0
  );

  if (isRoundOff) {
    return parseFloat(
      Math.round(taxable + totalGst) - (taxable + totalGst)
    ).toFixed(2);
  }

  if (isDiscount) {
    return combinedServicesPriceDiscount + combinedPackagesPriceDiscount;
  }

  const totalPrice =
    totalGst +
    subTotal -
    combinedServicesPriceDiscount -
    combinedPackagesPriceDiscount +
    parseFloat(Math.round(taxable + totalGst) - (taxable + totalGst));
  return totalPrice;
};
