const express = require('express')
const mongoose = require('mongoose')


const app = express()
const PORT = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//schema
const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        length: 10,
        
    },
    rating:{
        type: Number,
        required: true,
        Validation: [
            Validation= function(v) {
                return test(v)
                
            },
            {
                message: (props)=>{`${props} must be single disit `}
            }
        ]

    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})


//model
const Product = mongoose.model("Products", productsSchema)

//server connection

const connectDB = async () => {

    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/testProductDB");
        console.log(`db is connected`)
    } catch (error) {
        console.log(error, + "db is not connectes")
        process.exit(1)
    }


}


app.get("/", (req, res) => {
    res.send("<h1>Hello</h1>")
})

//create data
app.post("/products", async (req, res) => {
    try {

        const newProduct = new Product({
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
        })


        const productData = await newProduct.save()
        res.status(200).send(productData)

    } catch (error) {
        res.status(500).send({ message: error })

    }
})
//show datas
// app.get("/products", async (req, res) => {
//     try {
//         const products = await Product.find()
//         if (products) {
//             res.status(200).send(products)
//         } else {
//             res.status(500).send({ message: "product not found" })
//         }

//     } catch (error) {

//         res.status(500).send({ message: error })
//     }

// })
//find data
app.get("/products/:id", async (req, res) => {

    try {
        const id = req.params.id
        const products = await Product.findOne({ _id: id })
        if (products) {
            res.status(200).send(products)
        } else {
            res.status(500).send({ message: "product not found" })
        }

    } catch (error) {

        res.status(500).send({ message: error })
    }

})
//specific data using logic
app.get("/products", async (req, res) => {

    try {
        const price= req.query.price
        let products;
        if (price) {
            products = await Product.find({ price: {$gt: price}}).sort({price:1})

            res.status(200).send(products)
        } else {
            products = await Product.find().countDocuments()
            res.status(200).send(products)
        }

    } catch (error) {

        res.status(500).send({ message: error })
    }

})



//delete
app.delete("/products/:id", async (req,res)=>{
    const id= req.params.id;
    try {
      const products= await Product.deleteOne({_id: id})
      res.status(200).send({
        successful: true,
        message: "id deleted",
        data: products
      })


    } catch (error) {
        res.status(500).send({ message: error })

        
    }
})
// update

app.put("/products/:id", async (req,res)=>{
    
    try {
        const id= req.params.id;
        const products= await Product.updateOne({_id: id}, {$set: {price: 5000}})
        res.status(200).send({
        successful: true,
        message: "product updated",
        data: products
      })




        
    } catch (error) {
        res.status(500).send({ message: error })
        
    }

})
























































app.listen(PORT, async () => {
    await connectDB()
    console.log(`server is running at http://localhost:${PORT}`)
})