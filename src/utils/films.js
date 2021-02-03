import moment from "moment";

export const sortByDate = (a, b) => {
  return moment(b.date).format(`YYYYMMDD`) - moment(a.date).format(`YYYYMMDD`);
};

export const sortByRating = (a, b) => {
  return b.rating - a.rating;
};

export const sortByComments = (a, b) => {
  return b.comments.length - a.comments.length;
};
