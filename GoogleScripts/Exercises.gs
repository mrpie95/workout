class Exercise {
  // Constructor function to initialize the object
  constructor(owner, name, weights, barMass, setName, previousWeight = 0, doubleIncrement = true) {
    this._owner = owner;
    this._name = name;
    this._set = setName;
    this._barMass = barMass;
    this._weights = weights;
    this._previousWeight = previousWeight;
    this._doubleIncrement = doubleIncrement;

    // print(doubleIncrement)
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

  colouredListInUseWeights(returnZeroWeights) {

    // var richText = SpreadsheetApp.newRichTextValue().setText(text)
    // const styles = [{start:0, end: 5, style: boldStyle}, {start:6, end: 9, style: boldStyle2}, {start:10, end: 15, style: boldStyle3}]
    // for (s of styles) richText = richText.setTextStyle(s.start, s.end, s.style);
    // richText = richText.build()

    if(returnZeroWeights){
      let counter = 0 

      let textObjects = this._weights.map(w => {
        const text = `${w._inUse}x${w._mass}`;
        const inUseStart = counter;
        const massStart = counter+2;
        counter += text.length + 1;
        const end = counter-1;

        let inUseStyle = SpreadsheetApp.newTextStyle().setForegroundColor("#674ea7").build();
        let massStyle = SpreadsheetApp.newTextStyle().setForegroundColor("#000000").build();

        if (w._inUse <= 0){
          inUseStyle = SpreadsheetApp.newTextStyle().setForegroundColor("#cccccc").build();
          massStyle = inUseStyle;
        }
        
      
        return {
          text,
          inUseStyle,
          massStyle,
          inUseStart,  
          massStart,  
          end,
        }
      })

      const totalText = textObjects.flatMap(t => t.text).join(" ")

      let richText = SpreadsheetApp.newRichTextValue().setText(totalText)

      for (const t of textObjects){
        const { inUseStyle, massStyle,inUseStart, massStart,end,} = t;


        //in use colouring
        richText = richText.setTextStyle(inUseStart, inUseStart+2, inUseStyle);
        // mass colouring
        richText = richText.setTextStyle(massStart,end, massStyle);
      }

      richText = richText.build()

      return richText;
    }
    else {
       return this._weights.filter(w => w._inUse > 0).map(w =>
        {

          return {
            inUse:  `${w._inUse}x`,
            mass: w._mass
          }
        })
    }  
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

  setPreviousWeights(){
    this._previousWeight = this.currentMass(); 

  }

  incrementWeight() {
    this.setPreviousWeights()

    if (this._doubleIncrement)
      this.findOptimalWeights(this.currentMass() + 2*this.findSmallestWeight(false) - this._barMass)
    else
      this.findOptimalWeights(this.currentMass() + this.findSmallestWeight(false) - this._barMass)

  }


  decrementWeight() {
    this.setPreviousWeights()
    // if (!this._doubleIncrement)
    //   this.findOptimalWeights(this.currentMass() - this.findSmallestWeight(false) - this._barMass)
    // else
      this.findOptimalWeights(this.currentMass() - 2*this.findSmallestWeight(false) - this._barMass)
  }
  

  incrementWeightMini() {
    this.setPreviousWeights()
    //  if (this._doubleIncrement)
    const newWeight = this.currentMass() + 2*this.findSmallestWeight(true) - this._barMass; //new weight to match
     this.findOptimalWeights(newWeight)
    // else
    //   this.findOptimalWeights(this.currentMass() + this.findSmallestWeight(true) - this._barMass)
  }


  decrementWeightMini() {
    this.setPreviousWeights()
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

      if(this._doubleIncrement){
        for (var i = weight._count; i > 0; i-=2) {
          const twoSidedWeight =  i*weight._mass;
          if(twoSidedWeight <= newWeight){          
            weight._inUse = i;
            newWeight -= weight._mass*weight._inUse;
            break;
          }
        }
      }
      else{
        for (var i = weight._count; i > 0; i-=1) {
          const singleSidedWeight =  i*weight._mass;
          if(singleSidedWeight <= newWeight){          
            weight._inUse = i;
            newWeight -= weight._mass*weight._inUse;
            break;
          }
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