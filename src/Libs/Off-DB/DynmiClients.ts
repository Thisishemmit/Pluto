import { CoreDB } from "./Core";

interface ClientI {
    [key: string]: string;
}

interface ClientDBI {
    connect(): Promise<boolean>;
    disconnect(): Promise<boolean>;
    setup(): Promise<boolean>;
    storeImage(id: string, image: string, purpose: "profile" | "other"): Promise<boolean>;
    addClient(client: Partial<ClientI>): Promise<boolean>;
    getClient(id: string): Promise<ClientI>;
    alterField( field: string): Promise<boolean>;
    getFieldById(id: string, field: string, rule: string): Promise<string>;
    updateFieldById(id: string, field: string, value: string): Promise<boolean>;
    deleteFieldById(id: string, field: string): Promise<boolean>;
    deleteClient(id: string): Promise<boolean>;
    storePDF(id: string, pdf: string): Promise<boolean>;
    getPDF(id: string): Promise<string>;
    getImage(id: string): Promise<string>;
    deleteImage(id: string): Promise<boolean>;
    deletePDF(id: string): Promise<boolean>;
    clientExists(key: keyof ClientI, value: string): Promise<boolean>;
    clientSearch(term: string, sort: "asc" | "desc", sortBy: keyof ClientI): Promise<ClientI[]>;
    clientFilterByDateRange(field: keyof ClientI, start: string, end: string, sort: "asc" | "desc", sortBy: keyof ClientI): Promise<ClientI[]>;
    getClientCount(): Promise<number>;
    getAllClients(sort: "asc" | "desc", sortBy: keyof ClientI): Promise<ClientI[]>;
    //_ = lazy
    _getAllClients(limit: number, step: number, sort: "asc" | "desc", sortBy: keyof ClientI): Promise<ClientI[]>;
    _clientSearch(term: string, limit: number, step: number, sort: "asc" | "desc", sortBy: keyof ClientI): Promise<ClientI[]>;
    _clientFilterByDateRange(field: keyof ClientI, start: string, end: string, limit: number, step: number, sort: "asc" | "desc", sortBy: keyof ClientI): Promise<ClientI[]>;
    /** @throws Error */
    deleteAllClients(): Promise<boolean>;
    setupClientUpdateHistory(): Promise<boolean>;
    setupClientImages(): Promise<boolean>;
}

class ClientDB implements ClientDBI {
    private core: CoreDB;
    constructor(public debug: boolean = false) {
        this.core = new CoreDB();
    }

    public async connect(): Promise<boolean> {
        if (this.core.DB === null) {
            try {
                await this.core.open();
                if (this.debug) console.log(`ClientDB.connect method success`);
                return true;
            } catch (error) {
                if (this.debug) console.log(`ClientDB.connect method failed: ${(error as Error).message}`);
                return false;
            }
        } else {
            return true;
        }
    }

    public async disconnect(): Promise<boolean> {
        if (this.core.DB !== null) {
            try {
                await this.core.close();
                return true;
            } catch (error) {
                if (this.debug) console.log(`ClientDB.disconnect method failed: ${(error as Error).message}`);
                return false;
            }
        } else {
            if (this.debug) console.log(`ClientDB.disconnect method failed: DB is null`);
            return true;
        }
    }

    async setup(): Promise<boolean> {
        if (this.core.DB !== null) {
            try {
                await this.core.DB.execute(`
                    CREATE TABLE IF NOT EXISTS clients (
                        id TEXT PRIMARY KEY,
                        profile TEXT,
                        name TEXT,
                        email TEXT,
                        phone TEXT,
                        address TEXT,
                        notes TEXT,
                        createdAt TEXT,
                        FOREIGN KEY(profile) REFERENCES clientImages(id)
                    );
                `);
                if (this.debug) console.log(`ClientDB.setup method success`);
                return true;
            } catch (error) {
                if (this.debug) console.log(`ClientDB.setup method failed: ${(error as Error).message}`);
                return false;
            }
        }
        if (this.debug) console.log(`ClientDB.setup method failed: DB is null`);
        return false;
    }

    public async setupClientUpdateHistory(): Promise<boolean> {
        if (this.core.DB !== null) {
            try {
                await this.core.DB.execute(`
                    CREATE TABLE IF NOT EXISTS clientUpdateHistory (
                        id TEXT PRIMARY KEY,
                        clientId TEXT,
                        field TEXT,
                        value TEXT,
                        createdAt TEXT,
                        by TEXT,
                    );
                `);
                if (this.debug) console.log(`ClientDB.setupClientUpdateHistory method success`);
                return true;
            } catch (error) {
                if (this.debug) console.log(`ClientDB.setupClientUpdateHistory method failed: ${(error as Error).message}`);
                return false;
            }
        }
        if (this.debug) console.log(`ClientDB.setupClientUpdateHistory method failed: DB is null`);
        return false;
    }

    public async setupClientImages(): Promise<boolean> {
        if (this.core.DB !== null) {
            try {
                await this.core.DB.execute(`
                    CREATE TABLE IF NOT EXISTS clientImages (
                        id TEXT PRIMARY KEY,
                        image TEXT,
                        createdAt TEXT,
                    );
                `);
                if (this.debug) console.log(`ClientDB.setupClientImages method success`);
                return true;
            } catch (error) {
                if (this.debug) console.log(`ClientDB.setupClientImages method failed: ${(error as Error).message}`);
                return false;
            }
        }
        if (this.debug) console.log(`ClientDB.setupClientImages method failed: DB is null`);
        return false;
    }
}
