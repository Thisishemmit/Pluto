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
async function getAllCl(): Promise<IClient[]>{
    await client.connect()
    await client.setup()
    const c: IClient[] | null = await client.getAll()
    await client.disconnect()
    return c?.length ? c : []
}
export default function App() {
    const [count, setCount] = useState<number>(0)
    const [cl, setCl] = useState<IClient[]>([])
    useEffect(() => {
        getClCount().then((c) => {
            setCount(c)
        })
    }, [])
    useEffect(() => {
        getAllCl().then((c) => {
            setCl(c)
        })
    }, [])
    //we used useEffect because we want to run the function only once
    //if we don't use useEffect, the function will run every time the component is rendered
    //which will cause the count to be incremented every time the component is rendered
   return (

    <div>
        <h1>Count: {count}</h1>
        <button onClick={addCl}>Add</button>
        <ul>
            {cl.map((c) => {
                return <li>{c.name}</li>
            })}
        </ul>
    </div>
  )
}
