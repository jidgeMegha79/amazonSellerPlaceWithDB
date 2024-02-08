const axios = require('axios');
const https = require('https');

const sellerApiUrl = 'https://sellingpartnerapi-eu.amazon.com/orders/v0/orders';
let nextPageToken = null;
const MarketplaceIds = 'A21TJRUUN4KGV';
let startDate ="2023-12-01";
let endDate ="2023-12-15";
let allOrders = [];

async function getUserOrderData(access_token) {
    do{
      const params = {
        'CreatedBefore': endDate,
        'CreatedAfter': startDate,        
        'MarketplaceIds': MarketplaceIds,
        "maxResultsPerPage": 100,
        'NextToken': nextPageToken
      };
      const ordersResponse = await axios.get(`${sellerApiUrl}`, {
        params: params,
        headers:{
            'Accept': '*/*',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'x-amz-access-token':access_token,
           },
           httpsAgent: new https.Agent({ rejectUnauthorized: false })
      });

      const orders = ordersResponse.data.payload.Orders;
      allOrders = allOrders.concat(orders);

      // Check if there are more pages
      nextPageToken = ordersResponse.data.payload.NextToken;
    }while(nextPageToken)
    return allOrders
}
module.exports = { getUserOrderData };