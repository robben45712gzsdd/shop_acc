import axios from "axios";

const getFavoriteList = async (params) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/Favorite/GetListFavorite`, { params })
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const addFavorite = async (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/Favorite/AddFavorite`, body)
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const removeFavorite = async (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/Favorite/RemoveFavorite`, body)
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const checkIsFavorite = async (body) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/Favorite/CheckIsFavorite`, body)
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default {
  getFavoriteList,
  addFavorite,
  removeFavorite,
  checkIsFavorite,
};
