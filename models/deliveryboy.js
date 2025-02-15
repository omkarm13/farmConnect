const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeliveryBoySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(value) {
                return /\d{10}/.test(value); // Simple phone number validation
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    location: {
        type: { 
            type: String, 
            enum: ['Point'], 
            default: 'Point' 
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        },
    },
    ordersAssigned: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        default: []
    }],
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexing the location for faster geospatial queries
DeliveryBoySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("DeliveryBoy", DeliveryBoySchema);
