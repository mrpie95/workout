
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

  findSmallestWeight() {
    return Math.min(...this._weights. map(weight => weight._mass)); 
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