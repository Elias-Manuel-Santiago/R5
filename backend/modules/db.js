import mysql from "mysql2/promise";


const connection = await mysql.createConnection({
  host: "sql.freedb.tech",
  user: "u_ZoqBDq",
  password: "56coJYvpLVa4",
  database: "freedb_ajnBLa0F",
});

// La aplicación se usaba antes de que existieran los perfiles y los roles.
// Estas migraciones pequeñas permiten actualizar bases ya creadas sin borrar
// usuarios ni obligar a reconstruir la tabla manualmente.
async function agregarColumnaSiNoExiste(nombre, definicion) {
  const [columnas] = await connection.query(
    "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = ?",
    [nombre]
  );
  if (columnas.length === 0) {
    await connection.query(`ALTER TABLE usuarios ADD COLUMN ${definicion}`);
  }
}

await agregarColumnaSiNoExiste("profile_picture", "profile_picture MEDIUMTEXT NULL");
await agregarColumnaSiNoExiste("is_admin", "is_admin TINYINT(1) NOT NULL DEFAULT 0");

export default connection;
