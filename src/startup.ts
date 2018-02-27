var express = require('express');
var app = express();

app.get('/', function(req:any, res:any) {
  res.send('Hello adios!!');
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');

});
