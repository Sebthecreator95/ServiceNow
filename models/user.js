"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");


//user class, able to log in user, sign up user, view all users
//view, update, remove a user by ID


class User {
  //signup user
  static async signup({ email, password, isAdmin, userId, userCategory }) {
    //check duplicate email
    const duplicateCheck = await db.query(
      `SELECT email
      FROM users
      WHERE email = $1`,
      [email],
    );
    //check duplicate id
    const duplicateId = await db.query(
      `SELECT user_id AS "userId"
      FROM users
      WHERE user_id = $1`,
      [userId],
    );


    //throw error if duplicate
    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate email: ${email}`);
    }
    if (duplicateId.rows[0]) {
      throw new BadRequestError(`Duplicate user ID. Try again!`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users (email, password, is_admin, user_id, user_category)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING email ,is_admin AS "isAdmin", user_id AS "userId", user_category AS "userCategory"`,
      [email, hashedPassword, isAdmin, userId, userCategory],
    );

    const user = result.rows[0];

    return user;
  }




  //login user
  static async login(email, password) {
    const result = await db.query(
      `SELECT email,
      password,
      is_admin AS "isAdmin",
      user_id AS "userId".
      user_category AS "userCategory"
      FROM users
      WHERE email = $1`,
      [email],
    );

    const user = result.rows[0];

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid email/password");
  }




  //get all users
  static async findAll() {
    const users = await db.query(
      `SELECT email,
            is_admin AS "isAdmin",
            user_id AS "userId",
            user_category AS "userCategory"
    FROM users`
    );
    return users.rows;
  }

  //get all users by category
  static async findByCategory(userCategory) {
    const users = await db.query(
      `SELECT email,
            is_admin AS "isAdmin",
            user_id AS "userId",
            user_category AS "userCategory"
    FROM users
    WHERE user_category = $1`,
      [userCategory]
    );
    return users.rows;
  }

  //get user by id

  static async getById(userId) {
    const userRes = await db.query(
      `SELECT email,
              is_admin AS "isAdmin",
              user_id AS "userId",
              user_category AS "userCategory"
       FROM users
       WHERE user_id = $1`,
      [userId],
    );

    const user = userRes.rows[0];
    if (!user) throw new NotFoundError(`No user with userId: ${userId}`);

    return user;
  }




  //delete by email
  static async deleteByEmail(email) {
    let result = await db.query(
      `DELETE
           FROM users
           WHERE email = $1
           RETURNING email`,
      [email],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user with Email: ${email}`);
  }

  //delete by user id
  static async deleteById(userId) {
    let result = await db.query(
      `DELETE
         FROM users
         WHERE user_id = $1
         RETURNING email`,
      [userId],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user with email: ${user}`);
  }




  //update user by id
  static async update(userId, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        isAdmin: "is_admin",
      });
    const userIdVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE userId = ${userIdVarIdx} 
                      RETURNING email,
                                is_admin AS "isAdmin"
                                user_id AS userId`;
    const result = await db.query(querySql, [...values, userId]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user with userId: ${userId}`);

    delete user.password;
    return user;
  }

}




module.exports = User;
