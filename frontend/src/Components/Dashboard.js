import React from "react";
import axios from "axios";
import { useState } from "react";


function Dashboard(){  

    const accessToken = JSON.parse(localStorage.getItem('amazon-user-token')); 

      function getFinanceDetail(){
        axios.post("http://localhost:3003/api/userFinanceData",{
         accessToken : accessToken.access_token
         
        }).then(response => {
          console.log(response); 
          //console.log(response.data.payload.FinancialEvents); // Access the financial events data
          // Process the data as needed
        }).catch(error => {
          console.error(error);
          // Handle errors
        });
     }

     function getOrderData(){
      axios.post("http://localhost:3003/api/userOrderData",{
        accessToken :  accessToken.access_token
      }).then(response=>{
        console.log(response); 
      }).catch(error=>{
        console.log(error)
      })
     }     
    return(
        <div>
            <button onClick={getFinanceDetail}>getFinancedata</button>
            <button onClick={getOrderData}>getAllOrder</button>
        </div>
    );
}
export default Dashboard;