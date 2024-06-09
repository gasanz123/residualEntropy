

// var barva = ["crna","crna","crna","crna","siva","siva","rumena","rumena","siva","siva","rumena","rumena","crna","siva","bela","bela","bela","bela","bela","bela"]
// var rep = ["kratek","kratek","kratek","kratek","dolg","dolg","dolg","dolg","dolg","dolg","dolg","kratek","dolg","kratek","dolg","dolg","dolg","kratek","kratek","kratek"]
// var klobuk = ["nima","nima","nima","nima","ima","nima","nima","nima","ima","nima","ima","ima","ima","nima","ima","nima","ima","ima","ima","ima"]
// var kruh = ["crn","crn","crn","crn","crn","crn","crn","crn","crn","crn","bel","bel","bel","bel","bel","bel","bel","bel","bel","bel"]

// atributi = []
// names = ["barva","rep","klobuk"]
// atributi.push(barva)
// atributi.push(rep)
// atributi.push(klobuk)

// var unus = ["a","b","b","b","a","b"]
// var duo = ["b","a","a","b","a","b"]
// var tres = ["43","48","45","50","45","45"]
// var centum = ["y","y","x","x","x","x"]

// var d43 = ["true","false","false","false","false","false"]
// var d45 = ["true","false","true","false","true","true"]
// var d48 = ["true","true","true","false","true","true"]
// var d50 = ["true","true","true","true","true","true"]

// console.log(residualEntropy(d43,centum))
// console.log(residualEntropy(d45,centum))
// console.log(residualEntropy(d48,centum))
// console.log(residualEntropy(d50,centum))

// var a1 = [0,0,0,0,1,1,1,1]
// var a2 = [0,0,1,1,0,0,1,1]
// var a3 = [0,1,0,1,0,1,0,1]
// var ciljni = ["R1","R1","R2","R2","R3","R3","R4","R4"]

// console.log(entropy(ciljni))
// console.log(residualEntropy(a1,ciljni))
// console.log(residualEntropy(a2,ciljni))
// console.log(residualEntropy(a3,ciljni))
function reloadValues(){
    document.getElementById("i1o").innerHTML = document.getElementById("i1").value
    document.getElementById("i2o").innerHTML = document.getElementById("i2").value
    document.getElementById("i3o").innerHTML = document.getElementById("i3").value
    document.getElementById("igo").innerHTML = document.getElementById("ig").value

    var a1 = document.getElementById("i1").value.split(",")
    var a2 = document.getElementById("i2").value.split(",")
    var a3 = document.getElementById("i3").value.split(",")
    var ciljni = document.getElementById("ig").value.split(",")
    console.log(a1)
    console.log(a2)
    console.log(a3)
    console.log(ciljni)

    document.getElementById("skupna").innerHTML = entropy(ciljni)
    document.getElementById("a1").innerHTML = residualEntropy(a1,ciljni)
    document.getElementById("a2").innerHTML = residualEntropy(a2,ciljni)
    document.getElementById("a3").innerHTML = residualEntropy(a3,ciljni)
    document.getElementById("g1").innerHTML = gain(a1,ciljni)
    document.getElementById("g2").innerHTML = gain(a2,ciljni)
    document.getElementById("g3").innerHTML = gain(a3,ciljni)
}

document.addEventListener('DOMContentLoaded', function() {

    reloadValues()
    
}, false);




function entropy(someClass){

    var freq = makeFrequencyTable(someClass)

    //entropy
    var summed = someClass.length
    var entSum = 0
    for(let [key,value] of freq){
        var current = value
        var currentRatio = current / summed
        var currentEnt = - currentRatio * Math.log2(currentRatio)
        entSum += currentEnt
    }


    return entSum
}

function makeFrequencyTable(someClass){

  // make labels and count occurences
  var labels = new Set()
  var freq = new Map()
  for(var i=0;i<someClass.length;i++){
      if(!labels.has(someClass[i])){
          labels.add(someClass[i])
          freq.set(someClass[i],1)
      }
      else{
          freq.set(someClass[i],freq.get(someClass[i])+1)
      }
  }
  return freq  
}

function partOfClass(firstClass, secondClass,wantedLabel){
    var goalClass = []
    for(var i=0;i<firstClass.length;i++){
        if(firstClass[i] === wantedLabel){
            goalClass.push(secondClass[i])
        }
    }

    return goalClass
}

function residualEntropy(firstClass, secondClass){
    var freq = makeFrequencyTable(firstClass)
    var rEnt = 0
    for(let [key,value] of freq){
        var weight = value/firstClass.length;
        var goalClass = partOfClass(firstClass,secondClass,key)
        var ent = entropy(goalClass)
        rEnt += weight*ent

    }
    return rEnt
}

function gain(firstClass,secondClass){
    var I = entropy(secondClass)
    var Ires = residualEntropy(firstClass,secondClass)

    return I - Ires
}

function gainRatio(firstClass,secondClass){
    var I = entropy(secondClass)
    var Ires = residualEntropy(firstClass,secondClass)
    var IFirst = entropy(firstClass)

    return (I - Ires) / IFirst
}

function mostImportantAttribute(nodes,secondClass){
    var maxGr = -1
    var index = -1
    for(var i=0;i<nodes.length;i++){
        var currGr = gainRatio(nodes[i].gr,secondClass)
        if(currGr > maxGr && !nodes[i].marked){
            maxGr = currGr
            index = i
        }
    }

    return index
}

function func(){
    var num = document.getElementById("stAtr").value
    for(i=0 ; i<num ; i++){
        document.getElementById("vnosi").innerHTML += `<h3>${i+1}. atribut<h3> <input id="atr${i}"  type='text'><br>`;
    }
    document.getElementById("vnosi").innerHTML += `<h3>Ciljni razred<h3> <input id="ciljni" type='text'><br>`;
    document.getElementById("vnosi").innerHTML += `<button onclick="func2()">Ovrednoti</button>`
}

function func2(){
    var num = document.getElementById("stAtr").value
    for(i=0 ; i<num ; i++){
        document.getElementById("racuni").innerHTML += `<h5>Entropija ${i+1}. atributa<h5> ${entropy(document.getElementById("atr"+i).value)} bita <br>`;
        document.getElementById("racuni").innerHTML += `<h5>Rezidualna entropija ${i+1}. atributa<h5> ${residualEntropy(document.getElementById("atr"+i).value,document.getElementById("ciljni").value)} bita<br>`
        document.getElementById("racuni").innerHTML += `<h5>Infromacijski prispevek ${i+1}. atributa<h5> ${gain(document.getElementById("atr"+i).value,document.getElementById("ciljni").value)} bita<br>`
        document.getElementById("racuni").innerHTML += `<h5>Razmerje infromacijskega prispevka ${i+1}. atributa<h5> ${gainRatio(document.getElementById("atr"+i).value,document.getElementById("ciljni").value)} bita<br>`
    }
    document.getElementById("racuni").innerHTML += `<h5>Entropija ciljnega razreda<h5> ${entropy(document.getElementById("ciljni").value)} bita <br>`;
    document.getElementById("racuni").innerHTML += `<button onclick="func3()">Sortiraj</button>`
}

function func3(){
    let nodes = [];
    var num = document.getElementById("stAtr").value

    for(i=0 ; i<num ; i++){
        nodes.push({id:i,gr:gainRatio(document.getElementById("atr"+i).value,document.getElementById("ciljni").value),marked:false})
    }

    numOfMarked = 0

    while(numOfMarked < num){
        indexAttr = mostImportantAttribute(nodes,document.getElementById("ciljni").value)
        currId = nodes[indexAttr].id
        //currfreq = makeFrequencyTable(document.getElementById("atr"+currId).value)
        document.getElementById("urejeni").innerHTML += `<h5>${currId+1}. atribut<h5> Razmerje infromacijskega prispevka <br> ${nodes[indexAttr].gr} bita<br>`
        nodes[indexAttr].marked = true  
        numOfMarked++;
    }



}






