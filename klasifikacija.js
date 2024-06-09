function reloadValues() {
    document.getElementById("vnosi").innerHTML = "";
    document.getElementById("racuni").innerHTML = "";
    document.getElementById("prikaz").innerHTML = "";
}

function func() {
    var num = document.getElementById("stAtr").value;
    var vnosiDiv = document.getElementById("vnosi");
    vnosiDiv.innerHTML = "";

    for (let i = 0; i < num; i++) {
        vnosiDiv.innerHTML += `<h3>${i + 1}. atribut</h3> <input id="atr${i}" type='text'><br>`;
    }
    vnosiDiv.innerHTML += `<h3>Ciljni razred</h3> <input id="ciljni" type='text'><br>`;
    vnosiDiv.innerHTML += `<button onclick="func2()">Ovrednoti</button>`;
}

function func2() {
    var num = document.getElementById("stAtr").value;
    var racuniDiv = document.getElementById("racuni");
    racuniDiv.innerHTML = "";

    for (let i = 0; i < num; i++) {
        let attr = document.getElementById("atr" + i).value.split(",");
        let target = document.getElementById("ciljni").value.split(",");

        racuniDiv.innerHTML += `<h5>Entropija ${i + 1}. atributa</h5> ${entropy(attr)} bit <br>`;
        racuniDiv.innerHTML += `<h5>Rezidualna entropija ${i + 1}. atributa</h5> ${residualEntropy(attr, target)} bit<br>`;
        racuniDiv.innerHTML += `<h5>Informacijski prispevek ${i + 1}. atributa</h5> ${gain(attr, target)} bit<br>`;
        racuniDiv.innerHTML += `<h5>Razmerje informacijskega prispevka ${i + 1}. atributa</h5> ${gainRatio(attr, target)} bit<br>`;
    }

    racuniDiv.innerHTML += `<h5>Entropija ciljnega razreda</h5> ${entropy(document.getElementById("ciljni").value.split(","))} bit <br>`;
    racuniDiv.innerHTML += `<button onclick="generateTree()">Izrisi</button>`;
}

function entropy(someClass) {
    var freq = makeFrequencyTable(someClass);
    var total = someClass.length;
    var entropySum = 0;
    for (let [key, value] of freq) {
        var ratio = value / total;
        entropySum -= ratio * Math.log2(ratio);
    }
    return entropySum;
}

function makeFrequencyTable(someClass) {
    var freq = new Map();
    for (var item of someClass) {
        freq.set(item, (freq.get(item) || 0) + 1);
    }
    return freq;
}

function gain(firstClass, secondClass) {
    var totalEntropy = entropy(secondClass);
    var values = Array.from(new Set(firstClass));
    var weightedEntropySum = 0;
    for (var value of values) {
        var subset = secondClass.filter((_, index) => firstClass[index] === value);
        weightedEntropySum += (subset.length / firstClass.length) * entropy(subset);
    }
    return totalEntropy - weightedEntropySum;
}

function gainRatio(firstClass, secondClass) {
    var I = entropy(secondClass);
    var Ires = residualEntropy(firstClass, secondClass);
    var IFirst = entropy(firstClass);
    if (IFirst == 0) {
        return 0;
    }
    return (I - Ires) / IFirst;
}

function residualEntropy(firstClass, secondClass) {
    var values = Array.from(new Set(firstClass));
    var residualEntropy = 0;
    for (var value of values) {
        var subset = secondClass.filter((_, index) => firstClass[index] === value);
        residualEntropy += (subset.length / firstClass.length) * entropy(subset);
    }
    return residualEntropy;
}

function bestAttribute(data, target) {
    var gains = data.map(attribute => gain(attribute, target));
    return gains.indexOf(Math.max(...gains));
}

function buildTree(data, target, attributeNames) {
    if (new Set(target).size === 1) {
        return { type: 'leaf', class: target[0] };
    }
    if (data.length === 0 || attributeNames.length === 0) {
        return { type: 'leaf', class: mostCommonClass(target) };
    }

    var bestAttrIndex = bestAttribute(data, target);
    var bestAttrName = attributeNames[bestAttrIndex];
    var tree = { type: 'node', attribute: bestAttrName, children: {} };
    var uniqueValues = Array.from(new Set(data[bestAttrIndex]));

    for (var value of uniqueValues) {
        var subsetIndices = data[bestAttrIndex].map((item, index) => item === value ? index : -1).filter(index => index !== -1);
        var subsetData = data.map(attribute => subsetIndices.map(index => attribute[index]));
        var subsetTarget = subsetIndices.map(index => target[index]);
        var newAttributeNames = attributeNames.slice();
        newAttributeNames.splice(bestAttrIndex, 1);
        tree.children[value] = buildTree(subsetData, subsetTarget, newAttributeNames);
    }

    return tree;
}

function mostCommonClass(target) {
    var freq = makeFrequencyTable(target);
    var maxCount = 0;
    var mostCommon = null;
    for (let [key, value] of freq) {
        if (value > maxCount) {
            maxCount = value;
            mostCommon = key;
        }
    }
    return mostCommon;
}

function displayTree(node, indent = 0) {
    var spacing = "&nbsp;".repeat(indent * 4);
    if (node.type === 'leaf') {
        document.getElementById('prikaz').innerHTML += `${spacing}Razred: ${node.class}<br>`;
    } else {
        document.getElementById('prikaz').innerHTML += `${spacing}${node.attribute}<br>`;
        for (var value in node.children) {
            document.getElementById('prikaz').innerHTML += `${spacing}Vrednost: ${value}:<br>`;
            displayTree(node.children[value], indent + 1);
        }
    }
}

function generateTree() {
    var num = document.getElementById("stAtr").value;
    var data = [];
    var attributeNames = [];
    for (let i = 0; i < num; i++) {
        data.push(document.getElementById("atr" + i).value.split(","));
        attributeNames.push(`Atribut ${i + 1}`);
    }
    var target = document.getElementById("ciljni").value.split(",");

    var tree = buildTree(data, target, attributeNames);
    document.getElementById('prikaz').innerHTML = '';
    displayTree(tree);
}
