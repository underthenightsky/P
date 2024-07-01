import { configureStore } from "@reduxjs/toolkit";
import scriptReducer from "./scriptSlice";


const MyStore = configureStore({
    reducer:scriptReducer      
    
});

export default  MyStore;

// Reducer-> Store -> Provider -> App