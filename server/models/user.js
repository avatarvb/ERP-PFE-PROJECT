const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// email validation
var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        index: true,
        required: [true, "Email address is required"],
        trim: true,
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    createdEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]
    /*roles: {
        role: [],
    },
    companies: [{
        id: {
            id: mongoose.Schema.Types.ObjectId,
        }
    }],
    departments: [{
        departments_id: mongoose.Schema.Types.ObjectId,
        from_date: Date,
        to_date: Date
    }],
    applications: [{
        id: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        allow: Number // 777 read, write, execute
    }]*/
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);