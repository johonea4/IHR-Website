'use-strict';

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

    var dosage = document.createElement('p');
    dosage.innerHTML = "Dosage: " + GetCleanTitle(data.name).split(/ {1}/)[1];
    body.appendChild(dosage);

    var quantity = document.createElement('p');
    quantity.innerHTML = "Quantity: " + data.doseQuantity;
    body.appendChild(quantity);
    
    var doseunit = document.createElement('p');
    var dose = data.doseUnits;
    dose = dose.charAt(0).toUpperCase() + dose.slice(1);
    doseunit.innerHTML = "Unit: " + dose;
    body.appendChild(doseunit);

    var takeAsNeeded = document.createElement('p');
    var take;
    if(data.asNeeded == true)
        take = "Take this as needed.";
    else
        take = "Take this as perscribed.";
    takeAsNeeded.innerHTML = take;
    body.appendChild(takeAsNeeded);

    //add the new div to the list container
    list.appendChild(newDiv);

    var br = document.createElement('br');
    list.appendChild(br);
}

function createList(userData)
{
    userData = cleanData(userData);
    
    var meds = JSON.parse(userData);

    for (let index = 0; index < meds.medications.length; index++) 
    {
        //do a little bit of data work
        var title, name;
        title = GetCleanTitle(meds.medications[index].name);
        
        title = title.split(/( \d)/);
        name = "testID";

        createButton(title[0].toUpperCase(), name + index); //create button
        populateInfo(name + index, meds.medications[index]); //create collapsed element
    }
}

//Cleans out the title from the html div tags
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