"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");


//mason class, able to
//sign up


class Mason {
  //signup mason
  static async signup({ masonId, firstName, lastName, license, licenseNumber, category, availability, state, city, bio, skills, certifications, experienceLevel, yearsOfExperience }) {
    
    //check mason id
    const duplicateId = await db.query(
      `SELECT mason_id AS "masonId"
      FROM masons
      WHERE mason_id = $1`,
      [masonId],
    );

    //throw error if duplicate
    if (duplicateId.rows[0]) {
      throw new BadRequestError(`Duplicate mason ID.`);
    }

    const result = await db.query(
      `INSERT INTO masons (mason_id, first_name, last_name, license, license_number, category, availability, state, city, bio, skills, certifications, experience_level, years_of_experience)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING mason_id AS "masonId", first_name AS "firstName", last_name AS "lastName", license, license_number AS licenseNumber, category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"`,
      [masonId, firstName, lastName, license, licenseNumber, category, availability, state, city, bio, skills, certifications, experienceLevel, yearsOfExperience],
    );

    const mason = result.rows[0];

    return mason;
  }

  //get all masons
  static async findAll() {
    const masons = await db.query(
      `SELECT mason_id AS "masonId", first_name AS "firstName", last_name AS "lastName, license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
      FROM masons`
    );
    return masons.rows;
  }


  //get all masons by category
  static async findByCategory(category) {
    const masons = await db.query(
      `SELECT mason_id AS "masonId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
      FROM masons
      WHERE category = $1`,
      [category]
    );
    return masons.rows;
  }


//get all licensed masons 
static async findLicensedMasons() {
  const masons = await db.query(
    `SELECT mason_id AS "masonId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM masons
    WHERE license = true`
  );
  return masons.rows;
}


//get all unlicensed masons 
static async findUnlicensedMasons() {
  const masons = await db.query(
    `SELECT mason_id AS "masonId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM masons
    WHERE license = false`
  );
  return masons.rows;
}



//get masons by availbility
static async findAvailableMasons(timeframe) {
  const masons = await db.query(
    `SELECT mason_id AS "masonId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM masons
    WHERE availability = $1`,
    [timeframe]
  );
  return masons.rows;
}

//get masons by state and city
static async findMasonsByStateCity(state, city) {
  const masons = await db.query(
    `SELECT mason_id AS "masonId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM masons
    WHERE state = $1 AND city = $2`,
    [state, city]
  );
  return masons.rows;
}


//get masons by experience level
static async findAvailableMasons(experienceLevel) {
  const masons = await db.query(
    `SELECT mason_id AS "masonId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM masons
    WHERE experience_level = $1`,
    [experienceLevel]
  );
  return masons.rows;
  }



  //get mason by id

  static async getById(masonId) {
    const masonRes = await db.query(
      `SELECT mason_id AS "masonId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
      FROM masons
      WHERE mason_id = $1`,
      [masonId],
    );

    const mason = masonRes.rows[0];
    if (!mason) throw new NotFoundError(`No mason with Id: ${masoId}`);

    return mason;
  }




  //delete by email
  static async deleteByEmail(email) {
    let result = await db.query(
      `DELETE
           FROM masons
           WHERE email = $1
           RETURNING email`,
      [email],
    );
    const mason = result.rows[0];

    if (!mason) throw new NotFoundError(`No mason with Email: ${email}`);
  }

  //delete by mason id
  static async deleteById(masonId) {
    let result = await db.query(
      `DELETE
         FROM masons
         WHERE mason_id = $1
         RETURNING mason_id AS "masonId`,
      [masonId],
    );
    const mason = result.rows[0];

    if (!mason) throw new NotFoundError(`No mason with id: ${masonId}`);
  }




  //update mason by id
  static async update(masonId, data) {

    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
       firstName : "first_name",
       lastName : "last_name",
       licenseNumber : "license_number",
       experienceLevel : "expereience_level",
       yearsOfExperience : "years_of_experience"
      });
    const masonIdVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE masons 
                      SET ${setCols} 
                      WHERE mason_id = ${masonIdVarIdx} 
                      RETURNING mason_id AS "masonId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"`;
    const result = await db.query(querySql, [...values, masonId]);
    const mason = result.rows[0];

    if (!mason) throw new NotFoundError(`No user with masonId: ${masonId}`);

    return mason;
  }


//custom search for masons
  static async search(data) {


    const { setCols, values } = sqlSearch(
      data,
      {
        experienceLevel : "experience_level"
      });


    const masonsRes = await db.query(
      `SELECT (mason_id AS "masonId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience" )
       FROM masons
       WHERE ${setCols}`,
      [...values],
    );

    const masons = masonsRes.rows;
    if (!masons) throw new NotFoundError(`No masons found for your search`);

    return masons;
    }





}




module.exports = Mason;
