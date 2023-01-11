class Weight {
  // Constructor function to initialize the object
  constructor(mass, count, inUse) {
    this._mass = mass;
    this._count = count;

    if (inUse > count || !inUse)
      this._inUse = 0;
    else
      this._inUse = inUse;
  }
}
