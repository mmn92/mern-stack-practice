import axios from 'axios';
import { returnErrors } from './errorActions';
import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS
} from './types';

export const register = ({ name, email, password }) => dispatch => {
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };

  const body = JSON.stringify({ name, email, password });

  axios
    .post('./api/users', body, config)
    .then(res => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL')
      );
      dispatch({
        type: REGISTER_FAIL
      });
    });
};

export const loadUser = () => (dispatch, getState) => {
  // Sends an action to the store to activate authReducer
  dispatch({ type: USER_LOADING });

  // Sends a request to authenticate user
  axios
    .get('/api/auth/user', tokenConfig(getState))
    .then(res =>
      dispatch({
        type: USER_LOADED,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR
      });
    });
};

export const login = ({ email, password }) => dispatch => {
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };

  const body = JSON.stringify({ email, password });

  axios
    .post('./api/auth', body, config)
    .then(res => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL')
      );
      dispatch({
        type: LOGIN_FAIL
      });
    });
};

export const logout = () => {
  return {
    type: LOGOUT_SUCCESS
  };
};

// Setup config/headers and token
export const tokenConfig = getState => {
  /*
    getState returns the object defined in the reducers index.js:
      {
        item: itemReducer,
        error: errorReducer,
        auth: authReducer
      }
    each value is an object returned by the respective reducer in their files
  */
  const token = getState().auth.token;

  // Create header to send
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };

  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return config;
};
