import axios from 'axios'

const BASE_URL="https://places.googleapis.com/v1/places:searchNearby";
// const API_KEY="AIzaSyDbkBRNcFZ-9PqE10_PdhhwQMcZaZlEItU";
const API_KEY1="AIzaSyDTYD4DNXMdQCRcjy0-ePWn5OpM0Ggki54";

const config={
  headers:{
    'Content-Type':'application/json',
    'X-Goog-Api-Key':API_KEY1,
    'X-Goog-FieldMask':['places.displayName','places.formattedAddress','places.shortFormattedAddress','places.location','places.evChargeOptions','places.photos','places.rating','places.currentOpeningHours','places.businessStatus','places.nationalPhoneNumber']
  }
}

// const NewNearByPlace=async(data)=>{
//   console.log("data hu",data);
//   try{

//     const response =await axios.post(BASE_URL,data,config);
//     console.log("response",response);
//   }catch(error){
    
//     console.log("error",error);
//   }
//    return response;
// };

// export default{
//   NewNearByPlace
// }

const NewNearByPlace=(data)=>axios.post(BASE_URL,data,config);

export default{
  NewNearByPlace,
  API_KEY1
}