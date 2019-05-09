import axios from 'axios.js'

axios.$http(url,data)
         .then(response =>{
             console.log(response)
         })
         .catch( error =>{
             console.log("error")
         }) 

export default{

//检测版本
checkversionurl(url='https://min-api.cryptocompare.com/data/pricemulti',data){
   return axios.$http(url,data) 
}
}