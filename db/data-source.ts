import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOption: DataSourceOptions = {
  type: 'mysql',
  // host: 'mysql_db',
  host: 'localhost',
  // port: 3306,
  port: 2699,
  username: 'root',
  password: 'Tro@260299',
  database: 'blog-nestjs-reactjs',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false,
  // synchronize: true,
};

const dataSource = new DataSource(dataSourceOption);
export default dataSource;
