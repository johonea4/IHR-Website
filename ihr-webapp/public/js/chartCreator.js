'use-strict';

function createChart(context, chartType, data, chartTitle = 'My Chart')
{
    data = cleanData(data);
    var cleandata = JSON.parse(data);
    console.log(cleandata.medications.length);
    var labels = buildDataLabels();
    var model = buildDataModel();
    var options = buildDataOptions();
    switch(chartType)
    {
        case 'bar':
        break;
        case 'line':
        break;
        case 'doughnut':
            labels = buildDoughnutLabels(cleandata.medications);
            model = buildDoughnutModel(cleandata.medications);
            options = buildDataOptions();
        break;
    }

    var myChart = new Chart(context, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: chartTitle,
                data: model,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: options
    });
}

function buildDataModel()
{
    return [12, 19, 3, 5, 2, 3];    //TODO replace with actual data
}

function buildDataLabels()
{
    //TODO replace with actual labels
    return ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];
}

function buildDataOptions()
{
    return {scales: { yAxes: [{ ticks: { beginAtZero:true }}]}};
}

function buildDoughnutModel(data)
{

}

function buildDoughnutLabels(data)
{
    console.log(data.medications.length);
    return extractNames(data);
}

function extractNames(data)
{
    console.log("DATA: " + data.id);
    var names;
    var name;
    for(let index = 0; index < data.medications.length; index++)
    {
        name = GetCleanTitle(data.medications[index].name);
        name = name.split(/( \d)/);
        name = name.charAt(0).toUpperCase() + name.slice(1);
        names[index] = name;
    }
    return names;
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

