import {createSlice } from '@reduxjs/toolkit';

const initialState = {
  datas:  [{
        script : "a_for_apple",
        playAudio : false
    }]
}
const scriptSlice = createSlice({
    name : 'data1',
    initialState  ,
    reducers : { 
        setScript : (state,action) => {
            let temp = state.data;
            temp.map((item,index)=>{
                if(index === 0){
                    item.script = action.payload.script;
                }
                
            })
            state.datas = temp;
        },
        setPlayAudio : (state,action) => {
            let temp = state.data;
            temp.map((item,index)=>{
                if(index === 0){
                    item.playAudio = true;
                }
                
            })
            state.datas = temp;
        }
}}
);

export const {setScript,setPlayAudio} = scriptSlice.actions;
export default scriptSlice.reducer;