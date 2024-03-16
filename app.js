const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')

const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors(
    {
        origin: ["https://fitness-future-backend.vercel.app"],
        methods: ["POST", "GET"],
        credentials: true
    }   
))

// mongodb://localhost:27017
//mongodb+srv://punyaniishant:qvkm15E0ILMEMb4N@ishant18.5g4skkh.mongodb.net/
mongoose.connect('mongodb+srv://punyaniishant:qvkm15E0ILMEMb4N@ishant18.5g4skkh.mongodb.net/gymwebsite')
    .then(() => {
        console.log("Database Connected")
      }).catch((err) => {
        console.log("Error while connecting to database",err)
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model("User",userSchema)

app.post('/login', async (req,res)=>{
    const {email, password} = req.body
    const check = await User.findOne({email:email})
    if(check){
        const hashed_password = check.password
        bcrypt.compare(password,hashed_password,function(err,result){
            if(result)
                res.send({message: "Login Successful", user: check})
            else
                res.send({message: "Wrong Password"})
        }) 
    }
    else{
        res.send({message: "User not registered"})
    }
})
app.post('/register', async (req,res)=>{
    const {name, email, password} = req.body
    //HASHING THE PASSWORD
    // bcrypt.genSalt(10, function(err,salt){
    //     bcrypt.hash(password,salt,function(err,hash){
    //         password = hash
    //     })
    // })
    const salt = 10;
    const hash_password = await bcrypt.hash(password,salt)
    const check = await User.findOne({email:email})
    if(check){
        // console.log(check)
        res.send({message: "User already exists."})
    }
    else{
        const user = new User({
            name,
            email,
            password: hash_password
        })
        const registeredUser = user.save()
        res.status(201).send({message: "successfully registered"})
    }
    // console.log(req.body)
})

const formSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    preference: {
        type: String,
        required: true
    }
})

const Form = mongoose.model('Form',formSchema)

app.post('/contact', async (req,res)=>{
    const {name,email,contact,gender,age,height,weight,preference} = req.body
    const exist = await Form.findOne({email:email})
    if(exist){
        console.log(exist)
        res.send({message: "Form already submitted."})
    }
    else{
        const form = new Form({
            name,
            email,
            contact,
            gender,
            age,
            height,
            weight,
            preference
        })
        const registeredForm = form.save()
        res.status(201).send({message: "Successfully submitted", user: exist})
    }
})

const orderSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    orderItems: {
        type: String
    },
    totalItems: {
        type: Number
    },
    totalPrice: {
        type: Number
    }
})

const Order = mongoose.model('Orders',orderSchema)

app.post('/products', async(req,res)=>{
    // console.log("req.body : " + req.body)
    const {name,email,orderItems,totalItems,totalPrice} = req.body
    // console.log('orderString: ' + orderString)
    const place_order = new Order({
        name,
        email,
        orderItems,
        totalItems,
        totalPrice
    })
    const placed_order = place_order.save()
    res.status(201).send({message: 'Order Placed Successfully'})
})

app.listen("4141",()=>{
    console.log("Server started at http://localhost:4141")
})
