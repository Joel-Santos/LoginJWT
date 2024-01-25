// knexfile.js
module.exports = {
  client: 'mysql2',
  connection: {
     host : 'localhost',      //por padrão localhost
        user : 'root',       //por padrão root
        password : '',  //sua senha definida
        database : 'crud'
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations',
  },
};
