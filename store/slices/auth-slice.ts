"use client"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type AuthState = {
  user: { email: string; id: string } | null
}

const initialState: AuthState = {
  user: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; id: string }>) => {
      state.user = { email: action.payload.email, id: action.payload.id }
    },
    register: (state, action: PayloadAction<{ email: string; id: string }>) => {
      state.user = { email: action.payload.email, id: action.payload.id }
    },
    logout: (state) => {
      state.user = null
      // Clear token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
      }
    },
  },
})

export const { login, register, logout } = authSlice.actions
export default authSlice.reducer
