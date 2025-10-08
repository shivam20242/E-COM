import wishlistModel from "../models/wishlistModel.js";


// ❤️ Add to Wishlist
export const addToWishList = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let wishlist = await wishlistModel.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new wishlistModel({ user: userId, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    res.status(201).json({ success: true, message: "Added to wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get Wishlist
export const getWishlist = async (req, res) =>{
    try {
        const { userId } = req.params;

        const wishlist = await wishlistModel.findOne({user: userId}).populate("products");

        if(!wishlist){
            return res.status(400).json({success: false, message:"Wishlist Empty"})
        }
        res.status(200).json({
            success:true, wishlist
        })
    } catch (error) {
        res.status(500).json({success:false, message:`Error in getting Wishlist`})
    }
}

//Remove From Wishlist
export const removeFromWishlist = async(req, res) =>{
    try {
        const { userId, productId} = req.body;

        const wishlist = await wishlistModel.findOne({user: userId});

        if(!wishlist){
            return res.status(404).json({success:false, message:"Wishlist Not Found"})
        }

        wishlist.products = wishlist.products.filter((p)=>p.toString() !== productId);

        await wishlist.save();
        res.status(200).json({success:true, message:"Remove From Wishlist"})
    } catch (error) {
        res.status(500).json({success:false, message:`Error in getting Remove from wishlist ${error.message}`})
    }
}