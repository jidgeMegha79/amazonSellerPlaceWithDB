import React from "react";
import {useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function  AuthenticateUser(){
  const navigate  = useNavigate()
  const [accessToken, setAccessToken] = useState(null);
  const apiAccessTokenUrl = 'https://api.amazon.com/auth/o2/token';
    //these parameters may change
  const CLIENT_ID = 'amzn1.application-oa2-client.e83297c770ed45b6840bc3f75560a6ef';
  const CLIENT_SECRET = 'amzn1.oa2-cs.v1.135d661469d4c40b95e1cc113c8d66338f4c5842290819e17b4961601d11be41';
  const REFRESH_TOKEN = 'Atzr|IwEBIBMMeOHPVz1pABGpMHtTVbqyEuF6z23UAcwuAnL8pVyebEC2VaPgqmeRhpC6MwQq5BmrWM6wkK72iHn3hPHDe2SH3-GZMrh-CvzDGeBnQ-bPDo74Ph5xFFUCAvrgsgk0FP5i4aQxTNuN4AGglmvNg7xOSfp8697vdY6OtuGhaN6vGmH2rAIq8LWM7P9tQ_0vj9rcUSr40t5no3mhmh4yTpI7HvfWC--57Xp2TaOSs4tI5tUdRUym53XB7jwA-m5TrsyG_JOUo0vQdjFnxfQu6qATji-TMT-L2m10FKKSLJ1McSl_vx794mh21BiB12l35W_aBpwgjWdFW_KzWPfRiZBb'
  const accessTokenBodyParams = {
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: REFRESH_TOKEN
  };  

  const authenticateUser = async () => {
    if (accessToken == null && accessToken == undefined) {
      try {
        const response = await axios.post(apiAccessTokenUrl,accessTokenBodyParams,{
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          }
        );  
        if (response.status === 200) {
          const responseData = response.data;
          localStorage.setItem('amazon-user-token', JSON.stringify(responseData));
          setAccessToken(responseData);
          alert("User authenticated successfully");
          navigate('/dashboard')
        } else {
          console.error('Error authenticating user:', response.statusText);
          alert("Error while generating token");
        }
      }catch (error) {
        console.error('Error authenticating user:', error.message);
        alert("Error while generating token");
      }
    }
  }; 

  return(
   <div className="mt-5">
     <h1>Welcome</h1>
     <button onClick={authenticateUser} className="mt-t bg-success text-white">
         Authenticate User
     </button>
   </div>
  ); 
}
export default AuthenticateUser;