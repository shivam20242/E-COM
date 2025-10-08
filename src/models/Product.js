import mongoose from "mongoose";

const { Schema } = mongoose;

const imageSchema = new Schema({
  url: {
    type: String,
    required: true,
    validate: {
      validator: v => /^(http|https):\/\/[^ "]+$/.test(v),
      message: props => `${props.value} is not a valid URL!`
    }
  },
  altText: String,
  isPrimary: {
    type: Boolean,
    default: false
  }
});

const reviewSchema = new Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  comment: String,
  author: String,
  date: {
    type: Date,
    default: Date.now
  }
});

const offerSchema = new Schema({
  seller: String,
  price: {
    type: Number,
    min: 0
  },
  shippingCost: {
    type: Number,
    min: 0,
    default: 0
  }
});

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    category: String,
    brand: String,
    model: String,
    sku: String,
    upc: String,

    // 💰 Pricing
    price: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: "USD"
    },
    salePrice: {
      type: Number,
      min: 0
    },

    // 📦 Stock & Availability
    availability: {
      type: String,
      enum: ["InStock", "OutOfStock", "PreOrder", "Discontinued"],
      default: "InStock"
    },
    stockQuantity: {
      type: Number,
      min: 0,
      default: 0
    },

    // 🖼️ Images
    images: [imageSchema],

    // 🧾 Product Info
    features: [String],
    specifications: {
      type: Map,
      of: String
    },

    // 📐 Physical Details
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ["cm", "inch", "m"]
      }
    },
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ["g", "kg", "lb", "oz"]
      }
    },

    // 🎨 Variations
    color: [String],
    size: [String],
    material: String,

    // ⭐ Reviews
    reviews: [reviewSchema],
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    reviewCount: {
      type: Number,
      min: 0,
      default: 0
    },

    // 🌐 Links
    url: String,
    tags: [String],
    relatedProducts: [String],

    // 🛒 Offers
    offers: [offerSchema],

    // 🧾 Additional Info
    warranty: String,
    releaseDate: Date
  },
  {
    timestamps: true
  }
);

// 🧮 Pre-save middleware to auto-update ratings
productSchema.pre("save", function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.averageRating = total / this.reviews.length;
    this.reviewCount = this.reviews.length;
  } else {
    this.averageRating = 0;
    this.reviewCount = 0;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
