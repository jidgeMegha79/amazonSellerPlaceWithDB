import React from "react";
import axios from "axios";
import { useState } from "react";

function Dashboard(){  

    const accessToken = JSON.parse(localStorage.getItem('amazon-user-token')); 

      function getFinanceDetail(){
        axios.post("http://localhost:3002/api/userFinanceData",{
         accessToken : accessToken.access_token
         
        }).then(response => {
          console.log(response); 
          console.log(response.data.payload.FinancialEvents); // Access the financial events data
          // Process the data as needed
        }).catch(error => {
          console.error(error);
          // Handle errors
        });
     }
     
    return(
        <div>
            <button onClick={getFinanceDetail}>getdata</button>
        </div>
    );
}
export default Dashboard;