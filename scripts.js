let confirmed = [];
let deaths = [];
let allData = [];
let allDataConfirmeds = [];
let allDataDeaths = [];

const URL = "https://api.covid19api.com/";

    $(document).ready(function() {
        $.get(URL + "countries", function(countries, status) {
            $.each(countries, function(index, value) {
                if (value.Country != '') {
                    $("#combobox").append("<option value='" + value.Slug + "'>" + value.Country + "</option>");
                }
            });            
        });

    $("#combobox").change(function() {
            cleanArrays();

            if($("#combobox option:selected").val() !== "world"){
                callData($("#combobox option:selected").val()).then(resolve=> {
                    buildChart();
                });
            } else {                
                calledALL().then(resolve => {                    
                    buildChartWorld();                
                });
            }
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

    async function calledALL() { 
        return $.get(URL + "all", await function(data, status) {
            $.each(data, function(index, value) {
                allData.push({
                    x: formatDate(value.Date),
                    y: value.Cases,
                    statusCase: value.Status
                });
            });

            $.each(allData, function(index, value) {
                if(value.statusCase === "confirmed") {
                    allDataConfirmeds.push({
                        x: value.x,
                        y: value.y
                    })
                } else if(value.statusCase === "deaths"){
                    allDataDeaths.push({
                        x: value.x,
                        y: value.y
                    })
                }
            });            
        }).then(alert("Wait ... This request is large and may take a few minutes"));        
    }
   
    function buildArray(data, cases, arrays) {
       arrays.push({
                    x: data,
                    y: cases
                });
    } 

    function buildChartWorld() {
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
                    dataPoints: groupByDateAndSumCases(allDataConfirmeds),
                },
                {
                    indexLabelPlacement: "outside",
                    showInLegend: true,
                    legendText: "Deaths",
                    type: "line", //change it to line, area, column, pie, etc
                    dataPoints: groupByDateAndSumCases(allDataDeaths),
                }
            ]
        };
        $("#chartContainer").CanvasJSChart(options);
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

    function groupByDateAndSumCases(arrays){
        var result = [];
        
        arrays.reduce(function(res, value) {
            if (!res[value.x]) {
                res[value.x] = { x: value.x, y: 0 };
                result.push(res[value.x])
            }
            res[value.x].y += value.y;
            return res;
        }, {});

        return result;
    }
