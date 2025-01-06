import * as mysql from 'mariadb';
import * as fs from 'node:fs/promises';


let pool: mysql.Pool | null = null;

export async function getConnection(): Promise<mysql.Connection> {
  if(pool === null) {
    const creds = JSON.parse(await fs.readFile('db-creds.json', { encoding: 'utf8' }));
    pool = mysql.createPool(creds);
  }

  return pool.getConnection();
}
