const express = require('express');
const Pet = require('../schemas/petSchema');
const User = require('../schemas/userSchema');

const moveEmailToReq = (req, res, next) => {
    req.body.email = req.params.userEmail;
    if (req.body.email) {
        next();
    } else {
        res.status(400).send('Please name the params userEmail');
    }
}

const moveUserByIdToReq = async (req, res, next) => {
    const user = await User.find({ _id: req.params.id });
    if (user) {
        req.body = user[0];
        next();
    } else {
        res.status(400).send('No user with this id');
    }
}

const validatePetBody = (req, res, next) => {
    const { name,
        type,
        height,
        weight,
        color,
        breed,
    } = req.body;
    if (name && type && height && weight && color && breed) {
        next();
        return;
    }
    res.status(400).send('Can not accept empty strings');
}

module.exports = { moveEmailToReq, moveUserByIdToReq, validatePetBody };