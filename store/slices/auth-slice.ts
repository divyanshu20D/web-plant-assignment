"use client"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type AuthState = {
  user: { email: string } | null
}

const initialState: AuthState = {
  user: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string }>) => {
      state.user = { email: action.payload.email }
    },
    register: (state, action: PayloadAction<{ email: string }>) => {
      state.user = { email: action.payload.email }
    },
    logout: (state) => {
      state.user = null
    },
  },
})

export const { login, register, logout } = authSlice.actions
export default authSlice.reducer
