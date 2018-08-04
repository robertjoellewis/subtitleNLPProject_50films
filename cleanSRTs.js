var fs = require('fs');
var Subtitle = require('subtitle');
// Subtitle.parse
// Subtitle.stringify
// Subtitle.stringifyVtt
// Subtitle.resync
// Subtitle.toMS
// Subtitle.toSrtTime
// Subtitle.toVttTime

const Filehound = require('filehound');
const nlp = require('compromise');
const natural = require('natural');
// find all the SRT file in the directory
let txtFileContents = '';
let dataLine = '';
let cleanedTxtFileContents = [];
let namedEntities = {};

var TfIdf = natural.TfIdf;
var tfidf = new TfIdf();

// for creating CML in figure eight

var columnLabel = ''


Filehound.create()
  .ext('srt')
  .paths('subs')
  .find( async (err, srtFiles) => {
    if (err) return console.error("handle err", err);
    //console.log(`Number of SRT files: ${srtFiles.length}`);
    //console.log(srtFiles);
    // write the cleaned txt nonSRT files to another directory
    for (var i = 0; i < srtFiles.length; i++) {
      txtFileContents = '';
      cleanedTxtFileContents = [];
      txtFileContents = fs.readFileSync(srtFiles[i], 'utf8');
      txtFileContents = Subtitle.parse(txtFileContents);
      for (var j = 0; j < txtFileContents.length; j++) {
      columnLabel = `{{text_${j+1}}}\n <cml:radios label="Please rate the line above" name="text_${j+1}_rating" validates="required" gold="true">
                      \n<cml:radio label="Positive" value="1" />\n
                      <cml:radio label="Neutral" value="2" />\n
                      <cml:radio label="Negative" value="3" />\n
                      </cml:radios>\n`
      fs.appendFileSync('CML.txt', columnLabel);
    }
      txtFileContents.forEach((object) => {
        cleanedTxtFileContents.push(object.text);
      })
      cleanedTxtFileContents = cleanedTxtFileContents.join('\n');
      // tfidf.addDocument(cleanedTxtFileContents);
      console.log(`${srtFiles[i]}\nNamed entities:`)

    //   namedEntities = nlp(cleanedTxtFileContents).people().out('topk');
      // namedEntities = nlp(cleanedTxtFileContents).people().out();
      // console.log(namedEntities);
      numLines = txtFileContents.length;
      numWords = cleanedTxtFileContents.trim().split(/\s+/).length;
      dataLine = srtFiles[i].replace(/ /g,'') + ' ' + numLines + ' ' + numWords + '\n';
      fs.appendFileSync('tf-idf.txt', JSON.stringify(tfidf));
      fs.appendFileSync('counts.txt', dataLine);
      // fs.writeFileSync(`txtsubs/${srtFiles[i].replace('subs','')}.txt`, cleanedTxtFileContents)
      fs.writeFileSync(`txtsubs/${srtFiles[i].replace('subs','')}.txt`, cleanedTxtFileContents);
    }
});  // end of Filehound.create()




// let mySub = fs.readFileSync(`subs/avatar.srt`, 'utf8')
// letNumLines = Subtitle.parse(mySub).length
// console.log(`number of lines: ${letNumLines}`)
