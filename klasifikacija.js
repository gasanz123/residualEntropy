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

        if (new Set(labels).size === 1) {
            return { label: labels[0] };
        }

        if (attributes.length === 0) {
            return { label: this.majorityVote(data, targetAttribute) };
        }

        const gains = attributes.map(attr => this.gain(data, attr, targetAttribute));
        const maxGain = Math.max(...gains);
        const bestAttrIndex = gains.indexOf(maxGain);
        const bestAttr = attributes[bestAttrIndex];

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
            return null;
        }
        return this.predict(sample, branch);
    }

    displayTree(tree = this.tree, indent = 0) {
        const prikazDiv = document.getElementById('prikaz');
        const spacing = '&nbsp;'.repeat(indent * 4);
        if (tree.label) {
            prikazDiv.innerHTML += `${spacing}Label: ${tree.label}<br>`;
        } else {
            prikazDiv.innerHTML += `${spacing}Attribute: ${tree.attribute}<br>`;
            for (let value in tree.branches) {
                prikazDiv.innerHTML += `${spacing}&nbsp;&nbsp;&nbsp;&nbsp;${value}:<br>`;
                this.displayTree(tree.branches[value], indent + 1);
            }
        }
    }
}

// Example usage with HTML input and button handling
function reloadValues() {
    document.getElementById("vnosi").innerHTML = "";
    document.getElementById("prikaz").innerHTML = "";
}

function func() {
    const num = document.getElementById("stAtr").value;
    const vnosiDiv = document.getElementById("vnosi");
    vnosiDiv.innerHTML = "";

    for (let i = 0; i < num; i++) {
        vnosiDiv.innerHTML += `<h3>${i + 1}. atribut</h3> <input id="atr${i}" type='text'><br>`;
    }
    vnosiDiv.innerHTML += `<h3>Ciljni razred</h3> <input id="ciljni" type='text'><br>`;
    vnosiDiv.innerHTML += `<button onclick="func2()">Ovrednoti</button>`;
}

function func2() {
    const num = document.getElementById("stAtr").value;

    const data = [];
    const target = document.getElementById("ciljni").value.split(",");
    const attributes = [];

    for (let i = 0; i < num; i++) {
        const attrValues = document.getElementById("atr" + i).value.split(",");
        attributes.push(`Atribut ${i + 1}`);
        data.push(attrValues.map((val, index) => ({
            [`Atribut ${i + 1}`]: val,
            target: target[index]
        })));
    }

    // Flatten the data array
    const flattenedData = [];
    for (let i = 0; i < target.length; i++) {
        const obj = {};
        for (let j = 0; j < num; j++) {
            obj[`Atribut ${j + 1}`] = data[j][i][`Atribut ${j + 1}`];
        }
        obj['target'] = target[i];
        flattenedData.push(obj);
    }

    const decisionTree = new DecisionTree(flattenedData, 'target');
    document.getElementById('prikaz').innerHTML = '';
    decisionTree.displayTree();
}