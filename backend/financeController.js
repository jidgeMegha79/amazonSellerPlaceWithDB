const axios = require('axios');
const https = require('https');

// Define your finance API URL
const financeApiUrl = 'https://sellingpartnerapi-eu.amazon.com/finances/v0/financialEvents';
let nextPageToken = null;
let startDate ="2023-01-01";
let endDate ="2023-01-31";
let financialEvents = [];
let finalFinanceData = [];

async function getUserFinanceData(access_token) {
  do{
    const params = {
      "PostedAfter": startDate,
      "PostedBefore":endDate,
      'NextToken': nextPageToken,
      "maxResultsPerPage": 100
    };
   try {
    const financialResponse = await axios.get(`${financeApiUrl}`, {
      params: params,
      headers : {
        'Accept': '*/*',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'x-amz-access-token': access_token,
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });
    const jsonString = JSON.stringify(financialResponse, getCircularReplacer());
    const financialEvent = (JSON.parse(jsonString)).data.payload.FinancialEvents;
    financialEvents =financialEvents.concat(financialEvent)

   }catch (error) {
    if (error.response && error.response.status === 400) {
      // Handle the case where the request failed due to invalid input
      console.error("Request failed with invalid input. Retrying in 5 seconds...");
      //await new Promise(resolve => setTimeout(resolve, 5000));
        
    } else {
      // Handle other types of errors
      console.error("Request failed with an error:", error.message);
      throw error; // Re-throw the error to stop the execution
    }
  }
 }
  while(nextPageToken)
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
        const serviceFeeEvent = financialEvents.ServiceFeeEventList?.find(
        (event) => event.AmazonOrderId === data.AmazonOrderId
        );
        serviceFeeItem.MFNPostageFee = parseFloat(serviceFeeEvent?.FeeList.find((fee) => fee.FeeType === 'MFNPostageFee')?.FeeAmount.CurrencyAmount || 0);
        sum += serviceFeeItem.MFNPostageFee
                        
        data.ShipmentItemList[0].ItemChargeList?.forEach((itemCharge) => {
        serviceFeeItem[itemCharge.ChargeType] = itemCharge.ChargeAmount?.CurrencyAmount || 0;
        sum += parseFloat(itemCharge.ChargeAmount.CurrencyAmount || 0);
        });

        data.ShipmentItemList[0].ItemFeeList?.forEach((itemFee) => {
        serviceFeeItem[itemFee.FeeType] = itemFee.FeeAmount.CurrencyAmount || 0;
        sum += parseFloat(itemFee.FeeAmount.CurrencyAmount || 0);
        });

        data.ShipmentItemList[0].ItemTaxWithheldList?.forEach((itemTax) => {
        serviceFeeItem[itemTax.TaxesWithheld[0].ChargeType] =
            itemTax.TaxesWithheld[0].ChargeAmount.CurrencyAmount;
        sum += parseFloat(itemTax.TaxesWithheld[0].ChargeAmount.CurrencyAmount || 0);
        });

        data.ShipmentItemList[0].PromotionList?.forEach((promotionList) => {
        promotionAmount += parseFloat(promotionList.PromotionAmount.CurrencyAmount || 0);
        sum += parseFloat(promotionAmount)
        });
        serviceFeeItem["promotionAmount"] = promotionAmount;
        serviceFeeItem["amountReceived"] = (sum).toFixed(2) ;
        serviceFeeItem["costPrice"] = 100;
        serviceFeeItem["sellingPrice"] = (serviceFeeItem.Principal + serviceFeeItem.Tax).toFixed(2) || 0
        serviceFeeItem["profit"] = (serviceFeeItem.amountReceived - serviceFeeItem.costPrice).toFixed(2) || 0 
        serviceFeeItem["taxes"] = (serviceFeeItem.sellingPrice - serviceFeeItem.amountReceived).toFixed(2) || 0        
        
        finalFinanceData.push(serviceFeeItem)
   
        })
      });
        //create new array of object with required data to table
        const recordsToInsert = finalFinanceData.map(event => ({
            userId:"Highgrade",
            AmazonOrderId : event.AmazonOrderId,
            postedDate: event.PostedDate,
            sellerSku:event.sellerSku,
            quantity:event.QuantityShipped,
            sellingPrice:event.sellingPrice,
            taxes:event.taxes,
            profit:event.profit,
            costPrice :event.costPrice,
            amountReceived:event.amountReceived
          }));

        // let refundList = financialEvents.RefundEventList.map((data)=>{
        //     return{
        //         AmazonOrderId : data.AmazonOrderId,
        //         PostedDate : data.postedDate,
        //         sellerSku : data.ShipmentItemAdjustmentList[0].SellerSKU,
        //         QuantityRefund : data.ShipmentItemAdjustmentList[0].QuantityShipped,
        //         RefundCommission : data.ShipmentItemAdjustmentList[0].ItemFeeAdjustmentList[2].FeeAmount.CurrencyAmount            
        //     }
        //})    
        return recordsToInsert;
            
}
function getCircularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return; // Omit circular references
        }
        seen.add(value);
      }
      return value;
    };
  } 

module.exports = { getUserFinanceData };
