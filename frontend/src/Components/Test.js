import React from "react";
import axios from "axios";
import { useState } from "react";

function Dashboard(){
const [startDate, setStartDate] = useState("2023-11-15"); //for start date
const [endDate, setEndDate] = useState("2023-12-15"); //for end date
    const financeApiUrl = 'https://sellingpartnerapi-eu.amazon.com/finances/v0/financialEvents'

    const accessToken = JSON.parse(localStorage.getItem('amazon-user-token')); 
    const headersV2 = {
     'Accept': '*/*',
     'Access-Control-Allow-Origin': '*',
     'Content-Type': 'application/json',
     'x-amz-access-token': accessToken?.access_token || '',
    };

    let financialEvents =[];
    let allOrders;
    let nextPageToken = null;
    let finalFinanceData=[]

    const getFinanceDetail = async () => {
          do {
            const params = {
              "PostedAfter": startDate,
              "PostedBefore":endDate,
              'NextToken': nextPageToken,
              "maxResultsPerPage": 100
            };
        try{
         const financialResponse = await axios.get(`https://try.readme.io/${financeApiUrl}`, {
            params:params,
            headers: headersV2,
          })
      
          allOrders = financialResponse.data.payload.FinancialEvents; 
          financialEvents =financialEvents.concat(allOrders);
          nextPageToken = financialResponse.data.payload.NextToken;
          
        }
        catch (error) {
            if (error.response && error.response.status === 400) {
              // Handle the case where the request failed due to invalid input
              console.error("Request failed with invalid input. Retrying in 5 seconds...");
              //await new Promise(resolve => setTimeout(resolve, 5000));
              console.log(nextPageToken)
             // maxResultsPerPage = 50 // Wait for 5 seconds before retrying
            } else {
              // Handle other types of errors
              console.error("Request failed with an error:", error.message);
              throw error; // Re-throw the error to stop the execution
            }
          }
    }
        while (nextPageToken)    
          console.log(financialEvents)    
         
          financialEvents.map((financialEvents)=>{
          let serviceFee = financialEvents.ShipmentEventList.map((data) => {
            let sum = 0; // assuming sum is declared somewhere
            let promotionAmount = 0;
            // Initialize the serviceFee object for each iteration
            let serviceFeeItem = {
              AmazonOrderId: data.AmazonOrderId,
              PostedDate: data.PostedDate,
              sellerSku: data.ShipmentItemList[0].SellerSKU,
              QuantityShipped: data.ShipmentItemList[0].QuantityShipped,
              MFNPostageFee: 0 
            };
            //for MFnPostageFee
            const serviceFeeEvent = financialEvents.ServiceFeeEventList.find(
              (event) => event.AmazonOrderId === data.AmazonOrderId
            );
            serviceFeeItem.MFNPostageFee = parseFloat(serviceFeeEvent?.FeeList.find((fee) => fee.FeeType === 'MFNPostageFee')?.FeeAmount.CurrencyAmount || 0);

                             
            data.ShipmentItemList[0].ItemChargeList?.forEach((itemCharge) => {
              serviceFeeItem[itemCharge.ChargeType] = itemCharge.ChargeAmount.CurrencyAmount;
              sum += parseFloat(itemCharge.ChargeAmount.CurrencyAmount || 0);
            });
          
            data.ShipmentItemList[0].ItemFeeList?.forEach((itemFee) => {
              serviceFeeItem[itemFee.FeeType] = itemFee.FeeAmount.CurrencyAmount;
              sum += parseFloat(itemFee.FeeAmount.CurrencyAmount || 0);
            });
          
            data.ShipmentItemList[0].ItemTaxWithheldList?.forEach((itemTax) => {
              serviceFeeItem[itemTax.TaxesWithheld[0].ChargeType] =
                itemTax.TaxesWithheld[0].ChargeAmount.CurrencyAmount;
              sum += parseFloat(itemTax.TaxesWithheld[0].ChargeAmount.CurrencyAmount || 0);
            });
          
            data.ShipmentItemList[0].PromotionList?.forEach((promotionList) => {
              promotionAmount += parseFloat(promotionList.PromotionAmount.CurrencyAmount || 0);
            });
          
            // Assuming sum and promotionAmount are declared somewhere
            serviceFeeItem["promotionAmount"] = promotionAmount;
          
            finalFinanceData.push(serviceFeeItem) // Return the serviceFeeItem object for each iteration
          });
          
          console.log(finalFinanceData); 
        //   let refundList = financialEvents.RefundEventList.map((data)=>{
        //     return{
        //     AmazonOrderId : data.AmazonOrderId,
        //     PostedDate : data.PostedDate,
        //     sellerSku : data.ShipmentItemAdjustmentList[0].SellerSKU,
        //     QuantityRefund : data.ShipmentItemAdjustmentList[0].QuantityShipped,
        //     RefundCommission : data.ShipmentItemAdjustmentList[0].ItemFeeAdjustmentList[2].FeeAmount.CurrencyAmount            
        //     }
        //   })  
        //   console.log(refundList)  
    })     
         }
       
       // getFinanceDetail()
    // console.log(accessToken.access_token)
    //   function getFinanceDetail(){
    //     axios.post("http://localhost:3001/api/userFinanceData",{
    //      accessToken : accessToken.access_token
         
    //     }).then(response => {
    //       console.log(response); 
    //       console.log(response.data.payload.FinancialEvents); // Access the financial events data
    //       // Process the data as needed
    //     }).catch(error => {
    //       console.error(error);
    //       // Handle errors
    //     });
    //  }
     // getFinanceDetail()  
    return(
            <div>
                <button onClick={getFinanceDetail}>getdata</button>
            </div>
    );
}
export default Dashboard;