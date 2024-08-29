const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../Models/UserModel");
const { REBRICKABLE_KEY, TOKEN_KEY } = process.env;

module.exports.Lookup = async (req, res, next) => {
    console.log(REBRICKABLE_KEY);
    try {
        const { search } = req.body;
        console.log(search);
        const apiUrl = "https://rebrickable.com/api/v3/lego/sets/";

        const response = await axios.get(apiUrl, {
            params: {
                search: search,
                key: REBRICKABLE_KEY,
            }
        });

        const legoSetsInfo = response.data.results.map(set => ({
            set_num: set.set_num,
            name: set.name,
            year: set.year,
            num_parts: set.num_parts,
            image_url: set.set_img_url,
            set_url: set.set_url
        }));

        res.status(200).json(legoSetsInfo);
    } catch (error) {
        console.log("Error fetching data from API: ", error.message);
        res.status(500).json({error: "Failed to get data from API"});
    }
};

module.exports.addSet = async (req, res, next) => {
    try {
        //get cookie token from request to verify user
        const token = req.cookies.token;

        //check token existance to verify user
        if (!token) {
            return res.status(401).json({message: "Authentication required"});
        }

        //verify token using secret key
        const decoded = jwt.verify(token, TOKEN_KEY);
        //extract user_id from decoded token
        const userId = decoded.id;
        console.log(userId);

        //query database for user mathcing user_id
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        //extract lego set details from req body
        const {set_num, name, year, num_parts, image_url, set_url } = req.body;

        //add set to users collection
        user.collection.push({set_num, name, year, num_parts, image_url, set_url});

        //saves changes made to collection
        await user.save();

        res.status(201).json({ message: "Set added to your collection successfully!", success: true });
        console.log("Set added to your collection successfully!");
        next();
    } catch (error) {
        console.error("Error adding set to collection", error.message);
        res.status(500).json({error: "Failed to add set to collection"});
    }
};

module.exports.Collection = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({message: "Authentication Required!"});
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        const userId = decoded.id;

        //Find the user and sort the collection by name
        const user = await User.findById(userId).populate({
            path: 'collection',
            options: {sort: {name: 1}} //Sort collection by name
        });

        if (!user) {
            return res.status(401).json({message: "User not found"});
        }

        res.status(200).json(user.collection);
    } catch (error) {
        console.error("Error fetching collection: ", error);
        res.status(500).json({message: "Failed to fetch collection"});
    }
};