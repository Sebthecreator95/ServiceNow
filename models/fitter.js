"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");


//fitter class, able to
//sign up


class Fitter {
  //signup electrician
  static async signup({ fitterId, firstName, lastName, license, licenseNumber, category, workType, availability, state, city, bio, skills, certifications, experienceLevel, yearsOfExperience }) {
    
    //check duplicate id
    const duplicateId = await db.query(
      `SELECT fitter_id AS "fitterId"
      FROM fitters
      WHERE fitter_id = $1`,
      [fitterId],
    );

    //throw error if duplicate
    if (duplicateId.rows[0]) {
      throw new BadRequestError(`Duplicate fitter ID`);
    }

    const result = await db.query(
      `INSERT INTO fitters (fitter_id, first_name, last_name, license, license_number, category, work_type, availability, state, city, bio, skills, certifications, experience_level, years_of_experience)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING fitter_id AS "fitterId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, work_type AS "workType", availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"`,
      [fitterId, firstName, lastName, license, licenseNumber, category, workType, availability, state, city, bio, skills, certifications, experienceLevel, yearsOfExperience],
    );

    const fitter = result.rows[0];

    return fitter;
  }

  //get all fitters
  static async findAll() {
    const fitters = await db.query(
      `SELECT fitter_id AS "fitterId", first_name AS "firstName", last_name AS "lastName, license, license_number AS "licenseNumber", category, work_type AS "workType availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
      FROM fitters`
    );
    return fitters.rows;
  }


  //get all fitters by category
  static async findByCategory(category) {
    const fitters = await db.query(
      `SELECT fitter_id AS "fitterId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, work_type AS "workType", availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
      FROM fitters
      WHERE category = $1`,
      [category]
    );
    return fitters.rows;
  }



  //get all fitters by work type
  static async findByWorkType(workType) {
    const fitters = await db.query(
      `SELECT fitter_id AS "fitterId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, work_type AS "workType", availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
      FROM fitters
      WHERE work_type = $1`,
      [workType]
    );
    return fitters.rows;
  }



//get all licensed fitters 
static async findLicensedfitters() {
  const fitters = await db.query(
    `SELECT fitter_id AS "fitterId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, work_type AS "workType", availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM fitters
    WHERE license = true`
  );
  return fitters.rows;
}


//get all unlicensed fitters 
static async findUnlicensedfitters() {
  const fitters = await db.query(
    `SELECT fitter_id AS "fitterId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, work_type AS "workType", availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM fitters
    WHERE license = false`
  );
  return fitters.rows;
}



//get fitters by availbility
static async findAvailablefitters(timeframe) {
  const fitters = await db.query(
    `SELECT fitter_id AS "fitterId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, work_type AS "workType", availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM fitters
    WHERE availability = $1`,
    [timeframe]
  );
  return fitters.rows;
}

//get fitters by state and city
static async findFittersByStateCity(state, city) {
  const fitters = await db.query(
    `SELECT fitter_id AS "fitterId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM fitters
    WHERE state = $1 AND city = $2`,
    [state, city]
  );
  return fitters.rows;
}


//get fitters by experience level
static async findAvailableFitters(experienceLevel) {
  const fitters = await db.query(
    `SELECT fitter_id AS "fitterId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM fitters
    WHERE experience_level = $1`,
    [experienceLevel]
  );
  return fitters.rows;
  }



  //get fitter by id

  static async getById(fitterId) {
    const fitterRes = await db.query(
      `SELECT fitter_id AS "fitterId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
      FROM fitters
      WHERE fitter_id = $1`,
      [fitterId],
    );

    const fitter = fitterRes.rows[0];
    if (!fitter) throw new NotFoundError(`No fitter with Id: ${fitterId}`);

    return fitter;
  }




  //delete by email
  static async deleteByEmail(email) {
    let result = await db.query(
      `DELETE
           FROM fitters
           WHERE email = $1
           RETURNING email`,
      [email],
    );
    const fitter = result.rows[0];

    if (!fitter) throw new NotFoundError(`No fitter with Email: ${email}`);
  }

  //delete by fitter id
  static async deleteById(fitterId) {
    let result = await db.query(
      `DELETE
         FROM fitters
         WHERE fitter_id = $1
         RETURNING fitter_id AS "fitterId`,
      [fitterId],
    );
    const fitter = result.rows[0];

    if (!fitter) throw new NotFoundError(`No fitter with id: ${fitterId}`);
  }




  //update fitter by id
  static async update(fitterId, data) {

    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
       firstName : "first_name",
       lastName : "last_name",
       licenseNumber : "license_number",
       experienceLevel : "expereience_level",
       yearsOfExperience : "years_of_experience",
       workType : "work_type"
      });
    const fitterIdVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE electricians 
                      SET ${setCols} 
                      WHERE electrician_id = ${fitterIdVarIdx} 
                      RETURNING fitter_id AS "fitterId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, work_type AS "workType", availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"`;
    const result = await db.query(querySql, [...values, fitterId]);
    const fitter = result.rows[0];

    if (!fitter) throw new NotFoundError(`No user with fitterId: ${fitterId}`);

    return fitter;
  }


//custom search for fitters
  static async search(data) {


    const { setCols, values } = sqlSearch(
      data,
      {
        experienceLevel : "experience_level",
        workType : "work_type"
      });


    const fittersRes = await db.query(
      `SELECT ( fitter_id AS "fitterId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience" )
       FROM fitters
       WHERE ${setCols}`,
      [...values],
    );

    const fitters = fittersRes.rows;
    if (!fitters) throw new NotFoundError(`No fitters found for your search`);

    return fitters;
    }





}




module.exports = Fitter;
