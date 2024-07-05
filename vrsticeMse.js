class DecisionTree {
    constructor(data, targetAttribute) {
      this.data = data;
      this.targetAttribute = targetAttribute;
      this.tree = this.buildTree(data, targetAttribute);
    }
  
    meanSquareError(data, targetAttribute) {
      const total = data.length;
      const targetValues = data.map(item => parseFloat(item[targetAttribute]));
      const mean = targetValues.reduce((sum, value) => sum + value, 0) / total;
      const mse = targetValues.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / total;
      return mse;
    }
  
    gain(data, attribute, targetAttribute) {
      const total = data.length;
      const counts = {};
      data.forEach(item => {
        const key = item[attribute];
        if (!counts[key]) counts[key] = [];
        counts[key].push(item);
      });
  
      let weightedMSE = 0;
      for (let key in counts) {
        const subset = counts[key];
        weightedMSE += (subset.length / total) * this.meanSquareError(subset, targetAttribute);
      }
      return this.meanSquareError(data, targetAttribute) - weightedMSE;
    }
  
    majorityVote(data, targetAttribute) {
      const counts = {};
      data.forEach(item => {
        const label = item[targetAttribute];
        if (!counts[label]) counts[label] = 0;
        counts[label]++;
      });
  
      let maxCount = 0;
      let majorityLabel = null;
      for (let label in counts) {
        if (counts[label] > maxCount) {
          maxCount = counts[label];
          majorityLabel = label;
        }
      }
      return majorityLabel;
    }
  
    buildTree(data, targetAttribute, attributes = null) {
      if (!attributes) attributes = Object.keys(data[0]).filter(attr => attr !== targetAttribute);
      const labels = data.map(item => item[targetAttribute]);
  
      // All samples have the same label
      if (new Set(labels).size === 1) {
        return { label: labels[0] };
      }
  
      // No more attributes
      if (attributes.length === 0) {
        return { label: this.majorityVote(data, targetAttribute) };
      }
  
      // Choose the best attribute to split on
      const gains = attributes.map(attr => this.gain(data, attr, targetAttribute));
      const maxGain = Math.max(...gains);
      const bestAttrIndex = gains.indexOf(maxGain);
      const bestAttr = attributes[bestAttrIndex];
  
      // Create a node for this attribute
      const tree = { attribute: bestAttr, branches: {} };
      const remainingAttributes = attributes.filter(attr => attr !== bestAttr);
      const uniqueValues = new Set(data.map(item => item[bestAttr]));
  
      uniqueValues.forEach(value => {
        const subset = data.filter(item => item[bestAttr] === value);
        tree.branches[value] = this.buildTree(subset, targetAttribute, remainingAttributes);
      });
  
      return tree;
    }
  
    predict(sample, tree = this.tree) {
      if (tree.label) {
        return tree.label;
      }
  
      const attributeValue = sample[tree.attribute];
      const branch = tree.branches[attributeValue];
      if (!branch) {
        return null; // or some default label
      }
      return this.predict(sample, branch);
    }
  
    printTree(tree = this.tree, indent = '') {
      if (tree.label) {
        console.log(indent + `Label: ${tree.label}`);
        return;
      }
  
      console.log(indent + `Attribute: ${tree.attribute}`);
      for (let value in tree.branches) {
        console.log(indent + `  ${value}:`);
        this.printTree(tree.branches[value], indent + '    ');
      }
    }
  }
  
  // Example usage
  const data = [
    { outlook: 'sunny', temperature: 'hot', humidity: 'high', windy: false, play: '25' },
    { outlook: 'sunny', temperature: 'hot', humidity: 'high', windy: true, play: '30' },
    { outlook: 'overcast', temperature: 'hot', humidity: 'high', windy: false, play: '46' },
    { outlook: 'rainy', temperature: 'mild', humidity: 'high', windy: false, play: '45' },
    { outlook: 'rainy', temperature: 'cool', humidity: 'normal', windy: false, play: '52' },
    { outlook: 'rainy', temperature: 'cool', humidity: 'normal', windy: true, play: '23' },
    { outlook: 'overcast', temperature: 'cool', humidity: 'normal', windy: true, play: '43' },
    { outlook: 'sunny', temperature: 'mild', humidity: 'high', windy: false, play: '35' },
    { outlook: 'sunny', temperature: 'cool', humidity: 'normal', windy: false, play: '38' },
    { outlook: 'rainy', temperature: 'mild', humidity: 'normal', windy: false, play: '46' },
    { outlook: 'sunny', temperature: 'mild', humidity: 'normal', windy: true, play: '48' },
    { outlook: 'overcast', temperature: 'mild', humidity: 'high', windy: true, play: '52' },
    { outlook: 'overcast', temperature: 'hot', humidity: 'normal', windy: false, play: '44' },
    { outlook: 'rainy', temperature: 'mild', humidity: 'high', windy: true, play: '30' }
  ];
  
  const targetAttribute = 'play';
  const decisionTree = new DecisionTree(data, targetAttribute);
  
  // Print the decision tree
  decisionTree.printTree();
  
  // Test prediction
  const testSample = { outlook: 'sunny', temperature: 'cool', humidity: 'high', windy: true };
  const prediction = decisionTree.predict(testSample);
  console.log('Prediction:', prediction);
  