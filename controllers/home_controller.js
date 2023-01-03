const File = require("../models/file");



/*
Route            /
Description      Renders the home page
Access           PUBLIC
Parameter        None
Methods          GET
*/

module.exports.home = function (req, res) {
  File.find({}, function (err, files) {
    return res.render("home", {
      title: "CSV File Reader",
      files: files,
    });
  });
};

