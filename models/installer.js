"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");


//installer class, able to
//sign up


class Installer {
  //signup installer
  static async signup({ installerId, firstName, lastName, license, licenseNumber, category, availability, state, city, bio, skills, certifications, experienceLevel, yearsOfExperience }) {
    
    //check duplicate id
    const duplicateId = await db.query(
      `SELECT installer_id AS "installerId"
      FROM installers
      WHERE installer_id = $1`,
      [installerId],
    );

    //throw error if duplicate
    if (duplicateId.rows[0]) {
      throw new BadRequestError(`Duplicate installer ID. Try again!`);
    }

    const result = await db.query(
      `INSERT INTO electricians (installer_id, first_name, last_name, license, license_number, category, availability, state, city, bio, skills, certifications, experience_level, years_of_experience)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING installer_id AS "installerId", first_name AS "firstName", last_name AS "lastName", license, license_number AS licenseNumber, category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"`,
      [installerId, firstName, lastName, license, licenseNumber, category, availability, state, city, bio, skills, certifications, experienceLevel, yearsOfExperience],
    );

    const installer = result.rows[0];

    return installer;
  }

  //get all installers
  static async findAll() {
    const installers = await db.query(
      `SELECT installer_id AS "installerId", first_name AS "firstName", last_name AS "lastName, license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
      FROM installers`
    );
    return installers.rows;
  }


  //get all installers by category
  static async findByCategory(category) {
    const installers = await db.query(
      `SELECT installer_id AS "installerId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
      FROM installers
      WHERE category = $1`,
      [category]
    );
    return installers.rows;
  }


//get all licensed installers 
static async findLicensedInstallers() {
  const installers = await db.query(
    `SELECT installer_id AS "installerId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM installers
    WHERE license = true`
  );
  return installers.rows;
}


//get all unlicensed installers 
static async findUnlicensedInstallers() {
  const installers = await db.query(
    `SELECT installer_id AS "installerId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM installers
    WHERE license = false`
  );
  return installers.rows;
}



//get installers by availbility
static async findAvailableInstallers(timeframe) {
  const installers = await db.query(
    `SELECT installer_id AS "installerId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM installers
    WHERE availability = $1`,
    [timeframe]
  );
  return installers.rows;
}

//get installers by state and city
static async findInstallersByStateCity(state, city) {
  const installers = await db.query(
    `SELECT installer_id AS "installerId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM installers
    WHERE state = $1 AND city = $2`,
    [state, city]
  );
  return installers.rows;
}


//get installers by experience level
static async findAvailableInstallers(experienceLevel) {
  const installers = await db.query(
    `SELECT installer_id AS "installerId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
    FROM installers
    WHERE experience_level = $1`,
    [experienceLevel]
  );
  return installers.rows;
  }



  //get installer by id

  static async getById(installerId) {
    const installerRes = await db.query(
      `SELECT installer_id AS "installerId", first_name AS "firstName", last_name AS "lastName", license, license_number AS "licenseNumber", category, availability, state, city, bio, skills, certifications, experience_level AS "experienceLevel", years_of_experience AS "yearsOfExperience"
      FROM installers
      WHERE installer_id = $1`,
      [installerId],
    );

    const installer = installerRes.rows[0];
    if (!installer) throw new NotFoundError(`No installer with Id: ${installerId}`);

    return installer;
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
