const EXERCISE_LIST_COL = 'M';
const EXERCISE_LIST_ROW = 2;

const EXERCISE_COL = 'N';
const EXERCISE_ROW = 2;
const INCREMENT_COL = 11

const DASHBOARD_SHEET = 'Dashboard';
const DASHBOARD_PREVIOUS_WEIGHT= 'A';
const DASHBOARD_TOTAL_MASS_COL= 'B';
const DASHBOARD_EXERCISE_NAME = 'C';
const DASHBOARD_WEIGHT_CONFIGURATION = 'D';
const DASHBOARD_OFFSET = 6;

const LOG_SHEET = 'Data';
const LOG_COL = 'A';
const LOG_ROW = 2;

const LOG_DATE_COL = 'A'
const LOG_SET_COL = 'B'
const LOG_NAME_COL = 'C'
const LOG_WEIGHT_COL = 'D'
const LOG_VOLUME_COL = 'J'

const LOG_ALL_LOGS = 'A2:I1000'

const TODAYS_SET_RANGE = 'C4'
const SET_RANGE = 'E6:I8'

const SET_RANGE_START_COL = 'E'
const SET_RANGE_START_ROW = 6


function print(val, json = false){
    if (json)
      SpreadsheetApp.getUi().alert(`${JSON.stringify(val, null, 2)}`);
    else 
      SpreadsheetApp.getUi().alert(`${val}`);
}

function clearLog() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const logSheet = spreadsheet.getSheetByName(LOG_SHEET);
  const dataRange = LOG_ALL_LOGS;
  logSheet.getRange(dataRange).setValue(''); 
}

function saveSetIncrement() {
  saveSet(true)
}

function saveSet(incrementWeights) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const dashboardSheet = spreadsheet.getSheetByName(DASHBOARD_SHEET);
  const dataSheet = spreadsheet.getSheetByName(LOG_SHEET);
  const setRange = SET_RANGE;
  const todaysSet = dashboardSheet.getRange(TODAYS_SET_RANGE).getValue();  

  if (!todaysSet)
    print('Error no set data - reinitialise')

  const exercises = getSet(todaysSet).sort(function(a, b) {
    return b._name.localeCompare(a._name);
  });
  
  const sets = dashboardSheet.getRange(setRange).getValues();
  const startRow = findFirstEmptyCell(LOG_SHEET,'A',1)

  const endRow = startRow+exercises.length-1;
  const setsRange = createRange('E',startRow,'I',endRow)
  
  dataSheet.getRange(setsRange).setValues(sets); 

  //keeps traack of spread sheet rows  
  var rangeOffset = 0;
  var logOffset = 0;

  for (e of exercises){
    const firstSetRange = `${SET_RANGE_START_COL}${SET_RANGE_START_ROW+rangeOffset}`
    const firstSet = dashboardSheet.getRange(firstSetRange).getValue();

    // print(`${LOG_DATE_COL}${startRow+logOffset}`)   

    // if(firstSet != ''){
      //these values represent the logged data
      const dateRange = `${LOG_DATE_COL}${startRow+logOffset}`
      const setRange = `${LOG_SET_COL}${startRow+logOffset}`
      const nameRange = `${LOG_NAME_COL}${startRow+logOffset}`
      const weightRange = `${LOG_WEIGHT_COL}${startRow+logOffset}`
      const volumeRange = `${LOG_VOLUME_COL}${startRow+logOffset}`

      const currentMass = e.currentMass();    
      const volume = sets[logOffset].toString().split(",").reduce((accumulator, currentValue) => accumulator + Number(currentValue)*currentMass,0)

      // print(nameRange)
      
      dataSheet.getRange(dateRange).setValue(getCurrentDate()); 
      dataSheet.getRange(setRange).setValue(todaysSet); 
      dataSheet.getRange(nameRange).setValue(e._name); 
      dataSheet.getRange(weightRange).setValue(currentMass); 
      dataSheet.getRange(volumeRange).setValue(volume); 

      if(incrementWeights){
        e.incrementWeight()
      }

      logOffset++; 
    // }

    rangeOffset++;
  }

  if(incrementWeights){
    var allExervises = load2()

    for (let i = 0; i < allExervises.length; i++) { 
      for (e of exercises){

        if(allExervises[i]._name == e._name){
          allExervises[i] = e;
        }
      }
    }

    saveExercises(allExervises)
  }
  
  populateDashboard();
}

function toggleTodaysSet(){
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const dashboardSheet = spreadsheet.getSheetByName(DASHBOARD_SHEET);
  const todaysSet = dashboardSheet.getRange(TODAYS_SET_RANGE).getValue(); 

  if (todaysSet === 'A')
    dashboardSheet.getRange(TODAYS_SET_RANGE).setValue('B'); 
  else 
    dashboardSheet.getRange(TODAYS_SET_RANGE).setValue('A'); 
}

function clearExerciseSets(){
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const dashboardSheet = spreadsheet.getSheetByName(DASHBOARD_SHEET);
  dashboardSheet.getRange(SET_RANGE).setValue('');
}

function getCurrentDate() {
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  return day + '/' + month + '/' + year;
}


function createRange(startCol, startRow, endCol, endRow){
  return `${startCol}${startRow}:${endCol}${endRow}`
}

//function 

function populateDashboard(intialise) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const dashboardSheet = spreadsheet.getSheetByName(DASHBOARD_SHEET);


  if(intialise){
     dashboardSheet.getRange(TODAYS_SET_RANGE).setValue('A'); 
  }
  else{
    toggleTodaysSet();
  }
  
  clearExerciseSets()

  const todaysSet = dashboardSheet.getRange(TODAYS_SET_RANGE).getValue();  
  const exercises = getSet(todaysSet).sort(function(a, b) {
    return b._name.localeCompare(a._name);
  });

  var offset = DASHBOARD_OFFSET;

  for (e of exercises){    
    const nameRange = `${DASHBOARD_EXERCISE_NAME}${offset}`
    const massRange = `${DASHBOARD_TOTAL_MASS_COL}${offset}`
    const weightsRange = `${DASHBOARD_WEIGHT_CONFIGURATION}${offset}`
    const previousWeightRange = `${DASHBOARD_PREVIOUS_WEIGHT}${offset}`

    e.setPreviousWeights();
  
    dashboardSheet.getRange(previousWeightRange).setValue(e._previousWeight); 
    dashboardSheet.getRange(nameRange).setValue(e._name); 
    dashboardSheet.getRange(massRange).setValue(`${e.currentMass()}`); 

    // dashboardSheet.getRange(weightsRange).setValue(e.colouredListInUseWeights())

    const text = e.colouredListInUseWeights(true)

    dashboardSheet.getRange(weightsRange).setRichTextValue(text);




      //----------------------

    //   var oldContent = cell.getValue();
    //   var newContent = "new content";
    //   var space = " ";
    //   var text = oldContent + space + newContent;

    //   var richText = SpreadsheetApp.newRichTextValue().setText(text)

    //   const styles = [{start:0, end: 5, style: boldStyle}, {start:6, end: 9, style: boldStyle2}, {start:10, end: 15, style: boldStyle3}]

    //   for (s of styles) richText = richText.setTextStyle(s.start, s.end, s.style);
    

    // richText = richText.build()
    //   cell2.setRichTextValue(richText);
            
  
  offset++; 

  }
}

function getSet(setName){
  const allExercises = load2();
  return allExercises.filter(e =>  {
    return e._set.includes(setName)
  }
  )
}

function onEdit(e) {
  const sheet = e.range.getSheet();
  const row = e.range.rowStart;
  const col = e.range.columnStart;
  sheet.getRange(row, col).uncheck();

  const increment = INCREMENT_COL;
  const decrement = increment-1;

  const incrementMini = INCREMENT_COL+3;
  const decrementMini = incrementMini-1;

  if ((col != increment && row <= 6 && row >= 10) || (col != decrement && row <= 6 && row >= 10))
    return false

  var listOffset = 7;
  var nameOffset = 8 ;
  var totalMassOffset = 9;
  var previousWeightOffset = 10;

  switch (col){   
    case decrement:
        listOffset -= 1;
        nameOffset -= 1;
        totalMassOffset -= 1;
      break;

    case incrementMini:      
        listOffset += 3;
        nameOffset += 3;
        totalMassOffset += 3;
      break;

    case decrementMini:
        listOffset += 2;
        nameOffset += 2;
        totalMassOffset += 2;
      break;
  }
  
  const exerciseName = sheet.getRange(row, col - nameOffset).getValue();  
  const exercises = load2();
  const exercise = exercises.find(e => e._name == exerciseName)
        
  switch (col){
    case increment:
       exercise.incrementWeight();
      break;

    case decrement:
      exercise.decrementWeight();
      break;

    case incrementMini:      
      exercise.incrementWeightMini();
      break;

    case decrementMini:
      exercise.decrementWeightMini();
      break;
  }

  saveExercises(exercises)  
  sheet.getRange(row, col-listOffset).setValue(exercise.listInUseWeights())
  sheet.getRange(row, col-totalMassOffset).setValue(`${exercise.currentMass()}kg`)
}

function load2() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LOG_SHEET);
  var emptyRow = findFirstEmptyCell(LOG_SHEET, EXERCISE_COL, EXERCISE_ROW)-1;
  var rawExerciseData = sheet.getRange(`${EXERCISE_COL}${EXERCISE_ROW}:${EXERCISE_COL}${emptyRow}`).getValues()
  var exercises = []
  
  for (rawE of rawExerciseData){
    var myObject = JSON.parse(rawE) 
    var weights = []

    for (const weight of myObject._weights){
      const {_mass, _count, _inUse} = weight;
      weights.push(new Weight(_mass, _count, _inUse))
    }
    exercises.push( new Exercise(myObject._owner, myObject._name, weights, myObject._barMass, myObject._set))
  }
  return exercises
}

function initialiseExercises() {
  const availbleWeights = [ new Weight(0.5, 4, 0), new Weight(1.25, 4, 2),  new Weight(2.5, 4, 0),  new Weight(5, 2, 0),  new Weight(10, 2, 0),new Weight(20, 2, 0)]
  const exercises = []
  exercises.push(new Exercise('Kyra','Bench Press', availbleWeights, 7, 'A', false))
  exercises.push(new Exercise('Kyra','Shoulder Press', availbleWeights, 7,'B', false))
  exercises.push(new Exercise('Kyra','Dead Lift', availbleWeights, 7,'B', false))
  exercises.push(new Exercise('Kyra','Squat', availbleWeights, 7,'AB', false))
  exercises.push(new Exercise('Kyra','Barbell Row', availbleWeights, 7, 'A', false))
  saveExercises(exercises)

  populateDashboard(true)

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const logSheet = spreadsheet.getSheetByName(LOG_SHEET);
  
  var offset = 0

  for (e of exercises){
    logSheet.getRange(`${EXERCISE_LIST_COL}${EXERCISE_LIST_ROW+offset}`).setValue(e._name)
    offset++
  }
}

function saveExercises(exercises){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LOG_SHEET);  
  var offset = 0

  for (const e of exercises){
    sheet.getRange(`${EXERCISE_COL}${EXERCISE_ROW+offset}`).setValue(JSON.stringify(e) )
    offset++
  }
}

