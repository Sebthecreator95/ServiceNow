"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlSearch } = require("../helpers/sql");




class Profesional {
  //register as a professional
  static async registerProfessional(data) {
    const duplicateCheck = await db.query(
      `SELECT email
      FROM professionals
      WHERE email = $1`,
      [data.email],
    );
    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate email: ${email}`);
    }
    const duplicateId = await db.query(
      `SELECT professional_id AS professionalId
      FROM professionals
      WHERE professionalId = $1`,
      [data.professionalId],
    );
    if (duplicateId.rows[0]) {
      throw new BadRequestError(`Duplicate professional ID: ${data.professionalId}`);
    }


    const result = await db.query(
      `INSERT INTO professionals ( professional_id, license, category, state, city, experience_level)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING (professional_id AS professionalId, license, category, state,  city, experience_level AS experienceLevel )`,
      [
        data.professionalId,
        data.license,
        data.category,
        data.state,
        data.city,
        data.experienceLevel
      ]);
    let professional = result.rows[0];

    return professional;
  }
  static async getById(professionalId) {
    const profRes = await db.query(
      `SELECT ( professional_id AS professionalId, license, category, state,  city, experience_level AS experienceLevel)
       FROM professionals
       WHERE professional_id = $1`,
      [professionalId],
    );

    const professional = profRes.rows[0];
    if (!professional) throw new NotFoundError(`No profesional with userId: ${userId}`);

    return professional;
  }
  static async getByEmail(email) {
    const profRes = await db.query(
      `SELECT (
        user_id AS userId,license, category, state,  city, experience_level AS experienceLevel)
       FROM professionals
       WHERE email = $1`,
      [email],
    );

    const professional = profRes.rows[0];
    if (!professional) throw new NotFoundError(`No profesional with email: ${email}`);

    return professional;
  }

  static async getLicensed() {
    const profRes = await db.query(
      `SELECT (
        professional_id AS professionalId, license, category, state,  city, experience_level AS experienceLevel)
       FROM professionals
       WHERE license = "true"`,
    );

    const professionals = profRes.rows;
    if (!professionals) throw new NotFoundError(`No Licensed Professionals`);

    return professionals;
  }

  static async getUnlicensed() {
    const profRes = await db.query(
      `SELECT ( professional_id AS professionalId, license, category, state,  city, experience_level AS experienceLevel )
       FROM professionals
       WHERE license = "false"`,
    );

    const professionals = profRes.rows;
    if (!professionals) throw new NotFoundError(`No Unlicensed Professionals`);

    return professionals;
  }


  static async getByCategory(category) {
    const profRes = await db.query(
      `SELECT (
        professional_id AS professionalId, license, license_number, category, availability, work_type,
        state,  city, bio, specialties, certifications, experience_level AS experienceLevel, years_Of_Experience AS yearsOfExperience)
       FROM professionals
       WHERE category = $1`,
      [category],
    );

    const professionals = profRes.rows;
    if (!professionals) throw new NotFoundError(`No profesionals in category: ${category}`);

    return professionals;
  }

 
  static async getByStateAndCity(state, city) {
    const profRes = await db.query(
      `SELECT ( professional_id AS professionalId, license, category, state,  city, experience_level AS experienceLevel)
       FROM professionals
       WHERE state = $1 AND city = $2`,
      [state, city],
    );

    const professionals = profRes.rows;
    if (!professionals) throw new NotFoundError(`No profesionals in: ${city}, ${state}`);

    return professionals;
  }

  static async getByExperienceLevel(expLevel) {
    const profRes = await db.query(
      `SELECT ( professional_id AS professionalId, license, category, state,  city, experience_level AS experienceLevel )
       FROM professionals
       WHERE experience_level = expLevel`,
      [expLevel],
    );

    const professionals = profRes.rows;
    if (!professionals) throw new NotFoundError(`No professionals with ${expLevel} experience`);

    return professionals;
  }

  static async search(data) {


    const { setCols, values } = sqlSearch(
      data,
      {
        experienceLevel: "experience_level"
      });


    const profRes = await db.query(
      `SELECT ( professional_id AS professionalId, license, category, state,  city, experience_level AS experienceLevel )
       FROM professionals
       WHERE ${setCols}`,
      [...values],
    );

    const professionals = profRes.rows;
    if (!professionals) throw new NotFoundError(`No professionals found for your search`);

    return professionals;
  }


}

module.exports = Profesional;
