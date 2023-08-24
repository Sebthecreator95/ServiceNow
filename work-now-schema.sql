CREATE TABLE users(
  user_id TEXT PRIMARY KEY,
  email text
    CHECK (position('@' IN email) > 1),
  password TEXT NOT NULL,
  user_category TEXT NOT NULL,
  is_admin BOOLEAN NOT NUll
);


CREATE TABLE professionals(
  professional_id TEXT PRIMARY KEY REFERENCES users(user_id),
  license BOOLEAN NOT NULL,
  category TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  experience_level TEXT NOT NULL
);


CREATE TABLE fitters(
  fitter_id TEXT PRIMARY KEY REFERENCES professionals(profesional_id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  license BOOLEAN NOT NULL,
  license_number INTEGER,
  category TEXT NOT NULL,
  work_type TEXT NOT NULL,
  availability TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  bio TEXT NOT NULL,
  skills TEXT NOT NULL,
  certifications TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  years_of_experience INTEGER
);

CREATE TABLE masons(
  mason_id TEXT PRIMARY KEY REFERENCES professionals(profesional_id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  license BOOLEAN NOT NULL,
  license_number INTEGER,
  category TEXT NOT NULL,
  availability TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  bio TEXT NOT NULL,
  skills TEXT NOT NULL,
  certifications TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  years_of_experience INTEGER
);

CREATE TABLE landscapers(
  landscaper_id TEXT PRIMARY KEY REFERENCES professionals(profesional_id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  license BOOLEAN NOT NULL,
  license_number INTEGER,
  category TEXT NOT NULL,
  availability TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  bio TEXT NOT NULL,
  skills TEXT NOT NULL,
  certifications TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  years_of_experience INTEGER
);

CREATE TABLE installers(
  installer_id TEXT PRIMARY KEY REFERENCES professionals(profesional_id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  license BOOLEAN NOT NULL,
  license_number INTEGER,
  category TEXT NOT NULL,
  availability TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  bio TEXT NOT NULL,
  skills TEXT NOT NULL,
  certifications TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  years_of_experience INTEGER
);

CREATE TABLE operators(
  painter_id TEXT PRIMARY KEY REFERENCES professionals(profesional_id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  license BOOLEAN NOT NULL,
  license_number INTEGER,
  category TEXT NOT NULL,
  availability TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  bio TEXT NOT NULL,
  skills TEXT NOT NULL,
  certifications TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  years_of_experience INTEGER
);

CREATE TABLE carpenters(
  carpenter_id TEXT PRIMARY KEY REFERENCES professionals(profesional_id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  license BOOLEAN NOT NULL,
  license_number INTEGER,
  category TEXT NOT NULL,
  availability TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  bio TEXT NOT NULL,
  skills TEXT NOT NULL,
  certifications TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  years_of_experience INTEGER
);

CREATE TABLE painters(
  painter_id TEXT PRIMARY KEY REFERENCES professionals(profesional_id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  license BOOLEAN NOT NULL,
  license_number INTEGER,
  category TEXT NOT NULL,
  availability TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  bio TEXT NOT NULL,
  skills TEXT NOT NULL,
  certifications TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  years_of_experience INTEGER
);

CREATE TABLE framers(
  framer_id TEXT PRIMARY KEY REFERENCES professionals(profesional_id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  license BOOLEAN NOT NULL,
  license_number INTEGER,
  category TEXT NOT NULL,
  availability TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  bio TEXT NOT NULL,
  skills TEXT NOT NULL,
  certifications TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  years_of_experience INTEGER
);

CREATE TABLE mechanics(
  mechanic_id TEXT PRIMARY KEY REFERENCES professionals(profesional_id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  license BOOLEAN NOT NULL,
  license_number INTEGER,
  category TEXT NOT NULL,
  availability TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  bio TEXT NOT NULL,
  skills TEXT NOT NULL,
  certifications TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  years_of_experience INTEGER
);

CREATE TABLE technicians(
  technician_id TEXT PRIMARY KEY REFERENCES professionals(profesional_id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  license BOOLEAN NOT NULL,
  license_number INTEGER,
  category TEXT NOT NULL,
  availability TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  bio TEXT NOT NULL,
  skills TEXT NOT NULL,
  certifications TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  years_of_experience INTEGER
);

CREATE TABLE plumbers(
  plumber_id TEXT PRIMARY KEY REFERENCES professionals(profesional_id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  license BOOLEAN NOT NULL,
  license_number INTEGER,
  category TEXT NOT NULL,
  availability TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  bio TEXT NOT NULL,
  skills TEXT NOT NULL,
  certifications TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  years_of_experience INTEGER
);

CREATE TABLE electricians(
  electrician_id TEXT PRIMARY KEY REFERENCES professionals(profesional_id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  license BOOLEAN NOT NULL,
  license_number INTEGER,
  category TEXT NOT NULL,
  availability TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  bio TEXT NOT NULL,
  skills TEXT NOT NULL,
  certifications TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  years_of_experience INTEGER
);


CREATE TABLE  contractors(
  contractor_id TEXT PRIMARY KEY REFERENCES professionals(professional_id),
  company_name TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  bio TEXT NOT NULL,
  specialties TEXT NOT NULL,
  category TEXT NOT NULL,
  license_number TEXT NOT NULL,
  company_size TEXT NOT NULL,
  years_of_experience INTEGER
);


CREATE TABLE  clients(
  client_id TEXT PRIMARY KEY REFERENCES users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL
);

CREATE TABLE  conversations(
  id  TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  timestamp DATETIME NOT NULL,
  msg_sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  msg_receiver_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE  messages(
  conversation_id  TEXT PRIMARY KEY,
  message_id  TEXT PRIMARY KEY,
  timestamp DATETIME NOT NULL,
  message TEXT NOT NULL
);




CREATE TABLE  reviews(
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  review TEXT NOT NULL,
  rating INTEGER NOT NULL,
  reviewed_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewed TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);