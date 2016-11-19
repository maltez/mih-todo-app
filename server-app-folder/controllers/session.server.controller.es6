const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Session = mongoose.model('Session');
const User = mongoose.model('User');

exports.getUserBySession = (req, res) => {
    Session.findOne({'_id': req.params.sessionID}, (err, data) => {
        if(err){
            res.json(err);
        }
        // TODO Remove this crap! 
        // https://github.com/Automattic/mongoose/issues/1975
        let output = data.session.toString();
        console.log(output);
        let regex = /"user":"([0-9a-zA-Z]+)"/g; 
        let userId = regex.exec(output)[1];
        if (userId){
            User.findOne({'_id':userId}, (error, userData) => {
                if(error){
                    res.json(error);
                }
                res.json(userData);
            });
        }
    });
} 
