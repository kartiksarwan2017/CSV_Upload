const File = require("../models/file");
const fs = require("fs");
const path = require("path");
const csv = require('csv-parser'); //requiring csv-parser to parse csv file


/*
Route            /file/upload
Description      Performs operation to upload the csv file
Access           PUBLIC
Parameter        None
Methods          POST
*/
module.exports.upload = async (req, res) => {

  try{

    const file = await File.find({});
    // If there is no file uploaded, then delete existing files from the server

    // if there is no file in the database
    if(file.length == 0){
      const files = await fs.promises.readdir(path.join(__dirname, "..", File.filePath));

      // Delete existing files from the server uploads
      for(let file of files){
        fs.unlinkSync(path.join(__dirname, ".." , File.filePath, file));
      }
    }

  }catch(err){   

    req.flash('error', 'Internal Server Error');
    console.log('Internal Server Error', err);

  }


  try{
    
    // File static function
    await File.uploadedFile(req, res, function(err){

      if(err){
        // Error occured while uploading
        req.flash('error', "Please Upload CSV Format file");
        console.log('Multer Error!', err);
        return res.redirect("/");

      }

      // if file type matches
      if(req.file){
        File.create({originalName: req.file.originalname, filePath: File.filePath + '/' + req.file.filename}, function(err){
          if(err){
            req.flash('error', 'Error in uploading file!');
            console.log("Error in Uploading File", err);
            return res.redirect('/');
          }
        });

        req.flash('success', 'File Successfully Uploaded');
        return res.redirect("/");

      }else{

        req.flash('error', "Please Upload CSV Format file");
        console.log("Please Upload CSV Format file");
        return res.redirect("/");
      }

    });

  }catch(err){

    req.flash('error', 'Internal Server Error!');
    console.log(err);

  }

};



/*
Route            /file/:id
Description      Displays csv file details
Access           PUBLIC
Parameter        id
Methods          GET
*/
// for displaying file
module.exports.display = async function (req, res) {
  try{

    // Finding the requested file
    let file = await File.findById(req.params.id);

    if(file){

      // stores the csv headers
      const header = [];
      // stores the rows
      const results = [];

      const filePath = path.join(__dirname, "..", file.filePath);

      // reading the csv file
      fs.createReadStream(filePath)
      .pipe(csv())
      .on('headers', (headers) => {
        // storing the header
        headers.map((head) => {
          header.push(head);
        });
      })
      .on('data', (data) => results.push(data))
      .on('end', () => {
        // when finished render the file page
        return res.render('file', {
          title: "CSV Details",
          headers: header,
          datas: results
        })
      })

    }else{

      req.flash('error', 'File Not Found!');
      console.log('file Cannot found!');
      res.redirect('/');

    }

  }catch(err){

    req.flash('error', 'Internal Server Error!')
    console.log('Error occured while fetching the file!', err);
    return res.redirect('back');
  }
};



/*
Route            /file/delete/:id
Description      performs operation to delete specific csv file
Access           PUBLIC
Parameter        id
Methods          GET
*/

// for file deletion
module.exports.delete = async function (req, res) {

  try{

    // finding the requested file and deleting from db
    let file = await File.findByIdAndDelete(req.params.id);
    const filePath = path.join(__dirname, "..", file.filePath);

    if(file){

      fs.unlinkSync(filePath,function(err){
        if(err){
          
          req.flash('error', 'Error occured while deleting file!');
          console.log('Error occured while deleting file!', err);
          return res.redirect('back');
        
        }
      });

      req.flash('success', 'File Delete Successfully!');
      console.log('File deleted Successfully!');
      return res.redirect('back');

    }else{
    
      req.flash('error', 'File Not Found!');
      console.log('File Not Found!');
      return res.redirect('/');
    }

  }catch(err){

    
    req.flash('error', 'Internal Server Error');
    console.log('Error Occured in deleting the file!', err);
    return res.redirect('back');

  }

};
