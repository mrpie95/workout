// custom menu function
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Menu')
      .addItem('Save Data','saveData')
      .addToUi();
}


function intialiseExercises() {
  const availbleWeights = [ new Weight(1.25, 4, 2),  new Weight(2.5, 4, 0),  new Weight(5, 2, 0),  new Weight(10, 2, 0),new Weight(20, 2, 0)]

  var exercises = []
  exercises.push(new Exercise('Kyra','Bench Press', availbleWeights, 7))
  // exercises.push(new Exercise('Michael','Bench Press', availbleWeights, 7))
  // exercises.push(new Exercise('Michael','Shoulder Press', availbleWeights, 7))
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ky Data");  
  var offset = 29

  for (const e of exercises){
    sheet.getRange(`B${offset}`).setValue(JSON.stringify(e) )
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

function loadExercises() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ky Data");
  var myObject = JSON.parse(sheet.getRange("B29").getValue())  
  var weights = []

  for (const weight of myObject._weights){
    const {_mass, _count, _inUse} = weight;
    weights.push(new Weight(_mass, _count, _inUse))
  }

  var exercise = new Exercise(myObject._owner, myObject._name, weights, myObject._barMass)


  SpreadsheetApp.getUi().alert(exercise.currentMass())

  exercise.incrementBySmallestWeight()
  
  SpreadsheetApp.getUi().alert(exercise.currentMass())

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ky Data");
  
  sheet.getRange("B29").setValue(JSON.stringify(exercise, null, 2))

  // SpreadsheetApp.getUi().alert()
  // SpreadsheetApp.getUi().alert(JSON.stringify(exercise, null, 2))
}

function loadExercises2() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ky Data");
  var myObject = JSON.parse(sheet.getRange("B29").getValue())  
  var weights = []

  for (const weight of myObject._weights){
    const {_mass, _count, _inUse} = weight;
    weights.push(new Weight(_mass, _count, _inUse))
  }

  var exercise = new Exercise(myObject._owner, myObject._name, weights, myObject._barMass)



  // SpreadsheetApp.getUi().alert(exercise.maxMass())
  // SpreadsheetApp.getUi().alert(exercise.currentMass())
  // SpreadsheetApp.getUi().alert(JSON.stringify(exercise, null, 2))
  
  SpreadsheetApp.getUi().alert(exercise.currentMass())

  exercise.decrementBySmallestWeight()
  
  SpreadsheetApp.getUi().alert(exercise.currentMass())

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ky Data");
  
  sheet.getRange("B29").setValue(JSON.stringify(exercise, null, 2))

  // SpreadsheetApp.getUi().alert()
  // SpreadsheetApp.getUi().alert(JSON.stringify(exercise, null, 2))
}


class Exercise {
  // Constructor function to initialize the object
  constructor(owner, name, weights, barMass) {
    this._owner = owner;
    this._name = name;
    this._barMass = barMass;
    this._weights = weights;
  }
  
   currentMass() {
    var totalMass = this._weights.reduce(function(total, weight) {
      return total + weight.mass * weight.inUse
    }, 0);
    
    return totalMass + this._barMass
  }

  maxMass() {
    // Calculate the total mass by summing the masses of all the weights
    var totalMass = this._weights.reduce(function(total, weight) {
      
      return total + weight.mass * weight.count
    }, 0);
    
    return totalMass + this._barMass
  }

  updateAvailbleWeights(availbleWeights){
    // for(a of availbleWeights){
      
    // }
  }

  findSmallestWeight() {
    return Math.min(...this._weights. map(weight => weight.mass)); 
  }

  incrementBySmallestWeight() {
    const newWeight = this.currentMass() + 2*this.findSmallestWeight() - this._barMass; //new weight to match
    this.findOptimalWeights(newWeight)
  }


  decrementBySmallestWeight() {
    var newWeight = this.currentMass() - 2*this.findSmallestWeight() - this._barMass; //new weight to match
    this.findOptimalWeights(newWeight)
  }
  
  //find the optimal weight configuration
  findOptimalWeights(newWeight) {
    // Sort the weights by mass in descending order
    this._weights.sort(function(a, b) {
      return b.mass - a.mass;
    });

    //reset weight configuration
    this._weights.forEach(w => (w._inUse = 0))

    //find the best weight combination 
    for (const weight of this._weights){
      for (var i = weight._count; i > 0; i-=2) {
        const twoSidedWeight =  i*weight._mass;
        if(twoSidedWeight <= newWeight){          
          weight._inUse = i;
          newWeight -= weight._mass*weight._inUse;
          break;
        }
      }

      if (newWeight == 0)
      {
        return true;
      }
      else if (newWeight < 0) {
        return false;
      }

    }
  }
}




class Weight {
  // Constructor function to initialize the object
  constructor(mass, count, inUse) {
    this._mass = mass;
    this._count = count;

    if (inUse > count)
      this._inUse = count;
    else
      this._inUse = inUse;
  }
  
  // Getter method for the mass property
  get mass() {
    return this._mass;
  }
  
  // Setter method for the mass property
  set mass(mass) {
    this._mass = mass;
  }
  
  // Getter method for the count property
  get count() {
    return this._count;
  }
  
  // Setter method for the count property
  set count(count) {
    this._count = count;
  }

  get inUse() {
    return this._inUse;
  }
  
  set inUse(inUse) {
    this._inUse = inUse;
  }
}



