import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 1,
    },
    status:{
        type:String,
        enum: ["bank", "upi", "paypal"],
        default:"upi"
    },
    accountDetails: {
        type: Object,
        required: true,
    },
    processedAt:Date,
},
{ timestamps: true}
)

export default mongoose.model("Withdrawal", withdrawalSchema);