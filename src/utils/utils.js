import dayjs from "dayjs";
export const randomColors = () => {
  const letters = "123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
};

export const daysOptions = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

export const interStateOptions = [
  { label: "False", value: 0 },
  { label: "True", value: 1 },
];

export const openedOptions = [
  { label: "Closed", value: 0 },
  { label: "Opened", value: 1 },
];

export const placeOptions = [
  { label: "At Saloon", value: 0 },
  { label: "At Home", value: 1 },
];

// Function to convert minutes to dayjs time object
export const convertMinutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return dayjs().set("hour", hours).set("minute", mins).format("hh:mm a");
};

export const minutesToTime = (totalMinutes) => {
  if (totalMinutes != null) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  }
  return "";
};

export const formatDate = (sendTime = false) => {
  return sendTime ? `DD MMM YYYY hh:mm a` : `DD MMM YYYY`;
};
