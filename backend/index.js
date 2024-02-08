// Import required modules
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const https = require('https'); 
const { getUserFinanceData } = require('./financeController');
const {getUserOrderData} = require ('./orderController')

// Create an Express application
//use Library
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

// Define a route for the root path
app.get('/', (req, res) => {
  res.send('Hello, World!');
});


//connect to database
const database = mysql.createPool({
  host : "localhost",
  user : "ekalpa",
  password : "Server@123",
  database : "AmazonSellerDatabase"
})
database.getConnection(function(err){
  if(err) throw err;
  console.log("coonected to db")
})

// Start the server on port 3000
const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//for fetching finance data

app.post("/api/userFinanceData",async(req,res)=>{
  const access_token = req.body.accessToken 
    try{
      const financialEvents = await getUserFinanceData(access_token);
      // database.query(insert into)
      console.log(financialEvents)
      financialEvents.forEach(async (record) => {
        try {
          // Assuming 'database' is your MySQL connection pool
          database.query('INSERT INTO financeData SET ?', record,function(err){
            console.log(err)
          });
          //wconsole.log('Record inserted:', record);
        } catch (error) {
          console.error('Error inserting record:', error);
        }
      });
           
    }catch (error) {
        console.error(error);
        res.send(error)
    }          
})

app.post("/api/userOrderData",async(req,res)=>{
  const access_token = req.body.accessToken 
 
    try{
      const orderEvents = await getUserOrderData(access_token);
      console.log(orderEvents)
    }catch(error){
      console.log(error)
      res.send(error)
    }
  })
