import { faker} from "@faker-js/faker";
import { CoreDB } from "./Core";

export type IClient = {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    notes: string;
    type: "Individual" | "Entity";
    created_at: string;
    updated_at: string;
}

export type IClientCreate = Omit<IClient, "id" | "created_at" | "updated_at">;

class Client {
    private core = new CoreDB(false);
    constructor(public debug: boolean = true) {

    }
    public async disconnect(): Promise<boolean> {
        if (this.core.DB !== null) {
            let rslt = false;
            try {
                await this.core.close();
                if (this.debug) console.log("DB: Closed");
                rslt = true;
            } catch (error) {
                console.error(`Error Closing DB: ${(error as Error).message}`);
                rslt = false;
            }
            return rslt;
        } else {
            return false;
        }
    }
    public async connect(): Promise<boolean> {
        if (this.core.DB === null) {
            let rslt = false;
            try {
                rslt = await this.core.init();
                if (this.debug) console.log("DB: Connected");
            } catch (error) {
                console.error(`Error Connecting DB: ${(error as Error).message}`);
                rslt = false;
            }
            return rslt;
        } else {
            return false;
        }
    }
    public async setup(): Promise<boolean> {
        if (this.core.DB !== null) {
            let rslt = false;
            console.log(123);

            try {
                await this.core.DB.execute(`CREATE TABLE IF NOT EXISTS clients (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    phone TEXT,
                    email TEXT,
                    address TEXT,
                    notes TEXT,
                    type TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
                )`);
                if (this.debug) console.log("DB: Clients Table Created");
                rslt = true;
            } catch (error) {
                console.error(`Error Creating Clients Table: ${(error as Error).message}`);
                rslt = false;
            }
            return rslt;
        } else {
            return false;
        }
    }

    public async add(client: IClientCreate): Promise<boolean> {
        if (this.core.DB !== null) {
            let rslt = false;
            try {
                await this.core.DB.execute(`INSERT INTO clients (name, phone, email, address, notes, type) VALUES (?, ?, ?, ?, ?, ?)`, [
                    client.name,
                    client.phone,
                    client.email,
                    client.address,
                    client.notes,
                    client.type
                ]);
                if (this.debug) console.log("DB: Client Added");
                rslt = true;
            } catch (error) {
                console.error(`Error Adding Client: ${(error as Error).message}`);
                rslt = false;
            }
            return rslt;
        } else {
            return false;
        }
    }
    public async getById(id: number, sort: "ASC" | "DESC" = "ASC"): Promise<IClient | null> {
        if (this.core.DB !== null) {
            let rslt: IClient | null = null;
            try {
                const res: IClient[] = await this.core.DB.select<IClient[]>("SELECT * FROM clients WHERE id = ? ORDER BY id " + sort, [id]);
                if (res.length > 0) {
                    rslt = res[0];
                    if (this.debug) console.log("DB: Client Found");
                } else if (res.length === 0) {
                    rslt = null;
                    if (this.debug) console.log("DB: Client Not Found");
                } else {
                    rslt = null;
                    if (this.debug) console.log("DB: Client Not Found");
                }
            } catch (error) {
                console.error(`Error Getting Client By ID: ${(error as Error).message}`);
                rslt = null;
            }
            return rslt;
        } else {
            return null;
        }
    }

    //mark as duprecated and must uze lazy_getAll
     /**
      * @deprecated should use lazy_getAll for better performance
     */
    public async getAll(sort: "ASC" | "DESC" = "ASC"): Promise<IClient[] | null> {
        if (this.core.DB !== null) {
            let rslt: IClient[] | null = null;
            try {
                const res: IClient[] = await this.core.DB.select<IClient[]>("SELECT * FROM clients ORDER BY id " + sort);
                if (res.length > 0) {
                    rslt = res;
                    if (this.debug) console.log("DB: Clients Found");
                } else if (res.length === 0) {
                    rslt = null;
                    if (this.debug) console.log("DB: Clients Not Found");
                } else {
                    rslt = null;
                    if (this.debug) console.log("DB: Clients Not Found");
                }
            } catch (error) {
                console.error(`Error Getting Clients: ${(error as Error).message}`);
                rslt = null;
            }
            return rslt;
        } else {
            return null;
        }
    }

    public async update(id: number, client: IClientCreate): Promise<boolean> {
        if (this.core.DB !== null) {
            let rslt = false;
            try {
                await this.core.DB.execute(`UPDATE clients SET name = ?, phone = ?, email = ?, address = ?, notes = ?, type = ? WHERE id = ?`, [
                    client.name,
                    client.phone,
                    client.email,
                    client.address,
                    client.notes,
                    client.type,
                    id
                ]);
                if (this.debug) console.log("DB: Client Updated");
                rslt = true;
            } catch (error) {
                console.error(`Error Updating Client: ${(error as Error).message}`);
                rslt = false;
            }
            return rslt;
        } else {
            return false;
        }
    }

    public async delete(id: number): Promise<boolean> {
        if (this.core.DB !== null) {
            let rslt = false;
            try {
                await this.core.DB.execute(`DELETE FROM clients WHERE id = ?`, [id]);
                if (this.debug) console.log("DB: Client Deleted");
                rslt = true;
            } catch (error) {
                console.error(`Error Deleting Client: ${(error as Error).message}`);
                rslt = false;
            }
            return rslt;
        } else {
            return false;
        }
    }

    public async deleteAll(): Promise<boolean> {
        if (this.core.DB !== null) {
            let rslt = false;
            try {
                await this.core.DB.execute(`DELETE FROM clients`);
                if (this.debug) console.log("DB: Clients Deleted");
                rslt = true;
            } catch (error) {
                console.error(`Error Deleting Clients: ${(error as Error).message}`);
                rslt = false;
            }
            return rslt;
        } else {
            return false;
        }
    }
    public async lazy_getAll(limit: number = 1000, step: number = 0, sort: "ASC" | "DESC" = "ASC", sortBy: keyof IClient = "id"): Promise<IClient[] | null> {
        const offset = limit * step;
        if (this.core.DB !== null) {
            let rslt: IClient[] | null = null;
            try {
                const res: IClient[] = await this.core.DB.select<IClient[]>(`SELECT * FROM clients ORDER BY ${sortBy} ` + sort + ` LIMIT ? OFFSET ?`, [limit, offset]);
                if (res.length > 0) {
                    rslt = res;
                    if (this.debug) console.log("DB: Clients Found");
                } else if (res.length === 0) {
                    rslt = null;
                    if (this.debug) console.log("DB: Clients Not Found");
                } else {
                    rslt = null;
                    if (this.debug) console.log("DB: Clients Not Found");
                }
            } catch (error) {
                console.error(`Error Getting Clients: ${(error as Error).message}`);
                rslt = null;
            }
            return rslt;
        } else {
            return null;
        }
    }
    public async search(query: string, sort: "ASC" | "DESC" = "ASC", sortBy: keyof IClient = "id"): Promise<IClient[] | null> {
        if (this.core.DB !== null) {
            let rslt: IClient[] | null = null;
            try {
                const res: IClient[] = await this.core.DB.select<IClient[]>(`SELECT * FROM clients WHERE name LIKE ? OR phone LIKE ? OR email LIKE ? OR address LIKE ? OR notes LIKE ? OR type LIKE ? ORDER BY ${sortBy} ` + sort, [
                    `%${query}%`,
                    `%${query}%`,
                    `%${query}%`,
                    `%${query}%`,
                    `%${query}%`,
                    `%${query}%`
                ]);
                if (res.length > 0) {
                    rslt = res;
                    if (this.debug) console.log("DB: Clients Found");
                } else if (res.length === 0) {
                    rslt = null;
                    if (this.debug) console.log("DB: Clients Not Found");
                } else {
                    rslt = null;
                    if (this.debug) console.log("DB: Clients Not Found");
                }
            } catch (error) {
                console.error(`Error Getting Clients: ${(error as Error).message}`);
                rslt = null;
            }
            return rslt;
        } else {
            return null;
        }
    }

    public async lazy_search(query: string, limit: number = 1000, step: number = 0, sort: "ASC" | "DESC" = "ASC", sortBy: keyof IClient = "id"): Promise<IClient[] | null> {
        const offset = limit * step;
        if (this.core.DB !== null) {
            let rslt: IClient[] | null = null;
            try {
                const res: IClient[] = await this.core.DB.select<IClient[]>(`SELECT * FROM clients WHERE name LIKE ? OR phone LIKE ? OR email LIKE ? OR address LIKE ? OR notes LIKE ? OR type LIKE ? ORDER BY ${sortBy} ` + sort + ` LIMIT ? OFFSET ?`, [
                    `%${query}%`,
                    `%${query}%`,
                    `%${query}%`,
                    `%${query}%`,
                    `%${query}%`,
                    `%${query}%`,
                    limit,
                    offset
                ]);
                if (res.length > 0) {
                    rslt = res;
                    if (this.debug) console.log("DB: Clients Found");
                } else if (res.length === 0) {
                    rslt = null;
                    if (this.debug) console.log("DB: Clients Not Found");
                } else {
                    rslt = null;
                    if (this.debug) console.log("DB: Clients Not Found");
                }
            } catch (error) {
                console.error(`Error Getting Clients: ${(error as Error).message}`);
                rslt = null;
            }
            return rslt;
        } else {
            return null;
        }
    }

    public async count(): Promise<number> {
        if (this.core.DB !== null) {
            let rslt = 0;
            try {
                const res: { count: number }[] = await this.core.DB.select<{ count: number }[]>(`SELECT COUNT(*) as count FROM clients`);
                if (res.length > 0) {
                    rslt = res[0].count;
                    if (this.debug) console.log("DB: Clients Counted");
                } else if (res.length === 0) {
                    rslt = 0;
                    if (this.debug) console.log("DB: Clients Not Counted");
                } else {
                    rslt = 0;
                    if (this.debug) console.log("DB: Clients Not Counted");
                }
            } catch (error) {
                console.error(`Error Counting Clients: ${(error as Error).message}`);
                rslt = 0;
            }
            return rslt;
        } else {
            return 0;
        }
    }
}

export function clGenerator(): IClientCreate {
  return {
    name: faker.person.fullName(),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(false),
    notes: faker.lorem.paragraph(),
    type: Math.random() > 0.5 ? "Individual" : "Entity"
  }
}
const client = new Client(false);
export default client;

