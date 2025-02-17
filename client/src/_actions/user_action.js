import axios from "axios";
import { LOGIN_USER, REGISTER_USER } from './types';

export function loginUser(dataToSubmit) {
    const responseData = axios.post('/api/users/login', dataToSubmit)
      .then(response => response.data)

    return {
        type: LOGIN_USER,
        payload: responseData
    }
}

export function registerUser(dataToSubmit) {
  const responseData = axios.post('/api/users/register', dataToSubmit)
    .then(response => response.data)

  return {
      type: REGISTER_USER,
      payload: responseData
  }
}