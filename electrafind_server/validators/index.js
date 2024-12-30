const cors = require('cors');

const express = require('express');
const app = express();
const routes = require('../routes/index'); // Import the routes index file

// Middleware to parse JSON bodies
app.use(express.json());

// Base API route
app.use('/api', routes);

// Health check route (optional)
app.get('/', (req, res) => {
  res.send('Electric Vehicle Charging System API is running!');
});

// Error handling middleware 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 0;
const appStart = ()=>{
  console.log("e")
    try{
        app.listen(PORT,()=>{
            console.log(`the app is running at http://localhost:${PORT}`)
        })
    }catch(error){
        console.log(`error: ${error.message}`)
        
    }
}

//app start 
appStart()







