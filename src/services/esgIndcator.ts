import axios from "axios";
const BASE_URL = "http://localhost:8080/"

export const getAllDimensions = async () =>{
    const res = await axios.get(BASE_URL+"dimensions ");
    return res;
}


export const getIndicators = async (params:{start:string, end:string}) =>{
    const res = await axios.get(BASE_URL+"indicators", {params})
    return res
}