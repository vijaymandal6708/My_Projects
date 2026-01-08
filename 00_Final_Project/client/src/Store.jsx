import {configureStore} from '@reduxjs/toolkit';
import myReducer from "./cartSlice";

export const store = configureStore({
    reducer:{
        mycart:myReducer
    }
})
