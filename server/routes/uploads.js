const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

module.exports = function(app) {
  app.post('/api/upload', (req, res) => {
    const uploadFolder = path.join(__dirname, "../userimages");
    
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    const form = new formidable.IncomingForm({
      uploadDir: uploadFolder,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024 
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Error parsing the files", err);
        return res.status(400).json({
          status: "Fail",
          message: "There was an error parsing the files",
          error: err,
        });
      }

      const file = files.image;
      if (!file || !file[0]) {
        return res.status(400).json({
          status: "Fail",
          message: "No file uploaded",
        });
      }

      const uploadedFile = file[0];
      const oldPath = uploadedFile.filepath;
      const filename = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${uploadedFile.originalFilename}`;
      const newPath = path.join(uploadFolder, filename);

      fs.rename(oldPath, newPath, function (err) {
        if (err) {
          console.error("Error moving file", err);
          return res.status(500).json({
            status: "Fail",
            message: "There was an error moving the file",
            error: err,
          });
        }

        res.status(200).json({
          status: "OK",
          data: {
            filename: filename,
            size: uploadedFile.size,
            path: `/images/${filename}`
          },
          message: "Upload successful"
        });
      });
    });
  });
};