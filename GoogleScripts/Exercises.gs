
class Exercise {
  // Constructor function to initialize the object
  constructor(owner, name, weights, barMass, setName, incrementBothSides) {
    this._owner = owner;
    this._name = name;
    this._set = setName;
    this._barMass = barMass;
    this._weights = weights;
    this._incrementBothSides = incrementBothSides;
  }


  
   currentMass() {
    
    var totalMass = this._weights.reduce(function(total, weight) {
      return total + weight._mass * weight._inUse
    }, 0);
    
    return totalMass + this._barMass
  }

  maxMass() {
    // Calculate the total mass by summing the masses of all the weights
    var totalMass = this._weights.reduce(function(total, weight) {
      
      return total + weight._mass * weight._count
    }, 0);
    
    return totalMass + this._barMass
  }

  updateAvailbleWeights(availbleWeights){
    // for(a of availbleWeights){
      
    // }
  }

  listInUseWeights() {
      return this._weights.filter(w => w._inUse > 0).map(w => `${w._inUse} x ${w._mass}kg`).join(', ');  
  }

  findSmallestWeight(useSmallestWeight) {
    return Math.min(...this._weights. map(weight => {
      if (useSmallestWeight)
        return weight._mass
        
      if (weight._mass < 1.25)
        return 1000;

      return weight._mass
    })); 
  }

  incrementWeight() {
 
    const newWeight = this.currentMass() + 2*this.findSmallestWeight(false) - this._barMass; //new weight to match
    this.findOptimalWeights(newWeight)
  }


  decrementWeight() {
    var newWeight = this.currentMass() - 2*this.findSmallestWeight(false) - this._barMass; //new weight to match
    this.findOptimalWeights(newWeight)
  }
  

  incrementWeightMini() {
    const newWeight = this.currentMass() + 2*this.findSmallestWeight(true) - this._barMass; //new weight to match
    this.findOptimalWeights(newWeight)
  }


  decrementWeightMini() {
    var newWeight = this.currentMass() - 2*this.findSmallestWeight(true) - this._barMass; //new weight to match
    this.findOptimalWeights(newWeight)
  }
  
  //find the optimal weight configuration
  findOptimalWeights(newWeight) {
    // Sort the weights by mass in descending order
    this._weights.sort(function(a, b) {
      return b._mass - a._mass;
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