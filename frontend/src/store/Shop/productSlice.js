import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

const initialState = {
    isLoading: false,
    productList: [],

}

export const createProduct = createAsyncThunk("admin/createProducts", async (formData)=>{
    try {
        const product = await axios.post("/api/products", formData, {withCredentials:true, headers: { "Content-Type": "multipart/form-data" }});
        return product.data;
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message)
    }
});

export const updateProduct = createAsyncThunk("admin/updateProducts", async ({id, formData})=>{
    try {
        const product = await axios.post(`/api/products/${id}`, formData, {withCredentials:true, headers: { "Content-Type": "multipart/form-data" }});
        return product.data;
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message)
    }
});

export const deleteProduct = createAsyncThunk("admin/deleteProducts", async (id)=>{
    try {
        const product = await axios.delete(`/api/products/${id}`);
        return product.data;
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message)
    }
})
export const fetchProducts = createAsyncThunk("admin/fetchProducts", async ()=>{
    try {
        const products = await axios.get("/api/products");
        return products.data;
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message)
    }
})

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setProducts: ()=>{}   
    },
    extraReducers:(builder)=>{
        builder.addCase(createProduct.pending, (state)=>{
            state.isLoading = true;
        });
        builder.addCase(createProduct.fulfilled, (state, action)=>{
            state.isLoading = false;
            console.log("createProduct response:", action.payload);
            state.productList.push(action.payload);
        });
        builder.addCase(createProduct.rejected, (state)=>{
            state.isLoading = false;
        });
        builder.addCase(fetchProducts.pending, (state)=>{
            state.isLoading = true;
        });
        builder.addCase(fetchProducts.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.productList = action.payload;
        });
        builder.addCase(fetchProducts.rejected, (state)=>{
            state.isLoading = false;
        });
        builder.addCase(deleteProduct.pending, (state)=>{
            state.isLoading = true;
        });
        builder.addCase(deleteProduct.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.productList = action.payload ? state.productList.filter((product) => product._id !== action.payload._id) : state.productList;
        });
        builder.addCase(deleteProduct.rejected, (state)=>{
            state.isLoading = false;
        });
        builder.addCase(updateProduct.pending, (state)=>{
            state.isLoading = true;
        });
        builder.addCase(updateProduct.fulfilled, (state, action)=>{
            state.isLoading = false;
            if (action.payload) {
                state.productList = state.productList.map((product) =>
                product._id === action.payload._id ? action.payload : product
            );
        }
        });
        builder.addCase(updateProduct.rejected, (state)=>{
            state.isLoading = false;
        });
    }
})

export const {setProducts} = productSlice.actions
export default productSlice.reducer;