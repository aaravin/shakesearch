const fs = require('fs');
const titleToSectionStart = require('./titleToSectionStart.json');

const contextRange = 1;

class Shakesearch {
  constructor(filepath) {
    this.filepath = filepath;
    this.allLines = [];
    this.allLinesLowerCase = [];
    this.titleToSectionStartMap = titleToSectionStart;
    this.titles = Object.keys(this.titleToSectionStartMap);
    this.sectionStarts = Object.values(this.titleToSectionStartMap);
    this.numSections = this.sectionStarts.length;
  }

  preprocess() {
    // get all line numbers where line text = sectionStart text
    const sectionStartAllLineNumbers = this.sectionStarts.reduce((accum, sectionStart) => {
      accum[sectionStart] = [];
      return accum;
    }, {});
    fs.readFileSync(this.filepath, 'utf-8').split(/\r?\n/).forEach((lineText, lineIndex) => {
      this.allLines.push(lineText);
      this.allLinesLowerCase.push(lineText.toLowerCase());
      const trimmedLineText = lineText.trim();
      if (sectionStartAllLineNumbers[trimmedLineText]) {
        sectionStartAllLineNumbers[trimmedLineText].push(lineIndex);
      }
    });

    // determine which line each section actually starts (if more than one match, then
    // use second matched line because first line is in Table of Contents)
    this.sectionStartLineNumbers = this.sectionStarts.map(sectionStart => {
      const lineNumbers = sectionStartAllLineNumbers[sectionStart];
      return lineNumbers.length > 1 ? lineNumbers[1] : lineNumbers[0];
    });
  }

  search(searchText) {
    const searchTextLowerCase = searchText.toLowerCase();
    let nextSectionIndex = 0;
    const outputHash = {};
    for (let lineNumber = 0; lineNumber < this.allLinesLowerCase.length; lineNumber++) {
      if (this.allLinesLowerCase[lineNumber].includes(searchTextLowerCase)) {
        while (nextSectionIndex < this.numSections && lineNumber >= this.sectionStartLineNumbers[nextSectionIndex]) {
          nextSectionIndex++;
        }
        const currentSectionIndex = nextSectionIndex - 1;
        outputHash[this.titles[currentSectionIndex]] = outputHash[this.titles[currentSectionIndex]] || {};
        outputHash[this.titles[currentSectionIndex]][lineNumber] = [];
        for (let contextLineNumber = lineNumber - contextRange; contextLineNumber <= lineNumber + contextRange; contextLineNumber++) {
          if (contextLineNumber >= 0 && contextLineNumber < this.allLines.length) {
            let lineNumberVal = contextLineNumber + 1; // actual line numbers are not zero-indexed, so +1
            let text = this.allLines[contextLineNumber];
            if (contextLineNumber === lineNumber) {
              // bold line number and highlight text for matched line number
              lineNumberVal = `<b>${contextLineNumber + 1}</b>`;
              text = highlightMatches(this.allLines[contextLineNumber], this.allLinesLowerCase[contextLineNumber], searchTextLowerCase);
            }
            outputHash[this.titles[currentSectionIndex]][lineNumber].push({
              lineNumber: lineNumberVal,
              text,
            });
          }
        }
      }
    }
    return outputHash;
  }
}

function highlightMatches(fullStr, fullLowerCaseStr, searchStr) {
  let startIndex = 0;
  const indices = [];
  while (startIndex < fullLowerCaseStr.length) {
    const matchedIndex = fullLowerCaseStr.indexOf(searchStr, startIndex);
    if (matchedIndex < 0) break;
    indices.push(matchedIndex);
    startIndex = matchedIndex + 1;
  }

  let highlightedString = '';
  startIndex = 0;
  for (let index of indices) {
    const endIndex = index + searchStr.length;
    highlightedString += fullStr.substring(startIndex, index) + `<span class="match">${fullStr.substring(index, endIndex)}</span>`;
    startIndex = endIndex;
  }
  if (startIndex < fullStr.length) {
    highlightedString += fullStr.substring(startIndex);
  }
  return highlightedString;
}

module.exports = Shakesearch;