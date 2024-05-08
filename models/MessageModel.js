const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    to:String,
    from:String,
    message:String
}
,{
    timestamps:true,
}
)

mongoose.model('Message',messageSchema)