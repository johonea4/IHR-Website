'use-strict';

function fetchHistory()
{
    //TODO implement
    return null;
}

function createButton(buttonTitle, divID)
{
    
    var list = document.getElementById('historyList');
    var newButton = document.createElement('button');
    newButton.setAttribute('id', divID + '_button');
    newButton.setAttribute('class', 'btn btn-info');
    newButton.setAttribute('data-toggle', 'collapse');
    newButton.setAttribute('data-target', '#'+divID);
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
    paragraph.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    body.appendChild(paragraph);
    
    //TODO create all the content for the body

    //add the new div to the list container
    list.appendChild(newDiv);

    var br = document.createElement('br');
    list.appendChild(br);
}

function createList()
{
    //fetch data
    //var history = fetchHistory();
    for (let index = 0; index < 10; index++) 
    {
        //create button
        var title, name;
        title = "Data ";
        name = "testID";
        createButton(title + index, name);
        //create collapsed element
        populateInfo(name, 'b');
        
    }
}