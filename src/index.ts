// Force Node to use a public DNS that handles SRV records properly
import dns from "node:dns"
dns.setServers(["8.8.8.8", "8.8.4.4"])

import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import AuthRouter from "./routers/authRouter"
import CustomerRouter from "./routers/customerRouter"
import BlogRouter from "./routers/blogRouter"

import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.PORT
console.log("DB_URL =", process.env.DB_URL)
const DB_URL = process.env.DB_URL as string

const app = express()

app.use(cors())
app.use(express.json())

// for request
// app.use((req, res, next) => {
//   console.log(req.body)
//   //
//   // res.send() - backword
//   // next() - forward
//   res.send("noooooooooooo......................")
// })

// app.use(hello)

app.get("/", (req, res) => {
  res.send("OK, (akila)")
})

app.use("/api/v1/customer", CustomerRouter)
app.use("/api/v1/auth", AuthRouter)
app.use("/api/v1/blog", BlogRouter)

// for response
// app.use((req, res, next) => {})

mongoose
  .connect(DB_URL)
  .then(() => {
    // For only DB connect server start
    // app.listen(5000, () => {
    //   console.log("Server is runing on port: 5000")
    // })
    console.log("DB connected...")
  })
  .catch((err) => console.error(err))

app.listen(PORT, () => {
  console.log(`Server is runing on port: ${PORT}`)
})
