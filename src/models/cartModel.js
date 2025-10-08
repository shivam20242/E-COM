import mongoose from "mongoose";
const { Schema } = mongoose;
const cartSchema = new Schema(
    {
        user:{ type: mongoose.Schema.Types.ObjectId, ref:"User",required: true},
        items:[
            {
            product:{type: mongoose.Schema.Types.ObjectId, ref:"Product", required: true},
            quantity:{type: Number, default: 1, min: 1},
            addedAt: {type: Date, default: Date.now }
            }
        ]
    },
    {timestamps: true}
);
const Cart = mongoose.model("Cart", cartSchema);
export default Cart