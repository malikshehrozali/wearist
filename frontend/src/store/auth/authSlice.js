import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; 
import axios from "axios";
import { toast } from "sonner";

const initialState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    isAuthenticated:localStorage.getItem('isAuthenticated') ? JSON.parse(localStorage.getItem('isAuthenticated')) : false,
    loading:false,
}

export const registerUser = createAsyncThunk("auth/register", async (formData)=>{
    try {
        const res = await axios.post("/api/users", formData, {withCredentials:true})  
        return res.data; 
    } catch (error) {
        toast.error(error.response.data.message)
    }  
});
export const loginUser = createAsyncThunk("auth/login", async (formData)=>{
    try {
        const res = await axios.post("/api/users/login", formData, {withCredentials:true})  
        return res.data; 
    } catch (error) {
        toast.error(error.response.data.message)
    }  
});
export const logoutUser = createAsyncThunk("auth/logout", async()=>{
    try {
        const res = await axios.post("/api/users/logout", {withCredentials:true})  
        return res.data; 
    } catch (error) {
        toast.error(error.response.data.message)
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        setUser:()=>{}
    },
    extraReducers:(builder)=>{
        builder.addCase(registerUser.pending, (state)=>{
            state.loading = true;
        }),
        builder.addCase(registerUser.fulfilled, (state, action)=>{
            state.loading = false;
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
            const expiresIn = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
            localStorage.setItem("expiration time", expiresIn)
            state.isAuthenticated = true;
            localStorage.setItem('isAuthenticated', JSON.stringify(true));
        }),
        builder.addCase(registerUser.rejected, (state)=>{
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
        }),
        builder.addCase(loginUser.pending, (state)=>{
            state.loading = true;
        }),
        builder.addCase(loginUser.fulfilled, (state, action)=>{
            state.loading = false;
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
            const expiresIn = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
            localStorage.setItem("expiration time", expiresIn)
            state.isAuthenticated = true;
            localStorage.setItem('isAuthenticated', JSON.stringify(true));
        }),
        builder.addCase(loginUser.rejected, (state)=>{
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
        }),
        builder.addCase(logoutUser.pending, (state)=>{
            state.loading = true;
        }),
        builder.addCase(logoutUser.fulfilled, (state, action)=>{
            state.loading = false;
            state.user = action.payload;
            localStorage.removeItem('user')
            state.isAuthenticated = false;
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('expiration time');
        }),
        builder.addCase(logoutUser.rejected, (state)=>{
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
        })
    }
})

export const {setUser} = authSlice.actions;
export default authSlice.reducer;