const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    session: {
        cookie: {
            originalMaxAge:{
                type: Date,
            },
            expires: {
                type: Date,
            },
            secure:{
                type: Boolean,
            },
            httpOnly:{
                type: Boolean
            },
            path:{
                type: String,
            }
    },
        passport:{
            user: {
                type: String
            },
        },
    },
	expires : {
        type: Date,
    }
}, {_id: false});

mongoose.model('Session', SessionSchema);

exports.SessionSchema = SessionSchema;