// custom menu function
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Menu').addItem('Save Data', 'saveData').addToUi();
}

function intialiseExercises() {
  const availbleWeights = [
    new Weight(1.25, 4, 2),
    new Weight(2.5, 4, 0),
    new Weight(5, 2, 0),
    new Weight(10, 2, 0),
    new Weight(20, 2, 0),
  ];

  var exercises = [];
  exercises.push(new Exercise('Kyra', 'Bench Press', availbleWeights, 7));
  // exercises.push(new Exercise('Michael','Bench Press', availbleWeights, 7))
  // exercises.push(new Exercise('Michael','Shoulder Press', availbleWeights, 7))

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ky Data');
  var offset = 29;

  for (const e of exercises) {
    sheet.getRange(`B${offset}`).setValue(JSON.stringify(e));
    offset++;
  }
}

//load all exercise and update their weight sets to new weights
function updateAvailableWeights() {}

function setExercises() {
  const availbleWeights = [
    new Weight(1.25, 4, 4),
    new Weight(2.5, 4, 4),
    new Weight(5, 2, 2),
    new Weight(10, 2, 0),
    new Weight(20, 2, 0),
  ];

  const benchPress = new Exercise('Kyra', 'Bench Press', availbleWeights, 7);

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ky Data');

  sheet.getRange('B29').setValue(JSON.stringify(benchPress));
}

function loadExercises() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ky Data');
  var myObject = JSON.parse(sheet.getRange('B29').getValue());
  var weights = [];

  for (const weight of myObject._weights) {
    const { _mass, _count, _inUse } = weight;
    weights.push(new Weight(_mass, _count, _inUse));
  }

  var exercise = new Exercise(
    myObject._owner,
    myObject._name,
    weights,
    myObject._barMass
  );

  // SpreadsheetApp.getUi().alert(exercise.maxMass())
  // SpreadsheetApp.getUi().alert(exercise.currentMass())
  // SpreadsheetApp.getUi().alert(JSON.stringify(exercise, null, 2))

  SpreadsheetApp.getUi().alert(exercise.currentMass());

  exercise.incrementBySmallestWeight();

  SpreadsheetApp.getUi().alert(exercise.currentMass());

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ky Data');

  sheet.getRange('B29').setValue(JSON.stringify(exercise, null, 2));

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
    var totalMass = this._weights.reduce(function (total, weight) {
      return total + weight.mass * weight.inUse;
    }, 0);

    return totalMass + this._barMass;
  }

  maxMass() {
    // Calculate the total mass by summing the masses of all the weights
    var totalMass = this._weights.reduce(function (total, weight) {
      return total + weight.mass * weight.count;
    }, 0);

    return totalMass + this._barMass;
  }

  updateAvailbleWeights(availbleWeights) {
    // for(a of availbleWeights){
    // }
  }

  optimizeWeightDistribution(index) {
    // SpreadsheetApp.getUi().alert(`optimizing: ${index}`)

    const w = this._weights[index];

    if (
      (index < this._weights.length - 1) &
      (this._weights[index]._inUse >= this._weights[index]._count)
    ) {
      SpreadsheetApp.getUi().alert(
        `optimizing: ${index} mass:${w._mass} inUse:${w._inUse} count:${w._count}`
      );

      if (this._weights[index + 1]._inUse < this._weights[index + 1]._count) {
        this._weights[index + 1]._inUse += 2;
        this._weights[index]._inUse = 0;
      }

      this.optimizeWeightDistribution(index + 1);
    }
  }

  // Method to increment the total mass by the smallest weight
  incrementBySmallestWeight() {
    // Sort the weights by mass in ascending order
    this._weights.sort(function (a, b) {
      return a.mass - b.mass;
    });

    // SpreadsheetApp.getUi().alert(`inUse <= count `)

    for (var i = 0; i <= this._weights.length - 1; i++) {
      var w = this._weights[i];
      var wNext = this._weights[i + 1];

      // SpreadsheetApp.getUi().alert(`index: ${i} mass:${w._mass} inUse:${w._inUse} count:${w._count}`)

      if (w._inUse == w._count) {
        SpreadsheetApp.getUi().alert('inuse = count');

        if (wNext._inUse < wNext._count) {
          w._inUse = 0;
          wNext += 2;
        }

        //  this.optimizeWeightDistribution(i);
      } else if (w._inUse < w._count) {
        SpreadsheetApp.getUi().alert('inuse < count');
        w._inUse += 2; // add two weights one for each side
        // this.optimizeWeightDistribution(i);

        break;
      }
    }

    //optimize

    return true;
  }
}

class Weight {
  // Constructor function to initialize the object
  constructor(mass, count, inUse) {
    this._mass = mass;
    this._count = count;

    if (inUse > count) this._inUse = count;
    else this._inUse = inUse;
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
