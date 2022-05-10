const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

//middleWare
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fhftc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        await client.connect();
        const productCollection = client.db('warehouse').collection('products');

        //get all the products from Database
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

      
        //get one product with id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })


        //deliver a product
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedQuantity = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatesDoc = {
                $set: {
                  quantity: updatedQuantity.quantity,
                }
            };

            const result = await productCollection.updateOne(filter, updatesDoc, options);
            res.send(result);
        })
        
        
       //delete a item from inventory
       app.delete('/products/:id', async(req, res) =>{
           const id = req.params.id;
           const query = {_id: new ObjectId(id)};
           const result = await productCollection.deleteOne(query);
           res.send(result);
       }) 
    
     

        //add product
        app.post('/products', async(req, res)=>{
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Running My server')
})

app.listen(port);
