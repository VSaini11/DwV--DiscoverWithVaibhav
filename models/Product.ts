import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for this product.'],
        maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description.'],
    },
    image: {
        type: String, // Base64 or URL
        required: [true, 'Please provide an image.'],
    },
    category: {
        type: String,
        required: [true, 'Please specify a category.'],
        enum: ['clothing', 'sneakers', 'footwear', 'fragrances', 'accessories', 'budget-finds'],
    },
    pinterestUrl: {
        type: String,
        required: [true, 'Please provide a Pinterest link.'],
    },
    isTrending: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)
