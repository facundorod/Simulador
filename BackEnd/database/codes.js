// Códigos de errores en consultas en PostgreSQL.

const UNIQUE_VIOLATION = 23505;
const FOREIGN_KEY_VIOLATION = 23503;

module.exports = {
    UNIQUE_VIOLATION,
    FOREIGN_KEY_VIOLATION
}