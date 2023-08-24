const { BadRequestError } = require("../expressError");


function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No Data To Update");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

function sqlSearch(dataToSearch, jsToSql) {
  const keys = Object.keys(dataToSearch);
  if (keys.length === 0) throw new BadRequestError("No Data To Search");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(" AND "),
    values: Object.values(dataToSearch),
  };
}


module.exports = { sqlForPartialUpdate, sqlSearch };
