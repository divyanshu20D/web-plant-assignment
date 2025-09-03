import { configureStore } from "@reduxjs/toolkit"
import authReducer from "@/store/slices/auth-slice"
import projectsReducer from "@/store/slices/projects-slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
