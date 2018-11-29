'use-strict';

function fetchHistory(dataObj)
{
    //TODO implement
    //need ot build out query
    //DO HTTP GET request to get data
}

function createButton(buttonTitle, divID)
{    
    var list = document.getElementById('historyList');
    var newButton = document.createElement('button');
    newButton.setAttribute('id', divID + '_button');
    newButton.setAttribute('class', 'btn btn-info');
    newButton.setAttribute('data-toggle', 'collapse');
    newButton.setAttribute('data-target', '#' + divID);
    newButton.innerHTML = buttonTitle;  //this will most likely be the date
    list.appendChild(newButton);
}

function populateInfo(divID, data)
{
    var list = document.getElementById('historyList');
    //create the collapsable div
    var newDiv = document.createElement('div');
    newDiv.setAttribute('id', divID);
    newDiv.setAttribute('class', 'panel-collapse collapse');

    //create the body
    var body = document.createElement('div');
    body.setAttribute('class', 'panel-body');
    newDiv.appendChild(body);

    //add the content to the body
    var paragraph = document.createElement('p');
    paragraph.innerHTML = "Instructions: " + data.instructions;
    body.appendChild(paragraph);

    //TODO add dosage?
    var dosage = document.createElement('p');
    dosage.innerHTML = "Dosage: " + GetCleanTitle(data.name).split(/ {1}/)[1];
    body.appendChild(dosage);

    //add the new div to the list container
    list.appendChild(newDiv);

    var br = document.createElement('br');
    list.appendChild(br);
}

function createList(userData)
{
    userData = cleanData(userData);
    
    console.log("data: " + userData);
    var meds = JSON.parse(userData);
    //console.log(meds.resource.medicationCodeableConcept.coding[0].system);
    console.log(meds.medications.length);
    console.log(meds.medications[0].name)
    for (let index = 0; index < meds.medications.length; index++) 
    {
        //create button
        var title, name;
        title = GetCleanTitle(meds.medications[index].name);
        console.log(title);
        title = title.split(/( \d)/);
        //console.log("-----------");
        //for(let i = 0; i < title.length; i++)
            //console.log(title[i]);
        //console.log("-----------");
        name = "testID";
        createButton(title[0].toUpperCase(), name + index);
        //create collapsed element
        populateInfo(name + index, meds.medications[index]);        
    }
}

function GetCleanTitle(dirtyData)
{
    var a, b;
    a = dirtyData.indexOf('>') + 1;
    b = dirtyData.lastIndexOf('<');
    return dirtyData.substring(a,b);
}

function cleanData(dirtyData)
{
    dirtyData = dirtyData.replace(new RegExp('&quot;', 'g'), '\"');
    dirtyData = dirtyData.replace(new RegExp('&lt;', 'g'), '<');
    dirtyData = dirtyData.replace(new RegExp('&gt;', 'g'), '>');
    dirtyData = dirtyData.replace(new RegExp('xmlns="', 'g'), 'xmlns=\\"');
    dirtyData = dirtyData.replace(new RegExp('xhtml"', 'g'), 'xhtml\\"');
    return dirtyData;
}