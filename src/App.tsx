import { useEffect, useState } from "react"
import client, { IClient, clGenerator } from "./Libs/Off-DB/Client"
function addCl() {
    (async () => {
        await client.connect()
        await client.setup()
        await client.add(clGenerator())
        await client.disconnect()
    })();
}
async function getClCount(): Promise<number>{
    await client.connect()
    await client.setup()
    const c: number = await client.count()
    await client.disconnect()
    return c
}
async function lazyGetCl(limit: number, step: number): Promise<IClient[]>{
    await client.connect()
    await client.setup()
    const c: IClient[] | null= await client.lazy_getAll(limit, step, "ASC", "id")
    await client.disconnect()
    return c!
}
export default function App() {
    const [count, setCount] = useState<number>(0)
    const [cl, setCl] = useState<IClient[]>([])
    const [page, setPage] = useState<number>(0)
    useEffect(() => {
        getClCount().then((c) => {
            setCount(c)
        })
    }, [])
    useEffect(() => {
        lazyGetCl(10, page).then((c) => {
            setCl(c)
        })
    }, [page])
    //we used useEffect because we want to run the function only once
    //if we don't use useEffect, the function will run every time the component is rendered
    //which will cause the count to be incremented every time the component is rendered
   return (

    <div>
        <h1>Count: {count}</h1>
        //pagination example
        <h1>Page: {page}</h1>
        <button onClick={() => {
            setPage(page + 1)
        }}>Prev</button>

        <ul>
            {cl.map((c) => {
                return (
                    <li key={c.id}>
                        <h1>{c.name}</h1>
                        <p>{c.id}</p>
                    </li>
                )
            })}
        </ul>
    </div>
  )
}
