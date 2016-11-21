const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Session = mongoose.model('Session');
const User = mongoose.model('User');

exports.getUserBySession = (req, res) => {
    Session.findOne({'_id': req.sessionID}, (err, data) => {
        if(err){
            res.json(err);
            return;
        }

        // TODO Remove this crap! 
        // https://github.com/Automattic/mongoose/issues/1975
        if(!data.session){
            res.json({error:'Session was not established'});
            return;
        }

        let output = data.session.toString();
        
        let regex = /"user":"([0-9a-zA-Z]+)"/g;
        let userInfo = regex.exec(output);
        if(userInfo === null){
            res.status = 403;
            res.json({message: 'Not Authorized'});
            return;
        }

        let userId = userInfo[1];

        if (userId){
            User.findOne({'_id':userId}, (error, userData) => {
                if(error){
                    res.json(error);
                }
                res.json(userData);
                return;
            });
        }
    });
} 
