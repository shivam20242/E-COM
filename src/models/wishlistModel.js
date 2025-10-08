import mongoose from "mongoose"

const { Schema } = mongoose
const wishlistSchema = new Schema(
    {
        user:{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        products:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            }
        ]
    },
    {timestamps: true}
)

export default mongoose.model("Wishlist", wishlistSchema)