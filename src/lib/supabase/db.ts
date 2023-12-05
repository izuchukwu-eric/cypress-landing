import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import * as schema from "../../../migrations/schema";
import { migrate } from "drizzle-orm/postgres-js/migrator";

dotenv.config({ path: ".env" });

if(!process.env.DATABASE_URL) {
    console.log("no database url");
}

const client = postgres(process.env.DATABASE_URL as string, { max: 1 });
const db = drizzle(client, { schema });

//migrate db to keep schema's upto date with the db
const migrateDB = async () => {
    try {
        console.log("Migrating client");
        await migrate(db, { migrationsFolder: "migrations" })
        console.log("Successfully Migrated");
    } catch (error) {
        console.log("Error Migrating client")
    }
}

migrateDB();
export default db;