"use strict";

const jsonschema = require("jsonschema");

const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userLogInSchema = require("../schemas/userLogInSchema.json");
const userSignUpSchema = require("../schemas/userSignUpSchema.json");
const { BadRequestError } = require("../expressError");

//user log in
router.post("/login", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userLogInSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const { username, password } = req.body;
    const user = await User.login(username, password);
    console.log(user)
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});


//user sign up
router.post("/signup", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userSignUpSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await User.signup({ ...req.body, isAdmin: false });
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
