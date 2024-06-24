

// var barva = ["crna","crna","crna","crna","siva","siva","rumena","rumena","siva","siva","rumena","rumena","crna","siva","bela","bela","bela","bela","bela","bela"]
// var rep = ["kratek","kratek","kratek","kratek","dolg","dolg","dolg","dolg","dolg","dolg","dolg","kratek","dolg","kratek","dolg","dolg","dolg","kratek","kratek","kratek"]
// var klobuk = ["nima","nima","nima","nima","ima","nima","nima","nima","ima","nima","ima","ima","ima","nima","ima","nima","ima","ima","ima","ima"]
// var kruh = ["crn","crn","crn","crn","crn","crn","crn","crn","crn","crn","bel","bel","bel","bel","bel","bel","bel","bel","bel","bel"]

// hotel nadaljevat a izgubil voljo
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
    document.getElementById("igr1").innerHTML = gainRatio(a1,ciljni)
    document.getElementById("igr2").innerHTML = gainRatio(a2,ciljni)
    document.getElementById("igr3").innerHTML = gainRatio(a3,ciljni)
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

function mostImportantAttribute(atributes,secondClass){
    var maxGr = -1
    var index = -1
    for(var i=0;i<atributes.length;i++){
        var trenGr = gainRatio(atributes[i],secondClass)
        if(trenGr > maxGr){
            maxGr = trenGr
            index = i
        }
    }

    return index
}



// determine most important attribute and make frequency table so you can iterate number of categories in most important attribute
// call function partofclass so you get a subset of other attributes for every category

// basically you need to cut set in two parts since the hat has two values
// var noviAtributi = []

// var imaBarva = partOfClass(klobuk,barva,"ima")
// var imaRep = partOfClass(klobuk,rep,"ima")
// var imaKlobuk = partOfClass(klobuk,klobuk,"ima")
// var imaKruh = partOfClass(klobuk,kruh,"ima")

// var nimaBarva = partOfClass(klobuk,barva,"nima")
// var nimaRep = partOfClass(klobuk,rep,"nima")
// var nimaKlobuk = partOfClass(klobuk,klobuk,"nima")
// var nimaKruh = partOfClass(klobuk,kruh,"nima")

// noviAtributi.push(imaBarva)
// noviAtributi.push(imaRep)

// var mia = mostImportantAttribute(noviAtributi,imaKruh)
// console.log(mia)

// noviAtributi = []

// noviAtributi.push(nimaBarva)
// noviAtributi.push(nimaRep)

// var mia = mostImportantAttribute(noviAtributi,nimaKruh)
// console.log(mia)




// var mia = mostImportantAttribute()
// var freq = makeFrequencyTable(atributi[mia])
// var numOfVals = freq.size
// var names2 = []
// console.log(numOfVals)
// for(var i=0;i<numOfVals;i++){
//     //console.log(atributi[mia])
//     var currentClass = partOfClass(atributi[mia],kruh,[...freq][i])
//     console.log(currentClass)
//     names2.push(currentClass)
// }

//console.log(names.indexOf("klobuk"))
//console.log(names2)
// console.log("gainRatio barva: ",gain(barva,kruh))
// console.log("gainRatio rep: ",gain(rep,kruh))
// console.log("gainRatio klobuk: ",gain(klobuk,kruh))






