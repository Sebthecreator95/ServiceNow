\echo 'Delete and recreate work now db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE work_now_db;
CREATE DATABASE work_now_db;
\connect work_now_db

\i work_now-schema.sql

\echo 'Delete and recreate work_now_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE work_now_test_db;
CREATE DATABASE work_now_test_db;
\connect work_now_test_db

\i work_now-schema.sql
