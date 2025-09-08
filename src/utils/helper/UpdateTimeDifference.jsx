import moment from "moment";

export const updateTimeDifference = (data, fieldName) => {
  const validData = data?.filter((item) => item[fieldName]);
  if (validData?.length > 0) {
    const latestUploadTime = validData?.reduce((latest, current) => {
      return moment(latest[fieldName])?.isBefore(moment(current[fieldName]))
        ? current
        : latest;
    })[fieldName];

    return moment(latestUploadTime)?.isValid()
      ? moment(latestUploadTime)?.fromNow()
      : "Time not available";
  }
  return "Just now";
};

export const getTimeDifference = (data, fieldName) => {
  function sortByModifiedDate(data) {
    if (Array.isArray(data)) {
      return data.sort((a, b) => {
        const dateA = new Date(a?.[fieldName]);
        const dateB = new Date(b?.[fieldName]);
        return dateB - dateA;
      });
    } else {
      return [];
    }
  }

  const sortedData = sortByModifiedDate(data);

  if (sortedData && sortedData?.length > 0 && sortedData[0][fieldName]) {
    let latestDate;
    if (moment(sortedData[0][fieldName], "YYYY-MM-DD", true).isValid()) {
      latestDate = moment(sortedData[0][fieldName], "YYYY-MM-DD")
    } else {
      latestDate = moment(sortedData[0][fieldName])
    }

    if (latestDate.isValid()) {
      return {
        difference: latestDate.fromNow(),
        modifiedBy: sortedData[0]["modifiedBy"]
      };
    } else {
      return {
        difference: "Invalid date",
        modifiedBy: sortedData[0]["modifiedBy"]
      };
    }
  } else {
    return "No data available";
  }
}

export const updateTimeDiff = (dateString) => {
  if (!dateString) {
    return "Time not available";
  }

  let uploadTime;
  if (moment(dateString, "YYYY-MM-DD", true).isValid()) {
    uploadTime = moment(dateString, "YYYY-MM-DD");
  } else {
    uploadTime = moment(dateString);
  }

  if (uploadTime.isValid()) {
    return uploadTime.fromNow();
  } else {
    return "Invalid date";
  }
};

export const getDateWithTime = (dateString = new Date()) => {
  // return moment(dateString)?.format("DD/MM/YYYY HH:mm:ss");
  const date = new Date(dateString);
  const formattedDate = `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()} ${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;
  return formattedDate;
};
export const getMonthYear = (date = new Date()) => {
  return moment(date)?.format("DD/MM");
};