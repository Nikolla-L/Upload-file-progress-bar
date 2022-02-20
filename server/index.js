const express = require('express')
const multer = require("multer")
const cors = require("cors")
const upload = require("./upload")

const app = express()

app.use(cors({
    origin: '*',
    method: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
}))

app.post("/upload_file", upload.single("file"), (req, res) => {
    if (!req.file) {
        throw Error("missing file!")
    } else {
        res.send({ status: "success" })
    }
  })
  
  app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.statusCode = 400
        res.send({ code: err.code })
    } else if (err) {
        if (err.message === "missing file") {
            res.statusCode = 400
            res.send({ code: "missing file" })
        } else {
            res.statusCode = 500
            res.send({ code: "generic error" })
        }
    }
  })
  
  const server = app.listen(5000, () => {
        const port = server.address().port
    
        console.log("App started at http://localhost:%s", port)
  })