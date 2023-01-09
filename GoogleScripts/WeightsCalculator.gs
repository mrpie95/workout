
function onEdit(e) {
  // get event object data: sheet name, row number and column number
  const sheet = e.range.getSheet();
  const row = e.range.rowStart;
  const col = e.range.columnStart;
  sheet.getRange(row, col).uncheck();

  const increment = 7;
  const decrement = 6;
  
  var exerciseName = 0;

  if (col == increment)
    exerciseName = sheet.getRange(row, col-4).getValue();
  else if (col == decrement)
    exerciseName = sheet.getRange(row, col-3).getValue();  

  
  const exercises = load2(exerciseName);
  const exercise = exercises.find(e => e._name == exerciseName)


  if (col == increment)
    exercise.incrementBySmallestWeight();
  else if (col == decrement)
    exercise.decrementBySmallestWeight();  

  saveExercises(exercises)  
}


function load2(exerciseName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data");
  var emptyRow = findFirstEmptyCell("Data", "A", 10)-1;
  var rawExerciseData = sheet.getRange(`A10:A${emptyRow}`).getValues()
  var exercises = []
  
  for (rawE of rawExerciseData){
    
    var myObject = JSON.parse(rawE) 
    var weights = []

    for (const weight of myObject._weights){
      const {_mass, _count, _inUse} = weight;
      weights.push(new Weight(_mass, _count, _inUse))
    }
    exercises.push( new Exercise(myObject._owner, myObject._name, weights, myObject._barMass))
  }

  return exercises
}


function load(exerciseName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data");
  var emptyRow = findFirstEmptyCell("Data", "A", 10)-1;
  var rawExerciseData = sheet.getRange(`A10:A${emptyRow}`).getValues()
  var exercises = []
  
  for (rawE of rawExerciseData){
    
    var myObject = JSON.parse(rawE) 
    var weights = []

    for (const weight of myObject._weights){
      const {_mass, _count, _inUse} = weight;
      weights.push(new Weight(_mass, _count, _inUse))
    }
    exercises.push( new Exercise(myObject._owner, myObject._name, weights, myObject._barMass))
  }

  return exercises.find(e => e._name == exerciseName)
}


function initialiseExercises() {

  const availbleWeights = [ new Weight(1.25, 4, 2),  new Weight(2.5, 4, 0),  new Weight(5, 2, 0),  new Weight(10, 2, 0),new Weight(20, 2, 0)]

  var exercises = []
  exercises.push(new Exercise('Kyra','Bench Press', availbleWeights, 7))
  exercises.push(new Exercise('Kyra','Shoulder Press', availbleWeights, 7))
  exercises.push(new Exercise('Kyra','Dead Lift', availbleWeights, 7))
  exercises.push(new Exercise('Kyra','Squat', availbleWeights, 7))
  exercises.push(new Exercise('Kyra','Barbell Row', availbleWeights, 7))
  
  saveExercises(exercises)
  
}

function saveExercises(exercises){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data");  
  var offset = 10

  for (const e of exercises){
    sheet.getRange(`A${offset}`).setValue(JSON.stringify(e) )
    offset++
  }
}

//load all exercise and update their weight sets to new weights
function updateAvailableWeights(){

}

function setExercises() {
  const availbleWeights = [ new Weight(1.25, 4, 4),  new Weight(2.5, 4, 4),  new Weight(5, 2, 2),  new Weight(10, 2, 0),new Weight(20, 2, 0)]


  const benchPress = new Exercise('Kyra','Bench Press', availbleWeights, 7);


  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ky Data");
  
  sheet.getRange("B29").setValue(JSON.stringify(benchPress))
}

// function loadExercise() {
//   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data");
//   var myObject = JSON.parse(sheet.getRange("B29").getValue())  
//   var weights = []

//   for (const weight of myObject._weights){
//     const {_mass, _count, _inUse} = weight;
//     weights.push(new Weight(_mass, _count, _inUse))
//   }

//   var exercise = new Exercise(myObject._owner, myObject._name, weights, myObject._barMass)


//   SpreadsheetApp.getUi().alert(exercise.currentMass())

//   exercise.incrementBySmallestWeight()
  
//   SpreadsheetApp.getUi().alert(exercise.currentMass())

//   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ky Data");
  
//   sheet.getRange("B29").setValue(JSON.stringify(exercise, null, 2))


//   // SpreadsheetApp.getUi().alert(JSON.stringify(exercise, null, 2))
// }

// function loadExercises2() {
//   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ky Data");
//   var myObject = JSON.parse(sheet.getRange("B29").getValue())  
//   var weights = []

//   for (const weight of myObject._weights){
//     const {_mass, _count, _inUse} = weight;
//     weights.push(new Weight(_mass, _count, _inUse))
//   }

//   var exercise = new Exercise(myObject._owner, myObject._name, weights, myObject._barMass)



//   // SpreadsheetApp.getUi().alert(exercise.maxMass())
//   // SpreadsheetApp.getUi().alert(exercise.currentMass())
//   // SpreadsheetApp.getUi().alert(JSON.stringify(exercise, null, 2))
  
//   SpreadsheetApp.getUi().alert(exercise.currentMass())

//   exercise.decrementBySmallestWeight()
  
//   SpreadsheetApp.getUi().alert(exercise.currentMass())

//   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ky Data");
  
//   sheet.getRange("B29").setValue(JSON.stringify(exercise, null, 2))

//   // SpreadsheetApp.getUi().alert()
//   // SpreadsheetApp.getUi().alert(JSON.stringify(exercise, null, 2))
// }





