// StockTwits Realtime Dashboard
let sector_name = "All";
let symbol_name = "AAPL";
const symbolInfoField = ["prev_close", "open", "volume", 'pe', 'eps'];
const symbolInfoId = ["symbol-pc", "symbol-op", "symbol-vo", "symbol-pe", "symbol-eps"];
const sectorsAPI = "https://stocktwitsbackend.herokuapp.com/sectors";
const searchAPI = "https://stocktwitsbackend.herokuapp.com/search";
const sparklineAPI = "https://stocktwitsbackend.herokuapp.com/sparkline";
const twitsAPI = "https://stocktwitsbackend.herokuapp.com/twits";

// Get API /sectors?sector= and append symbols within that sector to the left
function symbolListSector(sector) {
    $.getJSON(sectorsAPI, {
            sector: sector
        })
        .done(function(data) {
            let t = $("#overview").DataTable();
            $.each(data[Object.keys(data)], function(i, item) {
                t.row.add([
                    '<a class="symbol_a" value=' + item.name + '>' + item.name + '</a>',
                    item["hotness"],
                    item['BS']
                ]).draw(false);
            });
        });
}

function symbolInfo(symbol) {
    $.getJSON(searchAPI, {
            symbol: symbol
        })
        .done(function(data) {
            let record = data['data'].slice(-1)[0];
            $.each(symbolInfoField, function(i, item) {
                document.getElementById(symbolInfoId[i]).innerHTML = record[item]
            })
        })
}

function drawChart(symbol) {
    $.getJSON(sparklineAPI, {
            symbol: symbol
        })
        .done(function(data) {
            function showTooltip(x, y, contents) {
                $('<div id="tooltip">' + contents + '</div>').css({
                    position: 'absolute',
                    display: 'none',
                    top: y - 40,
                    left: x - 10,
                    border: '1px solid #fdd',
                    padding: '2px',
                    'background-color': '#eee',
                    opacity: 0.80
                }).appendTo("body").fadeIn(200);
            }
            var previousPoint = null;
            $("#flot").on("plothover", function(event, pos, item) {
                $("#x").text(pos.x.toFixed(2));
                $("#y").text(pos.y.toFixed(2));
                if (item) {
                    if (previousPoint != item.dataIndex) {
                        previousPoint = item.dataIndex;
                        $("#tooltip").remove();
                        var x = item.datapoint[0] - 1,
                            y = item.datapoint[1];
                        showTooltip(item.pageX, item.pageY,
                            y + " | " + timeData[x]);

                    }
                } else {
                    $("#tooltip").remove();
                    previousPoint = null;
                }

            });
            let priceData = data['price'];
            let bsData = data['BS'];
            let timeData = data['time'];
            let start = data['start'];
            let end = data['end'];
            let data1 = [];
            let data2 = [];
            $.each(priceData, function(i, price) {
                data1.push([i, price]);
            });
            $.each(bsData, function(i, bs) {
                data2.push([i, bs]);
            });
            data = [{
                data: data1,
                label: 'Price',
                lines: {
                    show: true
                },
                yaxis: 1
            }, {
                data: data2,
                label: 'B/S',
                lines: {
                    show: true
                },
                yaxis: 2
            }];
            var options = {
                grid: {
                    hoverable: true
                },
                xaxis: {
                    ticks: [
                        [1, start],
                        [priceData.length - 2, end]
                    ]
                },
                yaxes: [{
                    position: "left"
                }, {
                    position: "right"
                }],
                legend: {
                    noColumns: 4,
                    placement: 'outsideGrid',
                    container: $('#legendHolder')
                }
            };

            $.plot($("#flot"), data, options);
        })
}



function twitsMessage(symbol) {
    if (symbol === "BRKB") {
        symbol = "BRK.B"
    }
    $.getJSON(twitsAPI, {
            symbol: symbol
        })
        .done(function(data) {
            let mdata = data['data'];
            $("#messageTemplate").tmpl(mdata)
                .appendTo("#stream-list");
        })
}

$(document).ready(function() {
    // Handle minimalize left menu
    $('.left-nav-toggle a').on('click', function(event) {
        event.preventDefault();
        $("body").toggleClass("nav-toggle");
    });

    // Handle panel toggle
    $('.panel-toggle').on('click', function(event) {
        event.preventDefault();
        let hpanel = $(event.target).closest('div.panel');
        let icon = $(event.target).closest('i');
        let body = hpanel.find('div.panel-body');
        let footer = hpanel.find('div.panel-footer');
        body.slideToggle(300);
        footer.slideToggle(200);

        // Toggle icon from up to down
        icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        hpanel.toggleClass('').toggleClass('panel-collapse');
        setTimeout(function() {
            hpanel.resize();
            hpanel.find('[id^=map-]').resize();
        }, 50);
    });

    // Handle panel close
    $('.panel-close').on('click', function(event) {
        event.preventDefault();
        let hpanel = $(event.target).closest('div.panel');
        hpanel.remove();
    });

    // Handle filter button selection
    $('.btn-filter').click(function() {
        $('.btn-filter').not(this).removeClass('active'); // remove buttonactive from the others
        $(this).toggleClass('active')
    });

    // Handle Symbol Search
    $("#symbol-search").keypress(function(event) {
        let keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            // get input value
            let val = $(this).val().toUpperCase();
            document.getElementById("symbol-header").innerHTML = val;
            symbolInfo(val);
            document.getElementById("symbol-search").value = "";
            $("#stream-list").empty();
            twitsMessage(val);
        }
    });


    let availableTags = symbols;
    // $("#symbol-search").autocomplete({
    //     source: function(req, add){
    //       add($.map(availableTags, function(element){
    //         return {
    //           label: element.symbol
    //         };
    //       }))
    //     },
    //     response: function(event, ui) {
    //         // ui.content is the array that's about to be sent to the response callback.
    //         if (ui.content.length === 0) {
    //             $("#symbol-search").text("No results found");
    //         } else {
    //             $("#symbol-search").empty();
    //         }
    //     },
    //     select: function(event, ui) {
    //         let val = ui.item.label.toUpperCase();
    //         document.getElementById("symbol-header").innerHTML = val;
    //         symbolInfo(val);
    //         document.getElementById("symbol-search").value = "";
    //         $("#stream-list").empty();
    //         twitsMessage(val);
    //     }
    // });
    var options = {
        data: availableTags,
        getValue: "symbol",
        list: {
            match: {
                enabled: true
            },
            maxNumberOfElements: 6,

            showAnimation: {
                type: "slide",
                time: 300
            },
            hideAnimation: {
                type: "slide",
                time: 300
            },
            onSelectItemEvent: function() {
                let val = $("#symbol-search").getSelectedItemData().symbol;
                document.getElementById("symbol-header").innerHTML = val;
                symbolInfo(val);
                document.getElementById("symbol-search").value = "";
                $("#stream-list").empty();
                twitsMessage(val);
            }
        },
        theme: "plate-dark"
    };
    $("#symbol-search").easyAutocomplete(options);
    // Btn filter click and Refresh and append the symbol list
    let sector_name = "all";
    symbolListSector(sector_name);

    $('.btn-filter').click(function() {
        sector_name = $(this).attr('value');
        $("#overview").DataTable().clear();
        symbolListSector(sector_name);
    });
    // overview setting up
    let overview = $('#overview').DataTable({
        "order": [
            [1, "desc"]
        ],
        "searching": false,
        "paging": false,
        "lengthChange": false,
        "info": false
    });
    // "overview": click on each symbol and refresh symbol-info information
    //// Onload
    // Append symbol info
    let symbol_name = 'AAPL';
    symbolInfo(symbol_name);
    // Draw symbol price
    drawChart(symbol_name);
    // Append Twits
    twitsMessage('all');
    //// Onclick symbol
    $('#overview tbody').on('click', 'td', function() {
        let cell = overview.cell(this).node();
        let value = cell.childNodes[0];
        symbol_name = value.getAttribute("value");
        document.getElementById("symbol-header").innerHTML = symbol_name;
        symbolInfo(symbol_name);
        drawChart(symbol_name);
        $("#stream-list").empty();
        twitsMessage(symbol_name);
    });
});
