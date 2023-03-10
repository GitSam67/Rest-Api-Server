const mongoose = require("mongoose");
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;

// Adding a sub schema 
const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
},{
    timestamps: true
    }
);

// Adding a main schema to our database..
const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default:false      
    },
    comments: [ commentSchema ]
},  {
   timestamps: true
});

var dishes = mongoose.model("dish", dishSchema);

module.exports = dishes;
