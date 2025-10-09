import Cart from "../models/cartModel.js";
import Product from "../models/Product.js";

//add To Cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // 1️⃣ Check product availability
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // 2️⃣ Check if requested quantity exceeds stock
    if (quantity > product.stockQuantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stockQuantity} items available in stock`
      });
    }

    // 3️⃣ Find user’s cart or create new
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // 4️⃣ Check if product already exists in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stockQuantity) {
        return res.status(400).json({
          success: false,
          message: `Cannot add ${quantity} more. Only ${product.stockQuantity - existingItem.quantity} items left in stock.`
        });
      }

      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    res.status(201).json({
      success: true,
      message: "Product added to cart successfully",
      cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in adding to cart: ${error.message}`
    });
  }
};

//update Cart
export const updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (quantity > product.stockQuantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stockQuantity} items in stock`
      });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error updating cart: ${error.message}`
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'name price images stockQuantity brand category'
    });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    // 🧮 Calculate subtotal per item & total
    let total = 0;
    const items = cart.items.map((item) => {
      const subtotal = item.quantity * item.product.price;
      total += subtotal;
      return {
        product: item.product,
        quantity: item.quantity,
        subtotal
      };
    });

    res.status(200).json({
      success: true,
      message: 'Cart fetched successfully',
      cart: {
        user: cart.user,
        items,
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error fetching cart: ${error.message}`
    });
  }
};

// ❌ Remove Item
export const removeFromCart = async (req, res) =>{
    try {
        const {userId, productId} = req.body;

        const cart = await Cart.findOne({ user: userId});

        if(!cart){
            return res.status(404).json({success: false, message:"Cart not Found"})
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        await cart.save();

        res.status(200).json({ success: true, message: "Removed from Cart", cart});
    } catch (error) {
        res.status(500).json({success: false, message:`Error in removing Cart ${error.message}`})
    }
}

