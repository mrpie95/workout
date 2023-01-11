function copyRangeWithButton(sourceSheetName, destinationSheetName, sourceRange, destinationRange) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheet = ss.getSheetByName(sourceSheetName);
  var destinationSheet = ss.getSheetByName(destinationSheetName);
  var sourceCellRange = sourceSheet.getRange(sourceRange);
  var cellValues = sourceCellRange.getValues();
  destinationSheet.getRange(destinationRange).setValues(cellValues);
}

function saveSetKyra() {
  // When the button is clicked, call the `copyRangeWithButton` function and pass in the desired values for the variables

  sourceSheet = "Ky Dashboard"
  endSheet = "Ky Log"

  var emptyRow = findFirstEmptyCell("Ky Log", "B", 0)

  if(emptyRow < 0) {
    SpreadsheetApp.getUi().alert("error cells cant be negative")
    return -1;
  }

  var endRange = `A${emptyRow}:D${emptyRow+2}`


  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sourceSheet);
  var currentExercise = sheet.getRange("C3").getValue();
  var sourceRange = ""

  if(currentExercise == "A")
  {
    sourceRange = "B18:E20"
  }
  else if (currentExercise == "B")
  {
    sourceRange = "B22:E24"
  }
  else 
  {
    SpreadsheetApp.getUi().alert("error check that cell C3 in Ky Dashboard still has a value")
    return -1
  }

  copyRangeWithButton(sourceSheet, endSheet, sourceRange, endRange);

}
function findFirstEmptyCell(sourceSheetName, column, offset) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sourceSheetName);
  var numRows = sheet.getLastRow();
  var row = 1+offset;
  var columnNumber = getColumnNumber(column);
  var found = false;
  
  while (row <= numRows+1 && !found) {
    var cellValue = sheet.getRange(row, columnNumber).getValue();
    
    if (cellValue == "") {
      found = true;
    }
    row++;
  }

  if (found) {
    return row - 1
  } else {
    SpreadsheetApp.getUi().alert("No empty cells found in column " + column);
    return -1;
  }
}

// Converts a column string (e.g. "A", "B", "C", etc.) to a column number (e.g. 1, 2, 3, etc.)
function getColumnNumber(column) {
  // Convert the column string to an array of characters
  var chars = column.split("");
  
  // Convert the characters to ASCII codes
  var asciiCodes = chars.map(function(char) {
    return char.charCodeAt(0);
  });
  
  // Subtract 64 from each ASCII code to get the corresponding column number (A = 1, B = 2, C = 3, etc.)
  var columnNumbers = asciiCodes.map(function(code) {
    return code - 64;
  });
  
  // Return the column number
  return columnNumbers[0];
}


