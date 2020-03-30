let confirmeds = [];
let deaths = [];
let allcountry = [];

    $(document).ready(function() {
        $.get("https://api.covid19api.com/countries", function(data, status) {
            let $countries = $("#countries");
            $.each(data, function(index, value) {
                if (value.Country != '') {
                    $countries.append("<option>" + value.Country + "</option>");
                    allcountry[index] = value.Country;
                }
            });
        });

    $("#countries").change(function() {
            emptyArrays();
            let country = $("#countries").val();
            callData(country).then(resolve=> {
                buildChart();
            });
        });
    });

    async function callData(country) {
        await callConfirmeds(country);
        await callDeaths(country);
    }
    
    function callConfirmeds(country) {
        return $.get("https://api.covid19api.com/country/" + country + "/status/confirmed/live", function(data, status) {
            $.each(data, function(index, value) {
                confirmeds.push({
                    x: formatDate(value.Date),
                    y: value.Cases
                });
            });
        });
    }

    function callDeaths(country) {
        return $.get("https://api.covid19api.com/country/" + country + "/status/deaths/live", function(data, status) {
            $.each(data, function(index, value) {
                deaths.push({
                    x: formatDate(value.Date),
                    y: value.Cases
                });
            });
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
                dataPoints: confirmeds,
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

    function emptyArrays() {
        confirmeds.length = 0;
        deaths.length = 0;
    }

    function formatDate(date) {
        let year = date.substr(0, 4);
        let month = date.substr(5, 2) - 1;
        let day = date.substr(8, 2);
        return new Date(year, month, day);
    }