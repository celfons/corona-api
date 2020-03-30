let confirmed = [];
let deaths = [];
let allcountry = [];
const URL = "https://api.covid19api.com/";

    $(document).ready(function() {
        $.get(URL + "countries", function(countries, status) {
            $.each(countries, function(index, value) {
                if (value.Country != '') {
                    $("#combobox").append("<option value='" + value.Slug + "'>" + value.Country + "</option>");
                    allcountry[index] = value.Country;
                }
            });
        });

    $("#combobox").change(function() {
            cleanArrays();
            callData($("#combobox option:selected").val()).then(resolve=> {
                buildChart();
            });
        });
    });

    async function callData(country) {
        await called(country, "confirmed", confirmed);
        await called(country, "deaths", deaths);
    }
    
    function called(country, type, arrays) { 
        return $.get(URL + "country/" + country + "/status/" + type + "/live", function(data, status) {
            $.each(data, function(index, value) {
                buildArray(formatDate(value.Date), value.Cases, arrays);
            });
        });
    }
   
    function buildArray(data, cases, arrays) {
       arrays.push({
                    x: data,
                    y: cases
                });
    } 

    function buildChart() {
        let options = {
            title: {
                text: "Result Graph"
            },
            legend: {
                horizontalAlign: "right",
                verticalAlign: "center"
            },
            animationEnabled: true,
            exportEnabled: true,
            data: [
                {
                indexLabelPlacement: "outside",
                showInLegend: true,
                legendText: "Confirmed",
                type: "line", //change it to line, area, column, pie, etc
                dataPoints: confirmed,
                },
                {
                    indexLabelPlacement: "outside",
                    showInLegend: true,
                    legendText: "Deaths",
                    type: "line", //change it to line, area, column, pie, etc
                    dataPoints: deaths,
                },
            ]
        };
        $("#chartContainer").CanvasJSChart(options);
    }

    function cleanArrays() {
        confirmed.length = 0;
        deaths.length = 0;
    }

    function formatDate(date) {
        let year = date.substr(0, 4);
        let month = date.substr(5, 2) - 1;
        let day = date.substr(8, 2);
        return new Date(year, month, day);
    }
