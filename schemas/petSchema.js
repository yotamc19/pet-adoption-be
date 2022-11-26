const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    img: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    adopStatus: {
        type: String,
        default: '', 
    },
    ownerEmail: {
        type: String,
        required: false,
        default: '', 
    },
    height: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
        required: true,
    }, 
    hypo: {
        type: Boolean,
        required: true,
        default: false, 
    }, 
    dietery: {
        type: Array,
        required: true,
        default: [], 
    }, 
    breed: {
        type: String,
        required: true,
        default: '', 
    }, 
    bio: {
        type: String,
        default: '', 
    }, 
}, { timestamps: true });

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;