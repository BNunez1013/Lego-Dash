const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const collectionSchema = new mongoose.Schema({
    set_num: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    num_parts: {
        type: Number,
        required: true,
    },
    image_url: {
        type: String,
        required: true,
    },
    set_url: {
        type: String,
        required: true,
    }
});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Your email address is required"],
        unique: true,
    },
    username: {
        type: String,
        required: [true, "Your username is required"],
    },
    password: {
        type: String,
        required: [true, "Your password is required"],
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    pieceCount: {
        type: Number,
        default: 0
    },
    collection: [collectionSchema],
});

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next(); // Only hash if the password is new or changed
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

module.exports = mongoose.model("User", userSchema);