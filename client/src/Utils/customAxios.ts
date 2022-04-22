import axios from "axios";

const customAxios = (token) =>
  axios.create({headers: {accept: "application/json", Authorization: token}});

export default customAxios;