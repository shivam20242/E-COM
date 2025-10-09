import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema({
    type:{
        type: String,
        enum: ["credit", "debit"],
        required: true
    },
    amount:{
        type: Number,
        required: true,
        min: 0
    },
    description:{
        type: String
    },
    reference:{
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const walletSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true, 
        unique: true
    },
    balance:{
        type: Number,
        default: 0
    },
    transactions: [transactionSchema]
},
 { timestamps: true}
)

export default mongoose.model("Wallet", walletSchema);