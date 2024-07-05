import axios from "axios";
import { BASE_URL } from "../constant.js";


const axiosinstance = axios.create()

axiosinstance.baseURL =BASE_URL;
axiosinstance.defaults.withCredentials = true;

export default axiosinstance