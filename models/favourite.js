const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favSchema = new Schema({
    clientId:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    dishes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref : "dish"
    }]
}, {
    timestamps : true
});

module.exports = mongoose.model("favourite", favSchema);