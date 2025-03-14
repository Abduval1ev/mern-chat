import { create } from "zustand"
import axiosInstance from "../lib/axios.js"
import toast from "react-hot-toast"
import { data } from "react-router-dom"


export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,

    isChekingAuth: true,
    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check")

            set({ authUser: response.data })
        } catch (error) {
            console.error("Error in checking:", error);
            set({ authUser: null })
        } finally {
            set({ isChekingAuth: false })
        }
    },
    signUp: async (data) => {
        set(({ isSigningUp: true }))
        try {
            const response = await axiosInstance.post("/auth/signup", data)
            set({ authUser: response.data })
            toast.success("Account created successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isSigningUp: false })
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({ authUser: null })
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error(error.response.data.message)

        }
    },
    login: async () => {
        set({ isLoggingIng: true })
        try {
            const response = await axiosInstance.post("/auth/login", data)
            set({ authUser: response.data })
            toast.success("Logged in successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isLoggingIng: false })
        }
    },
    message: async () => { },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.put("/auth/update-profile", data)
            set({ authUser: res.data })
            toast.success("Profile updated successfully")
        } catch (error) {
            console.log("Error in update profile:", error);
            toast.error(error.response.data.message)
        } finally {
            set({ isUpdatingProfile: false })
        }

    },
}))