import SQLite from "tauri-plugin-sqlite-api";

export class CoreDB {
    public DB: SQLite | null = null;
    constructor(public debug: boolean = true) {
    
    }
    public async init(): Promise<boolean> {
        if (this.DB === null) {
            let rslt = false;
            try {
                this.DB = await SQLite.open("Pluto.db");
                if (this.debug) console.log("DB: Opened");
                rslt =  true;
            } catch (error) {
                console.error(`Error Opening DB: ${(error as Error).message}`);
                rslt =  false;
            }
            return rslt;
        }
        return true; // Add a return statement for the case when this.DB is not null
    }

    public async open(): Promise<boolean> {
        if (this.DB === null) {
            if (await this.init()) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    async close(): Promise<boolean> {
        if (this.DB !== null) {
            let rslt = false;
            try {
                await this.DB.close();
                this.DB = null;
                if (this.debug) console.log("DB: Closed");
                rslt = true;
            } catch (error) {
                console.error(`Error Closing DB: ${(error as Error).message}`);
                rslt = false;
            }
            return rslt;
        } else {
            return true;
        }
    }
}