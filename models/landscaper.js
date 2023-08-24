"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");


//landscaper class, able to
//sign up


class Landscaper {
  //signup landscaper
  static async signup({ landscaperId, firstName, lastName, license, licenseNumber, category, availability, state, city, bio, skills, certifications, experienceLevel, yearsOfExperience }) {
    
    //check duplicate id
    const duplicateId = await db.query(
      `SELECT landscaper_id AS "landscaperId"
      FROM landscapers
      WHERE landscaper_id = $1`,
      [landscaperId],
    );

    //throw error if duplicate
    if (duplicateId.rows[0]) {
      throw new BadRequestError(`Duplicate landscaper ID. Try again!`);
    }

    const result = await db.query(
      `INSERT INTO landscapers (landscaper_id, first_name, last_name, license, license_number, category, availability, state, city, bio, skills, certifications, experience_level, years_of_experience)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING landscaper_id AS "landscaperId", first_name AS "firstName", last_name AS "lastName", license, license_number AS licenseNumber, category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"`,
      [landscaperId, firstName, lastName, license, licenseNumber, category, availability, state, city, bio, skills, certifications, experienceLevel, yearsOfExperience],
    );

    const landscaper = result.rows[0];

    return landscaper;
  }

  //get all landscapers
  static async findAll() {
    const landscapers = await db.query(
      `SELECT landscaper_id AS "landscaperId", first_name AS "firstName", last_name AS "lastName, license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
      FROM landscapers`
    );
    return landscapers.rows;
  }


  //get all landscapers by category
  static async findByCategory(category) {
    const landscapers = await db.query(
      `SELECT landscaper_id AS "landscaperId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
      FROM landscapers
      WHERE category = $1`,
      [category]
    );
    return landscapers.rows;
  }


//get all licensed landscapers 
static async findLicensedLandscapers() {
  const landscapers = await db.query(
    `SELECT landscaper_id AS "landscaperId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM landscapers
    WHERE license = true`
  );
  return landscapers.rows;
}


//get all unlicensed s 
static async findUnlicensedLandscapers() {
  const landscapers = await db.query(
    `SELECT landscaper_id AS "landscaperId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM landscapers
    WHERE license = false`
  );
  return landscapers.rows;
}



//get landscapers by availbility
static async findAvailableLandscapers(timeframe) {
  const landscapers = await db.query(
    `SELECT landscaper_id AS "landscaperId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM landscapers
    WHERE availability = $1`,
    [timeframe]
  );
  return landscapers.rows;
}

//get landscapers by state and city
static async findLandscapersByStateCity(state, city) {
  const landscapers = await db.query(
    `SELECT landscaper_id AS "landscaperId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM landscapers
    WHERE state = $1 AND city = $2`,
    [state, city]
  );
  return landscapers.rows;
}


//get landscapers by experience level
static async findAvailableLandscapers(experienceLevel) {
  const landscapers = await db.query(
    `SELECT landscaper_id AS "landscaperId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM landscapers
    WHERE experience_level = $1`,
    [experienceLevel]
  );
  return landscapers.rows;
  }



  //get electrician by id

  static async getById(electricianId) {
    const landscaperRes = await db.query(
      `SELECT landscaper_id AS "landscaperId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
      FROM landscapers
      WHERE landscaper_id = $1`,
      [landscaperId],
    );

    const landscaper = landscaperRes.rows[0];
    if (!landscaper) throw new NotFoundError(`No landscaper with Id: ${landscaperId}`);

    return landscaper;
  }




  //delete by email
  static async deleteByEmail(email) {
    let result = await db.query(
      `DELETE
           FROM landscapers
           WHERE email = $1
           RETURNING email`,
      [email],
    );
    const landscaper = result.rows[0];

    if (!landscaper) throw new NotFoundError(`No electrican with Email: ${email}`);
  }

  //delete by landscaper id
  static async deleteById(landscaperId) {
    let result = await db.query(
      `DELETE
         FROM landscapers
         WHERE landscaper_id = $1
         RETURNING landscaper_id AS "landscaperId`,
      [electricianId],
    );
    const landscaper = result.rows[0];

    if (!landscaper) throw new NotFoundError(`No landscaper with id: ${landscaperId}`);
  }




  //update landscaper by id
  static async update(landscaperId, data) {

    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
       firstName : "first_name",
       lastName : "last_name",
       licenseNumber : "license_number",
       experienceLevel : "expereience_level",
       yearsOfExperience : "years_of_experience"
      });
    const landscaperIdVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE landscapers 
                      SET ${setCols} 
                      WHERE landscaper_id = ${landscaperIdVarIdx} 
                      RETURNING landscaper_id AS "landscaperId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"`;
    const result = await db.query(querySql, [...values, landscaperId]);
    const landscaper = result.rows[0];

    if (!landscaper) throw new NotFoundError(`No user with landscaperId: ${landscaperId}`);

    return landscaper;
  }


//custom search for landscapers
  static async search(data) {


    const { setCols, values } = sqlSearch(
      data,
      {
        experienceLevel : "experience_level"
      });


    const landscapersRes = await db.query(
      `SELECT ( landscaper_id AS "landscaperId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience" )
       FROM landscapers
       WHERE ${setCols}`,
      [...values],
    );

    const landscapers = electriciansRes.rows;
    if (!landscapers) throw new NotFoundError(`No landscapers found for your search`);

    return landscapers;
    }





}




module.exports = Landscaper;
