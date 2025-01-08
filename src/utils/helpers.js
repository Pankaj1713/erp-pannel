import moment from "moment";

export const makeSlug = (str) => {
  str = str.toLowerCase();
  str = str.replace(/[^a-z0-9]+/g, "-");
  str = str.replace(/^-+|-+$/g, "");
  return str;
};

export const formatAmount = (num) => {
  return ` ${(num ?? 0)
    ?.toFixed(2)
    ?.toString()
    ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export const formatListAmount = (num) => {
  return `${num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};
export const roundOffAmount = (num) => {
  return (num % 1).toFixed(2);
};
export const formatBookingAmount = (num) => {
  return `${num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};
// export const formatAddress = (addressLine1, addressLine2,  city, state, zip5) => {
//   let formattedAddress = ''
//   address2 ? formattedAddress = `${addressLine1} ${addressLine2}, ${city}, ${state} ${zip5}` : formattedAddress = `${addressLine1}, ${city}, ${state} ${zip5}`
//   return formattedAddress
// }
export const roundedToFixed = (input, digits) => {
  let rounded = Math.pow(10, digits);
  if (input > 0)
    return parseFloat((Math.round(input * rounded) / rounded).toFixed(digits));
};
export function findDiffDays(obj) {
  const date1 = new Date(obj.checkInDate);
  const date2 = new Date(obj.checkOutDate);
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

export function removeDuplicatesByKey(array, key) {
  const uniqueObjects = [];
  const trackingObject = {};

  for (let i = array.length - 1; i >= 0; i--) {
    const obj = array[i];
    const identifier = obj[key];

    if (!trackingObject[identifier]) {
      trackingObject[identifier] = true;
      uniqueObjects.unshift(obj);
    }
  }

  return uniqueObjects;
}

export function removeObjectsByValue(array, value) {
  return array.filter((obj) => obj?._id?.name !== value);
}

export const statusDisabled = (bookingStatus, bookingDate) => {
  const isPastDate = bookingDate
    ? moment(bookingDate).isBefore(moment(), "day")
    : false;

  if (bookingStatus === 5 || bookingStatus === 6 || isPastDate) {
    return true;
  } else {
    return false;
  }
};

export function getFirstDateOfMonth(date) {
  if (!date || date === " Invalid Date") {
    return true;
  } else {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDate = new Date(year, month, 2);

    const formattedDate = firstDate.toISOString().split("T")[0];
    return formattedDate;
  }
}

export const colorBookingStatus = (status) => {
  switch (status) {
    case 1:
      return {
        bg: "bg-yellow-50 dark:bg-yellow-500/10",
        text: "text-yellow-500 dark:text-yellow-100",
        dot: "bg-yellow-500",
      };
    case 2:
      return {
        bg: "bg-green-50 dark:bg-green-500/10",
        text: "text-green-500 dark:text-green-100",
        dot: "bg-green-500",
      };

    case 3:
      return {
        bg: "bg-orange-100 dark:bg-orange-500/10",
        text: "text-orange-500 dark:text-orange-100",
        dot: "bg-orange-500",
      };

    default:
      return {
        bg: "bg-green-50 dark:bg-green-500/10",
        text: "text-green-500 dark:text-green-100",
        dot: "bg-green-500",
      };
  }
};
