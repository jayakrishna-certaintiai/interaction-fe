import moment from "moment";

function FormatDatetime(apiDate) {
  if (!apiDate) {
    return "";
  }

  const date = new Date(apiDate);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  return new Intl.DateTimeFormat("en-GB", options)
    .format(date)
    .replace(/(\d+)\/(\d+)\/(\d+),/, "$1/$2/$3");
}

export default FormatDatetime;

export function formattedDate(dateString) {
  if (!dateString) {
    return "";
  }
  const formattedDate = moment(dateString).format("DD/MM/YYYY HH:mm:ss");
  if (formattedDate === "Invalid date") {
    return "";
  }
  return formattedDate;
}

export function formattedDateOnly(dateString) {
  if (!dateString) {
    return "";
  }
  const formattedDate = moment(dateString).format("DD/MM/YYYY");
  if (formattedDate === "Invalid date") {
    return "";
  }
  return formattedDate;
}
