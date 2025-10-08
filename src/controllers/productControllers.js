import Product from "../models/Product.js"

//create Product
export const createProduct = async(req, res) =>{
    try {
        const product = await Product.create(req.body)
        res.status(201).json({
            success:true,
            message:"Product Created Successfully",
            product
        });
    } catch (error) {
        res.status(400).json({
            success:false,
            message:`Error in Creating Product ${error.message}`
        })
    }
} 

// 📄 Get All Products (with filters, search, pagination)
export const getAllProducts = async (req, res) => {
  try {
    const { search, category, brand, minPrice, maxPrice, sort } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" }; // case-insensitive
    }
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let products = Product.find(query);

    // Sorting
    if (sort) {
      const sortBy = sort.split(",").join(" ");
      products = products.sort(sortBy); // e.g. ?sort=price,-rating
    } else {
      products = products.sort("-createdAt");
    }

    const result = await products;
    res.json({ success: true, count: result.length, products: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//getSingleProductById
export const getProductById = async(req, res) =>{
  try {
    const product = await Product.findById(req.params.id);
    if(!product){
      return res.status(400).json({
        success:false,
        message:"Product Not Found"
      })
    }
    res.json({success:true, product})
  } catch (error) {
    res.status(500).json({success:false, message:`Error in getttingSingleProduct ${error.message}`})
  }
}

//Update Products
export const updateProduct = async(req, res)=>{
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, 
      runValidators:true
    });
    if(!product){
      return res.status(404).json({
        success:false,
        message:"Product Not Found"
      })
    }

    res.json({success:true, message:"Product Updated", product})
  } catch (error) {
    res.status(500).json({success:false, message:`Getting Error in UpdateProduct ${error.message}`})
  }
}

//Delete Products
export const deleteProduct = async(req, res)=>{
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if(!product){
      return res.status(404).json({success:false, message:"Product Not Found"})
    };
    res.json({success:true, message:"Product Deleted Successfully "})
  } catch (error) {
    res.status(500).json({success:false, message:`Error in Deleting Product ${error.message}`})
  }
}

//addReviewToProduct
export const addReviewToProduct = async(req, res) =>{
  try {
    const {rating, comment, author} = req.body
    const product = await Product.findById(req.params.id);

    if(!product){
      res.status(404).json({success:false,message:"Product Not Found"})
    }

    const newReview = {
      rating,
      comment,
      author,
      date: new Date()
    };

    product.reviews.push(newReview);

    //update Rating Stats;
    product.reviewCount = product.reviews.length;
    product.averageRating = product.reviews.reduce((acc, r)=> acc + r.rating, 0) / product.reviewCount;

    await product.save();

    res.status(201).json({
      success:true,
      message:"Review Added Successfully",
      product
    })
  } catch (error) {
    res.status(500).json({success:false, message:`Error in AddingReview ${error.message}`})
  }
}

//Get Top Rated Product using Aggregate
export const getTopRatedProduct = async(req, res) =>{
  try {
    const topProducts = await Product.aggregate([
      {$match:{ averageRating: {gte:4}}},
      {$sort: {averageRating: -1, reviewCount: -1}},
      {$limit: 5},
      {
        $project:{
          name:1,
          brand:1,
          averageRating:1,
          reviewCount:1,
          price:1
        }
      }
    ]);

    res.status(200).json({ success:true, count:topProducts.length, topProducts})
  } catch (error) {
    res.status(500).json({status:false, success:`Getting in Listing Top rated Products ${error.message}`})
  }
}

// 🧮 Category Stats (Aggregation Example)
export const getCategoryStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          averagePrice: { $avg: "$price" },
          averageRating: { $avg: "$averageRating" },
          totalStock: { $sum: "$stockQuantity" }
        }
      },
      { $sort: { averageRating: -1 } }
    ]);

    res.status(200).json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
