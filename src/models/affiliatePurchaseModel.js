import mongoose from 'mongoose'
const {Schema} = mongoose;

const affiliatePurchaseSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required: true
    },
    affiliateLink:{
        type:String,
        required:true
    },
    commissionAmount:{
        type:Number,
        required: true
    },
    status:{
        type:String,
        enum:["pending", "approved", "rejected"],
        default: "pending"
    },
    orderId:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
}, { timestamps: true}
);

export default mongoose.model("AffiliatePurchase", affiliatePurchaseSchema)