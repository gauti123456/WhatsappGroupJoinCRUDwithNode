const express = require("express");
const bodyParser = require("body-parser");
const validUrl = require("valid-url");
const model = require("./models/mongodb");
var methodOverride = require('method-override')
const data = model.find({});
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'))
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    data.exec(function (err, data) {
        if (err) throw err;
        res.render("pages/index", { records: data});
      });
});

app.get("/addgroup", (req, res) => {
  res.render("pages/addOrEdit", {title:"Add Whatsapp Group",record:{}, validLink: true, validWhatsapp: true });
});

app.post("/", (req, res) => {

    if (req.body._id == '')
        addGroup(req, res);
        else
        updateGroup(req, res);

  //console.log(link.length)
});

function addGroup(req,res){
    var name = req.body.name;
  var link = req.body.link;

  if (validUrl.isHttpsUri(link)) {
    console.log("valid link");

    if (validLength(link)) {
      if (validPattern(link)) {
        var details = new model({
          name: name,
          link: link,
        });

        details.save(function (err, doc) {
          if (err) throw err;
          console.log("Data Saved");
          data.exec(function (err, data) {
            if (err) throw err;
            res.render("pages/index", { records: data});
          });
        });
      } else {
        res.render("pages/addOrEdit", {record:{},title:"Add Whatsapp Group", validLink: true, validWhatsapp: false });
      }
    } else {
      res.render("pages/addOrEdit", {record:{},title:"Add Whatsapp Group", validLink: true, validWhatsapp: false });
    }
  } else {
    res.render("pages/addOrEdit", {record:{},title:"Add Whatsapp Group",validLink: false, validWhatsapp: true });
  }
}

function updateGroup(req,res){

    var name = req.body.name;
  var link = req.body.link;

  if (validUrl.isHttpsUri(link)) {
    console.log("valid link");

    if (validLength(link)) {
      if (validPattern(link)) {
        var details = new model({
          name: name,
          link: link,
        });

        model.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('/'); }
    });

        
      } else {
        res.render("pages/addOrEdit", {record:data,title:"Update Whatsapp Group", validLink: true, validWhatsapp: false });
      }
    } else {
      res.render("pages/addOrEdit", {record:data,title:"Update Whatsapp Group", validLink: true, validWhatsapp: false });
    }
  } else {
    res.render("pages/addOrEdit", {record:data,title:"Update Whatsapp Group", validLink: false, validWhatsapp: true });
  }
}



app.get('/:id',(req,res) => {
    var id = req.params.id
    model.findById(id,(err,data) => {
        console.log(data)
        if (err) throw err;
        res.render("pages/addOrEdit",{title:"Update Whatsapp Group", record: data, validLink: true, validWhatsapp: true });
    })
    
    
})

app.get('/delete/:id', (req, res) => {
    model.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});

function validLength(url) {
  var length = 0;
  for (var i = 0; i < url.length; i++) {
    length = length + 1;
  }

  console.log(length);

  if (length === 55) {
    return true;
  } else {
    return false;
  }
}


function validPattern(url) {
  var pattern = "https://chat.whatsapp.com/invite/";

  var targetPattern = [];

  for (var i = 0; i < 33; i++) {
    targetPattern.push(url[i]);
  }

  console.log(targetPattern);

  // compare

  var flag = true;

  for (var i = 0; i < pattern.length; i++) {
    if (targetPattern[i] == pattern[i]) {
      flag = true;
    } else {
      flag = false;
      break;
    }
  }

  if (flag) {
    return true;
  } else {
    return false;
  }
}

app.listen(5000, () => {
  console.log("App is listening on Port 5000");
});
