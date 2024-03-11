const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var toppingSchema = new Schema({
    type:{
        type: String,
        required: true
    },
    price_extra: {
        type: Currency,
        required: true
    }
});

var cakeSchema = new Schema({
    type:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    price:{
        type: Currency,
        required: true
    },
    topping: [toppingSchema]
}, {
    timestamps: true
});

var Cakes = mongoose.model('Cake', cakeSchema);
module.exports = Cakes;