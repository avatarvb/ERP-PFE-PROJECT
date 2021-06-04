const mongoose = require('mongoose');



const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    from: {
        required: true,
        type: Date
    },
    to: {
        required: true,
        type: Date
    },
    owner: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    users: [{
        id: {
            required: true,
            type: mongoose.Schema.Types.ObjectId,
        }
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Event', eventSchema);