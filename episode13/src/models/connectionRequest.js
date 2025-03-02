const { default: mongoose } = require("mongoose");

const connectionRequestSchema = mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",        //here i am refering to user model...
        required: true,
    },
    toUserId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status : {
        type: String,
        required: true,
        enum : {
            values : ["ignored","intrested","accepted", "rejected"],
            message: `{VALUE} is incorrect status type`  //MANGOOSE will be replace VALUE with the value being validated
        }
    }
},
{
    timestamps : true
})

//indexing is important becz query will be faster
//here we need index on 2 fields so we can use compond index...
connectionRequestSchema.index({ fromUserId: 1 , toUserId: 1 }) //1 is assending order -1 decending order..

//u can add this check in db level also.......
//checking the touserid and fromuserid same? in the schema level using pre
connectionRequestSchema.pre("save", function(next) {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Sending the conncetion request is failed...");
    }
    next();
}) //arrow function ll not wrk here 

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema) 

