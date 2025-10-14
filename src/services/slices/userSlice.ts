import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  registerUserApi,
  TRegisterData,
  TLoginData
} from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';

export interface UserState {
  isAuthChecked: boolean;
  data: TUser | null;
  loginUserError: string | null;
  loginUserRequest: boolean;
}

export const initialState: UserState = {
  isAuthChecked: false,
  data: null,
  loginUserError: null,
  loginUserRequest: false
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.data = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message || 'Login failed';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.data = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  }
});

export const { authChecked } = userSlice.actions;
export default userSlice.reducer;
