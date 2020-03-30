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
                    $("#combobox-country").append("<option value='" + value.Slug + "'>" + value.Country + "</option>");
                }
            });            
        });
    });

    $("#combobox-filter").change(function() {
        console.log(Entrou);
        if($("#combobox-country option:selected").val() !== "world"){
            buildChart($("#combobox-country").val(), $("#combobox-filter option:selected").val());
        } else {
            buildChartWorld($("#combobox-filter option:selected").val());
        }
    });

    $("#combobox-country").change(function() {
        cleanArrays();
        if($("#combobox-country option:selected").val() !== "world"){ 
            callData($("#combobox-country option:selected").val()).then(resolve=> {                
                buildChart($("#combobox-country").val(), $("#combobox-filter option:selected").val());
            });
        } else {                
            calledALL().then(resolve => {                    
                buildChartWorld($("#combobox-filter option:selected").val());                
            });
        }
    });

    async function callData(slugCountry) {
        await called(slugCountry, "confirmed", confirmed);
        await called(slugCountry, "deaths", deaths);
    }
    
    function called(slugCountry, type, arrays) { 
        return $.get(URL + "country/" + slugCountry + "/status/" + type + "/live", function(data, status) {
            $.each(data, function(index, value) {
                if(value.Cases != 0)
                    buildArray(formatDate(value.Date), value.Cases, arrays);
            });
        });
    }

    async function calledALL() { 
        return $.get(URL + "all", await function(data, status) {
            $.each(data, function(index, value) {
                if(value.Cases != 0) {
                    allData.push({
                        x: formatDate(value.Date),
                        y: value.Cases,
                        statusCase: value.Status
                    });
                }
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
            
            allDataConfirmeds.sort(orderByDate);

            allDataDeaths.sort(orderByDate);
        }).then(alert("Wait ... This request is large and may take a few minutes"));        
    }

    function buildArray(data, cases, arrays) {
       arrays.push({
                    x: data,
                    y: cases
                });

        arrays.sort(orderByDate);
    } 

    function buildChartWorld(filter) {
        let options = {
            title: {
                text: "Covid-19 - WORLD"
            },
            legend: {
                horizontalAlign: "right",
                verticalAlign: "center"
            },
            animationEnabled: true,
            exportEnabled: true,
            data: dataFilter(filter)
        };
        $("#chartContainer").CanvasJSChart(options);
    }

    function buildChart(country, filter) {
        console.log(filter);
        let options = {
            title: {
                text: "Covid-19 - " + country.toUpperCase(),
            },
            legend: {
                horizontalAlign: "right",
                verticalAlign: "center"
            },
            animationEnabled: true,
            exportEnabled: true,
            data: dataFilter(filter)
        };
        $("#chartContainer").CanvasJSChart(options);
    }

    function dataFilter(filter){
        let data = [];
        switch(filter) {
            case "confirmed":
                data.push({
                    indexLabelPlacement: "outside",
                    showInLegend: true,
                    legendText: "Confirmed",
                    type: "line", //change it to line, area, column, pie, etc
                    dataPoints: groupByDateAndSumCases(confirmed),                        
                })
            break;
            case "deaths":
                data.push({
                    indexLabelPlacement: "outside",
                    showInLegend: true,
                    legendText: "Confirmed",
                    type: "line", //change it to line, area, column, pie, etc
                    dataPoints: groupByDateAndSumCases(deaths),                        
                })
            break;
            default:
                data.push({
                        indexLabelPlacement: "outside",
                        showInLegend: true,
                        legendText: "Confirmed",
                        type: "line", //change it to line, area, column, pie, etc
                        dataPoints: groupByDateAndSumCases(confirmed),
                    },
                    {
                        indexLabelPlacement: "outside",
                        showInLegend: true,
                        legendText: "Deaths",
                        type: "line", //change it to line, area, column, pie, etc
                        dataPoints: groupByDateAndSumCases(deaths), 
                    });        
                }
        
        return data
    }

    function cleanArrays() {
        confirmed.length = 0;
        deaths.length = 0;
        allData.length = 0;
        allDataConfirmeds.length = 0;
        allDataDeaths.length = 0;
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

    function orderByDate(date1, date2) {
        return new Date(date2.x) - new Date(date1.x);
    }
