import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice"
import productReducer from "./Shop/productSlice"
import cartReducer from "./features/cartSlice"

const store = configureStore({
    reducer:{
        auth: authReducer,
        products: productReducer,
        cart: cartReducer
    }
})

export default store