var hPP, inpBackup, term, bm25, returnVal, descriptionList, commentList, titleList, usernameList, nameList, bioList, identifierList;

var bNL = [], bCL = [], bBL = [], bUL = [], bTL = [], bDL = [], bIL = [];

var results = [];

var resultsID = [];

var data = [];

var avgScores = [];

var listAll = "listAll";

var next = "++";

var prev = "--";

var three = 1.8; // Tune searching

function arrayJudger(array1, array2){
  arrays = [];
  arrays.push(array1);
  arrays.push(array2);
  var arrayJudge = arrays.shift().filter(function(v) {
      return arrays.every(function(a) {
          return a.indexOf(v) !== -1;
      });
  });

  return arrayJudge.length / ((array1.length + array2.length) / 2);
}

function lDis(a, b) {
  if(a.length === 0){
    return b.length;
  }  
  if(b.length === 0){
    return a.length;
  } 
  var matrix = [];
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
        Math.min(matrix[i][j-1] + 1, // insertion
        matrix[i-1][j] + 1)); // deletion
      }
    }
  }
  resultToRet = matrix[b.length][a.length];
  resultToRet -= (b.length + a.length + arrayJudger(a.split(""), b.split("")));
  return resultToRet;
}

function switchPage(pageNum) {
  try {
    if (pageNum == '++') {
      page++;
      returnVal = results.slice(-(results.length - page * hPP));
      returnVal.length = hPP;
    } else if (pageNum == '--') {
      page--;
      returnVal = results.slice(-(results.length - page * hPP));
      returnVal.length = hPP;
    } else if (pageNum == 'listAll'){
      page = 0;
      returnVal = results;
    } else {
      returnVal = results.slice(-(results.length - pageNum * hPP));
      returnVal.length = hPP;
      page = pageNum;
    }
    returnVal = returnVal.filter(function(n) {
      return n !== undefined;
    });
    var insert = "totResults: " + results.length + ", hitsPerPage: " + hPP + ", term: '" + theTerm + "', ";
    resString =
      '{' + insert + 'page: ' + page + ', results: ' + returnVal.length + ', value: [';
    for (d = 0; d < returnVal.length; d++) {
      resString += "{" + returnVal[d] + "}, ";
    }
    resString = resString.slice(0, -2) + ']}';
  }
  catch (SyntaxError){
    resString = "{totResults: " + results.length + ", hitsPerPage: " + hPP + ", term: '" + term + "', page: " + page + ", results: 0, value: []}";
  }
  return eval('(' + resString + ')');
}

function search(text, documentArray, hitsPerPage) {
  
  term = text.toLowerCase();

  hPP = hitsPerPage;

  var split = term.split(' ');

  var docs = documentArray;

  var avgdl = 0;

  bm25 = [];

  var letters = 'abcdefghijklmnopqrstuvwxyz0123456789ùûüÿàâæçéèêëïîôœșțţşáéíöóőüúűäöüāēīōūυιοβάϊΐύϋΰåäîûŵŷşďňřšťýςσρτυθιοπαδφγηξκλζχψωβνяшертыуиопющэасдфчгйкльжмнбвцхзþðμ '.split(
    ''
  );

  //Edit any below values to tune searching

  var two = 0.75;

  var one = 1.2;

  //end

  var docChars;

  for (i = 0; i < term.length; i++) {
    if (letters.indexOf(term[i]) == -1) {
      letters.push(term[i]);
    }
  }

  for (x = 0; x < docs.length; x++) {
    docs[x] = docs[x].toLowerCase();
    avgdl = (avgdl + docs[x].length) / 2;
    for (i = 0; i < docs[x].length; i++) {
      if (letters.indexOf(docs[x][i]) == -1) {
        docChars = docs[x].split('');
        docChars[i] = ' ';
        docs[x] = docChars.join('');
      }
    }
  }

  for (x = 0; x < docs.length; x++) {
    for (i = 0; i < docs[x].length; i++) {
      if (docs[x][i] == ' ' && docs[x][i + 1] == ' ') {
        docChars = docs[x].split('');
        docChars[i] = '';
        docs[x] = docChars.join('');
      }
    }
  }

  for (x = 0; x < docs.length; x++) {
    var score = 0;
    var distances = 0;
    docSpl = docs[x].split(' ');
    for (m = 0; m < split.length; m++) {
      var thisVal = split[m];
      var count = 0;
      for (f = 0; f < docSpl.length; f++) {
        if (lDis(docSpl[f], thisVal) === 0) {
          distances = distances + (term.length + 1) * 10;
        }
        else if (lDis(docSpl[f], thisVal) == 1) {
          distances = distances + term.length * 4;
        }
        else if (lDis(docSpl[f], thisVal) == 2) {
          distances = distances + term.length * 3;
        }
        else if (docSpl.length > 4 && lDis(docSpl[f], thisVal) == 3){
          distances = distances + term.length * 2.5;
        }
        else if (docSpl.length > 5 && lDis(docSpl[f], thisVal) == 4){
          distances = distances + term.length * 1.6;
        }
        else {
          distances += (docSpl.length - lDis(docSpl[f], thisVal)) - 1;
        }
        if (distances < 0) {
          distances = 0;
        }
      }
      for (b = 0; b < docs.length; b++) {
        if (docs[b].indexOf(thisVal) >= 0) {
          count++;
        }
      }
      count = count / 2;
      idf = Math.log((docs.length - count + 0.5) / (count + 0.5));
      score =
        score +
        idf *
          (docs[x].split(split[m]).length *
            (one + 1) /
            (docs[x].split(split[m]).length +
              one * (1 - two + two * (docs[x].length / avgdl))));
    }
    bm25.push(score + (distances / 1.5));
  }
  var page = 0;
  return bm25;
}

function bind(textQuery, input, hitsPerPage, startPage) {
  try {
    theTerm = textQuery;
    inpBackup = input;
    titleList = [];
    descriptionList = [];
    commentList = [];
    usernameList = [];
    nameList = [];
    identifierList = [];
    bioList = [];
    for (num = 0; num < input.length; num++){
      if (input[num].type == "project"){
        if (input[num].privacy == "1"){
          titleList.push(input[num].title);
          if (input[num].description != ""){
            descriptionList.push(input[num].description);
          } else {
            descriptionList.push(" ");
          }
          if (input[num].identifier != ""){
            identifierList.push(input[num].identifier);
          } else {
            identifierList.push(" ");
          }
          commentList.push(input[num].comments);
          bTL.push(input[num].title);
          bDL.push(input[num].description);
          bIL.push(input[num].identifier);
          bCL.push(input[num].comments);
        }
      } else {
        if (input[num].bio != ""){
          bioList.push(input[num].bio);
        } else {
          bioList.push(" ");
        }
        nameList.push(input[num].name);
        usernameList.push(input[num].username);
        bBL.push(input[num].bio);
        bNL.push(input[num].name);
        bUL.push(input[num].username);
      }
    }
    titles = titleList;
    comments = commentList;
    usernames = usernameList;
    names = nameList;
    bios = bioList;
    descriptions = descriptionList;
    identifiers = identifierList;
    var identifier1 = [], identifier2 = [], identifier3 = [], identifierScores = [];
    for (k=0;k<identifiers.length;k++){
      identifier1.push(identifiers[k].split("-")[0])
      identifier2.push(identifiers[k].split("-")[1])
      identifier3.push(identifiers[k].split("-")[2])
    }
    identifer1 = search(textQuery, identifier1, hitsPerPage);
    identifer2 = search(textQuery, identifier2, hitsPerPage);
    identifer3 = search(textQuery, identifier3, hitsPerPage);
    for (k=0;k<identifier1.length;k++){
      identifierScores.push((identifer1[k] + identifer2[k] + identifer3[k]) / 3)
    }
    titleScores = search(textQuery, titles, hitsPerPage);
    descScores = search(textQuery, descriptions, hitsPerPage);
    var commScores = [];
    for (k = 0; k < comments.length; k++){
      commScores.push(search(textQuery, comments[k], hitsPerPage));
      var sum = 0;
      for (forC = 0; forC < commScores[k].length; forC++){
        sum += commScores[k][forC];
      }
      commScores[k] = sum / commScores[k].length;
      if (commScores[k].toString() == "NaN"){
        commScores[k] = 0;
      }
    }
    nameScores = search(textQuery, names, hitsPerPage);
    uNameScores = search(textQuery, usernames, hitsPerPage);
    bioScores = search(textQuery, bios, hitsPerPage);
    for (i = 0; i < descScores.length; i++){
      avgScores.push((titleScores[i] * 0.4 + descScores[i] * 0.3 + commScores[i] * 0.25 + identifierScores[i] * 0.3) / 4);
      data.push("description: '" + bDL[i] + "', title: '" + bTL[i] + "', _id: '" + inpBackup[i]._id + "', identifier: '" + bIL[i] + "', type: 'project'");
    }
    for (i = 0; i < nameScores.length; i++){
      avgScores.push((nameScores[i] * 0.3 + uNameScores[i] * 0.25 + bioScores[i] * 0.2) / 3.3);
      data.push("username: '" + bUL[i] + "', name: '" + bNL[i] + "', bio: '" + bBL[i] + "', _id: '" + inpBackup[i]._id + "', type: 'user'");
    }
    for (z = 0; z < avgScores.length; z++) {
      var largest = 0;
      for (q = 0; q < avgScores.length; q++) {
        if (avgScores[q] > largest) {
          largest = avgScores[q];
          var curHolder = q;
        }
      }
      avgScores[curHolder] = avgScores[curHolder] - 1;
      resultsID.push(curHolder);
      results.push(data[curHolder]);
    }
    var insert = switchPage(startPage).value;
    if (insert === undefined){
      throw ("Primary page display error in switchPage function");
    }
    var properties = switchPage(startPage);
    delete properties.value;
    return {"success":true, "properties":properties, "results":insert};
  } catch (Error) {
    return {"success":false, "error":Error};
  }
}
