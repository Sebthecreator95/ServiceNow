"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureCorrectUser } = require("../middleware/authentication");
const { BadRequestError, NotFoundError } = require("../expressError");
const User = require("../models/user");
const userUpdateSchema = require("../schemas/userUpdate.json");
const router = express.Router();




/** GET / => { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of all users.
 *
 **/

router.get("/users", async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});


/** GET /[userid] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin}
 *
 * Authorization required: same user-as-:userId
 **/

router.get("/users/:userId", async function (req, res, next) {
  try {
    const user = await User.getById(req.params.userId);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[userId] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: same-user-as-:userId
 **/

router.patch("/users/:userId", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.userId, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[userId]  =>  { deleted: user with [email] }
 *
 * Authorization required: same-userId
 **/

router.delete("/users/:userId", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.getById(req.params.userId);
    if (user) {
      await User.deleteById(req.params.userId);
      return res.json({ deleted: `User with email ${user.email}` });
    }
    else {
      throw new NotFoundError(`No user with userId: ${userId}`);
    }
  } catch (err) {
    return next(err);
  }
});





module.exports = router;
