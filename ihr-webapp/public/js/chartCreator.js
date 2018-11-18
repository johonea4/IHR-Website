'use-strict';

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

function createChart(context, chartType, chartTitle = 'My Chart')
{
    var myChart = new Chart(context, {
        type: chartType,
        data: {
            labels: buildDataLabels(),
            datasets: [{
                label: chartTitle,
                data: buildDataModel(),
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
        options: buildDataOptions()
    });
}