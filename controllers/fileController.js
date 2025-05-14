const path = require('path');
const fs = require('fs');

exports.uploadFile = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  res.status(200).json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
  });
};


exports.downloadFile = (req, res) => {
  const filename = req.params.filename;

  // Prevent directory traversal
  const safeFilename = path.basename(filename); // safer way
  const uploadDir = path.resolve(process.env.UPLOAD_DIR || 'uploads');
  const filePath = path.resolve(uploadDir, safeFilename);

  // Ensure filePath is inside uploadDir
  if (!filePath.startsWith(uploadDir)) {
    return res.status(403).send('Access denied.');
  }

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) return res.status(404).send('File not found.');
    res.download(filePath);
  });
};

