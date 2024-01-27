const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
    },
});

// Set the order value automatically before saving a new banner
BannerSchema.pre("save", async function (next) {
    if (!this.order) {
        const count = await mongoose.model("Banner").countDocuments({});
        this.order = count + 1;
    }
    next();
});

const Banner = mongoose.model("Banner", BannerSchema);

module.exports = Banner;
