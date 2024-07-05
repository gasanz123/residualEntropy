class DecisionTree {
    constructor(data, targetAttribute) {
      this.data = data;
      this.targetAttribute = targetAttribute;
      this.tree = this.buildTree(data, targetAttribute);
    }
  
    entropy(data, targetAttribute) {
      const total = data.length;
      const counts = {};
      data.forEach(item => {
        const label = item[targetAttribute];
        if (!counts[label]) counts[label] = 0;
        counts[label]++;
      });
  
      let entropy = 0;
      for (let label in counts) {
        const p = counts[label] / total;
        entropy -= p * Math.log2(p);
      }
      return entropy;
    }
  
    gain(data, attribute, targetAttribute) {
      const total = data.length;
      const counts = {};
      data.forEach(item => {
        const key = item[attribute];
        if (!counts[key]) counts[key] = [];
        counts[key].push(item);
      });
  
      let weightedEntropy = 0;
      for (let key in counts) {
        const subset = counts[key];
        weightedEntropy += (subset.length / total) * this.entropy(subset, targetAttribute);
      }
      return this.entropy(data, targetAttribute) - weightedEntropy;
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
    { outlook: 'sunny', temperature: 'hot', humidity: 'high', windy: false, play: 'no' },
    { outlook: 'sunny', temperature: 'hot', humidity: 'high', windy: true, play: 'no' },
    { outlook: 'overcast', temperature: 'hot', humidity: 'high', windy: false, play: 'yes' },
    { outlook: 'rainy', temperature: 'mild', humidity: 'high', windy: false, play: 'yes' },
    { outlook: 'rainy', temperature: 'cool', humidity: 'normal', windy: false, play: 'yes' },
    { outlook: 'rainy', temperature: 'cool', humidity: 'normal', windy: true, play: 'no' },
    { outlook: 'overcast', temperature: 'cool', humidity: 'normal', windy: true, play: 'yes' },
    { outlook: 'sunny', temperature: 'mild', humidity: 'high', windy: false, play: 'no' },
    { outlook: 'sunny', temperature: 'cool', humidity: 'normal', windy: false, play: 'yes' },
    { outlook: 'rainy', temperature: 'mild', humidity: 'normal', windy: false, play: 'yes' },
    { outlook: 'sunny', temperature: 'mild', humidity: 'normal', windy: true, play: 'yes' },
    { outlook: 'overcast', temperature: 'mild', humidity: 'high', windy: true, play: 'yes' },
    { outlook: 'overcast', temperature: 'hot', humidity: 'normal', windy: false, play: 'yes' },
    { outlook: 'rainy', temperature: 'mild', humidity: 'high', windy: true, play: 'no' }
  ];


  
  const targetAttribute = 'play';
  const decisionTree = new DecisionTree(data, targetAttribute);
  
  // Print the decision tree
  decisionTree.printTree();
  
  // Test prediction
  const testSample = {Alt: 'T', Bar: 'T', Fri: 'F', Hun: 'T', Pat: 'Full', Price: '$', Rain: 'F', Res: 'F', Type: 'Burger', Est: '30-60' };
  const prediction = decisionTree.predict(testSample);
  console.log('Prediction:', prediction);
  