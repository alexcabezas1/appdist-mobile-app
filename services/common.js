import moment from "moment";

const getYears = () => {
  const years = [];
  const dateStart = moment();
  const dateEnd = moment().add(10, "y");
  while (dateEnd.diff(dateStart, "years") >= 0) {
    years.push(dateStart.format("YYYY"));
    dateStart.add(1, "year");
  }
  return years;
};

const timestamp = () => Date.now();
const formatDate = (value) => moment(value).format("DD/MM/YYYY");
const formatDateMonthAndYear = (value) => moment(value).format("MM/YYYY");
const formatDateTime = (value) => moment(value).format("HH:mm:ss DD/MM/YYYY");

export {
  getYears,
  formatDate,
  formatDateMonthAndYear,
  formatDateTime,
  timestamp,
};
