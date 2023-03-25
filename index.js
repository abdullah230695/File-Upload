const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();

const storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {

            cb(null, "uploads");
        }, filename: function (req, file, cb) {

            cb(null, `${file.originalname.replace(/\.[^/.]+$/, "")}_${Date.now()}${path.extname(file.originalname)}`);
        }
    }
);

let maxSize = 10 * 1000 * 1000;

let upload = multer({
    storage: storage,
    limits: {
        fileSize: maxSize
    },
    fileFilter: (req, file, cb) => {
        let fileTypes = /jpeg|jpg|png|.*./;
        let mimeType = fileTypes.test(file.mimetype);
        let extType = fileTypes.test(path.extname(file.originalname));

        console.log("mimeType", mimeType);
        console.log("extType", extType);
        if (mimeType && extType) {
            return cb(null, true);
        }

        cb("Error : Following file  types only supported :" + fileTypes);
    }
}).single("myPic");

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {

        if (err) {
            return res.status(400).send({
                status: "failed",
                msg: err
            });
        }

        res.status(200).send({
            status: "image upload success"
        });
    });
})

app.listen(3000, () => {
    console.log("Server is running ...");
});

