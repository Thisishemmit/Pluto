import { useState } from "react";
import client, { IClientCreate, clGenerator } from "./Libs/Off-DB/Client"
const clnt: IClientCreate = {
  name: "Test Client",
  phone: "1234567890",
  email: "ghsjhjsh@gmail.con",
  address: "Test Address",
  notes: "Test Notes",
  type: "Individual"
};
let run = true;
for (let i = 0; i < 100000; i++) {
  if (run) {
    client.add(clGenerator())
    console.log(i);
    
  }
}
export default function App() {
   return (
    <div>
      <button onClick={() => {
        run = false;
      }}>Stop</button>
    </div>
  )
}
