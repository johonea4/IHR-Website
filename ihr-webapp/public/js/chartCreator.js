'use-strict';

function createChart(context, chartType, data, dataSetLabel = 'Dataset')
{
    data = cleanData(data);
    var cleandata = JSON.parse(data);
    //console.logconsole.logconsole.log(cleandata.medications.length);
    var labels = buildDataLabels();  //label names 
    var model = buildDataModel();    //numerical values on y axis
    var options = buildDataOptions(); //need to ask...
    var colors;
    var backgroundColor;
    var borderColor;
    switch(chartType)
    {
        case 'bar':
            labels = buildHoursVsDaysLabels(cleandata.medications);
            model = buildHoursVsDaysModel(cleandata.medications);
            colors = dynamicColors(model.length);
            backgroundColor = colors[0];
            borderColor = colors[1];
            options = buildHoursVsDaysOptions();
        break;
        case 'horizontalBar':
            labels = buildPuffsVsTabletsLabels(cleandata.medications);
            model = buildPuffsVsTabletsModel(cleandata.medications);
            colors = dynamicColors(model.length);
            backgroundColor = colors[0];
            borderColor = colors[1];
            options = buildPuffsVsTabletsOptions();
        break;
        case 'line':
            var myChart = new Chart(context, {
                type: chartType,
                data: {
                    labels: buildDataLabels(),
                    datasets: [ buildRandomDataset('Asprin', 'red', 20, 25), 
                    buildRandomDataset('Tylenol', 'blue', 9, 15), 
                    buildRandomDataset('Naproxen', 'green', 1, 7) ]
                },
                options: options
            });
            return;
        break;
        case 'doughnut':
            labels = buildDoughnutLabels(cleandata.medications);
            model = buildDoughnutModel(cleandata.medications);
            //options = Chart.defaults.doughnut;//buildDataOptions();
            colors = dynamicColors(model.length);
            backgroundColor = colors[1];
            options = {
                responsive: true,
                legend:{ position: 'top' },
                title:{
                    display:true,
                    text:'Dosage counter per Medication'
                },
                animation:{
                    animateScale: true,
                    animateRotate: true
                }
            };
        break;
    }

    var myChart = new Chart(context, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: dataSetLabel,
                data: model,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 3
            }]
        },
        options: options
    });
}

function dynamicColors(autoGenerateCount)
{
    var backgroundColors = [];
    var borderColors=[];

    var backgroundColor;
    var borderColor;

    for(let index = 0; index < autoGenerateCount; index++)
    {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        backgroundColor ="rgb(" + r + "," + g + "," + b + ", 0.2)";
        borderColor ="rgb(" + r + "," + g + "," + b + ", 1)";
        backgroundColors.push(backgroundColor);
        borderColors.push(borderColor);
    }
    return [ backgroundColors, borderColors ]
}

function buildRandomDataset(name, color, seedMin, seedMax)
{
    return {
        label: name,
        backgroundColor: color,
        borderColor: color,
        data: [ getRandomInt(seedMin, seedMax),
             getRandomInt(seedMin, seedMax), getRandomInt(seedMin, seedMax), getRandomInt(seedMin, seedMax),
              getRandomInt(seedMin, seedMax), getRandomInt(seedMin, seedMax), getRandomInt(seedMin, seedMax),
               getRandomInt(seedMin, seedMax), getRandomInt(seedMin, seedMax), getRandomInt(seedMin, seedMax),
               getRandomInt(seedMin, seedMax) , getRandomInt(seedMin, seedMax), getRandomInt(seedMin, seedMax) ],
        fill: false
    }
}

function buildDataModel()
{
    return [12, 19, 3, 5, 2, 3];    //TODO replace with actual data
}

function buildDataLabels()
{
    return ["July 1st", "July 15th", "August 1st", "August 15th", "September 1st", "September 15th"];
}

function buildDataOptions()
{
    return {scales: { yAxes: [{ ticks: { beginAtZero:true }}]}};
}

function buildPuffsVsTabletsModel(modelData)
{
    var puffs = 0;
    var tablets = 0;
    for(let index = 0; index < modelData.length; index++)
    {
        switch(modelData[index].doseUnits)
        {
            case "tablet":
                tablets++;
                break;
            case "puffs":
                puffs++;
                break;
        }
    }
    console.log(puffs, tablets);
    return [puffs, tablets];
}

function buildPuffsVsTabletsLabels(modelData)
{
    var data = buildPuffsVsTabletsModel(modelData);
    return ['Puffs(' + data[0] + ')', 'Tablets(' + data[1] + ')'];
}

function buildPuffsVsTabletsOptions()
{
    return {
        responsive: true,
        //legend: { position: 'top' },
        title:{
            display:true,
            text:'Medication Administration Method'
        },
        animation: { animateScale:true },
        scales: { 
            yAxes: [ {
                ticks: {
                    beginAtZero:true
                }
            } ],
            xAxes: [ { 
                display: true,
                ticks: {
                    beginAtZero:true,
                    //max: max + 5,
                    //stepSize: 5
                }
            } ]
        }
    };
}

function buildHoursVsDaysModel(modelData)
{
    var hours = 0;
    var days = 0;
    for(let index = 0; index < modelData.length; index++)
    {
        switch(modelData[index].periodUnit)
        {
            case "d":
                days++;
                break;
            case "h":
                hours++;
                break;
        }
    }
    return [hours, days];
}

function buildHoursVsDaysLabels(modelData)
{
    var data = buildHoursVsDaysModel(modelData);
    return ['Hours(' + data[0] + ')', 'Days(' + data[1] + ')'];
}

function buildHoursVsDaysOptions()
{
    return {
        responsive: true,
        //legend: { position: 'top' },
        title:{
            display:true,
            text:'Dosage Period Comparisons (Hours and Days)'
        },
        animation: { animateScale:true },
        scales: { 
            yAxes: [ { 
                ticks: { beginAtZero:true }
            } ]
        }
    };
}

function buildDoughnutModel(data)
{
    return extractCountPerMedicine(data)
}

function buildDoughnutLabels(data)
{
    return extractNames(data);
}

function buildDoughnutOption()
{
    return  {
        cutoutPercentage: 50
    }
}

function extractCountPerMedicine(data)
{
    var counts = [];
    var count;
    for(let index = 0; index < data.length; index++)
    {
        count = data[index].doseQuantity;
        counts.push(count);
    }
    //console.log("this is length of count: ", counts.length);
    return counts;

}

function extractNames(data)
{
    var names = [];
    var name;
    for(let index = 0; index < data.length; index++)
    {
        name = GetCleanTitle(data[index].name);
        name = name.split(/( \d)/)[0];        
        
        name = name.charAt(0).toUpperCase() + name.slice(1);
        //if(names.includes(name)) continue;
        names.push(name);
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

function getRandomInt(minInt, maxInt) 
{
    return Math.floor(((Math.floor(maxInt) - Math.floor(minInt)) * Math.random()) + minInt);
}