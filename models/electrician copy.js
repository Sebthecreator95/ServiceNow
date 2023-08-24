"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");


//electrician class, able to
//sign up


class Electrician {
  //signup electrician
  static async signup({ electricianId, firstName, lastName, license, licenseNumber, category, availability, state, city, bio, skills, certifications, experienceLevel, yearsOfExperience }) {
    
    //check duplicate id
    const duplicateId = await db.query(
      `SELECT electrician_id AS "electricianId"
      FROM electricians
      WHERE electrician_id = $1`,
      [electricianId],
    );

    //throw error if duplicate
    if (duplicateId.rows[0]) {
      throw new BadRequestError(`Duplicate electrician ID. Try again!`);
    }

    const result = await db.query(
      `INSERT INTO electricians (electrician_id, first_name, last_name, license, license_number, category, availability, state, city, bio, skills, certifications, experience_level, years_of_experience)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING electrician_id AS "electricianId", first_name AS "firstName", last_name AS "lastName", license, license_number AS licenseNumber, category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"`,
      [electricianId, firstName, lastName, license, licenseNumber, category, availability, state, city, bio, skills, certifications, experienceLevel, yearsOfExperience],
    );

    const electrician = result.rows[0];

    return electrician;
  }

  //get all electricians
  static async findAll() {
    const electricians = await db.query(
      `SELECT electrician_id AS "electricianId", first_name AS "firstName", last_name AS "lastName, license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
      FROM electricians`
    );
    return electricians.rows;
  }


  //get all electricians by category
  static async findByCategory(category) {
    const electricians = await db.query(
      `SELECT electrician_id AS "electricianId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
      FROM electricians
      WHERE category = $1`,
      [category]
    );
    return electricians.rows;
  }


//get all licensed electricians 
static async findLicensedElectricians() {
  const electricians = await db.query(
    `SELECT electrician_id AS "electricianId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM electricians
    WHERE license = true`
  );
  return electricians.rows;
}


//get all unlicensed electricians 
static async findUnlicensedElectricians() {
  const electricians = await db.query(
    `SELECT electrician_id AS "electricianId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM electricians
    WHERE license = false`
  );
  return electricians.rows;
}



//get electricians by availbility
static async findAvailableElectricians(timeframe) {
  const electricians = await db.query(
    `SELECT electrician_id AS "electricianId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM electricians
    WHERE availability = $1`,
    [timeframe]
  );
  return electricians.rows;
}

//get electricians by state and city
static async findElectriciansByStateCity(state, city) {
  const electricians = await db.query(
    `SELECT electrician_id AS "electricianId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM electricians
    WHERE state = $1 AND city = $2`,
    [state, city]
  );
  return electricians.rows;
}


//get electricians by experience level
static async findAvailableElectricians(experienceLevel) {
  const electricians = await db.query(
    `SELECT electrician_id AS "electricianId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM electricians
    WHERE experience_level = $1`,
    [experienceLevel]
  );
  return electricians.rows;
  }



  //get electrician by id

  static async getById(electricianId) {
    const electricianRes = await db.query(
      `SELECT electrician_id AS "electricianId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
      FROM electricians
      WHERE electrician_id = $1`,
      [electricianId],
    );

    const electrician = electricianRes.rows[0];
    if (!electrician) throw new NotFoundError(`No electrician with Id: ${electricianId}`);

    return electrician;
  }




  //delete by email
  static async deleteByEmail(email) {
    let result = await db.query(
      `DELETE
           FROM electricians
           WHERE email = $1
           RETURNING email`,
      [email],
    );
    const electrician = result.rows[0];

    if (!electrician) throw new NotFoundError(`No electrican with Email: ${email}`);
  }

  //delete by electrician id
  static async deleteById(electricianId) {
    let result = await db.query(
      `DELETE
         FROM electricians
         WHERE electrician_id = $1
         RETURNING electrician_id AS "electricianId`,
      [electricianId],
    );
    const electrician = result.rows[0];

    if (!electrician) throw new NotFoundError(`No electrician with id: ${electricianId}`);
  }




  //update electrician by id
  static async update(electricianId, data) {

    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
       firstName : "first_name",
       lastName : "last_name",
       licenseNumber : "license_number",
       experienceLevel : "expereience_level",
       yearsOfExperience : "years_of_experience"
      });
    const electricianIdVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE electricians 
                      SET ${setCols} 
                      WHERE electrician_id = ${electricianIdVarIdx} 
                      RETURNING electrician_id AS "electricianId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"`;
    const result = await db.query(querySql, [...values, electricianId]);
    const electrician = result.rows[0];

    if (!electrician) throw new NotFoundError(`No user with electricianId: ${elctricianId}`);

    return electrician;
  }


//custom search for electricians
  static async search(data) {


    const { setCols, values } = sqlSearch(
      data,
      {
        experienceLevel : "experience_level"
      });


    const electriciansRes = await db.query(
      `SELECT ( electrician_id AS "electricianId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience" )
       FROM electricians
       WHERE ${setCols}`,
      [...values],
    );

    const electricians = electriciansRes.rows;
    if (!electricians) throw new NotFoundError(`No electricians found for your search`);

    return electricians;
    }





}




module.exports = Electrician;
