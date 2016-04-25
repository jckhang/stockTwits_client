// StockTwits Realtime Dashboard
let sector = "All";
const symbolInfoField = ["prev_close", "open", "volume", 'pe', 'eps'];
const symbolInfoId = ["symbol-pc", "symbol-op", "symbol-vo", "symbol-pe", "symbol-eps"];
const sectorAPI = "https://stocktwitsbackend.herokuapp.com/sectors";
const symbolAPI = "https://stocktwitsbackend.herokuapp.com/search";
const twitsAPI = "https://stocktwitsbackend.herokuapp.com/twits";

// Get API /sectors?sector= and append symbols within that sector to the left 
function symbolListSector(sector) {
    $.getJSON(sectorAPI, {
            sector: sector
        })
        .done(function(data) {
            let t = $("#overview").DataTable();
            $.each(data[Object.keys(data)], function(i, item) {
                t.row.add([
                    '<a class="symbol_a" value=' + item.name + '>' + item.name + '</a>',
                    item.price,
                    item.ebitda
                ]).draw(false);
            });
        });
}

function symbolInfo(symbol) {
    $.getJSON(symbolAPI, {
            symbol: symbol
        })
        .done(function(data) {
            let hdata = data['data'][0]['data'];
            let record = hdata[hdata.length - 1];
            $.each(symbolInfoField, function(i, item) {
                document.getElementById(symbolInfoId[i]).innerHTML = record[item]
            })
        })
}

function twitsMessage(symbol) {
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
    let availableTags = ["AAPL", "ABBV", "ABT", "ACN", "AIG", "ALL", "AMGN", "AMZN", "APA", "AXP", "BA", "BAC", "BAX", "BIIB", "BK", "BLK", "BMY", "BRKB", "C", "CAT", "CL", "CMCSA",
        "COF", "COP", "COST", "CSCO", "CVS", "CVX", "DD", "DIS", "DOW", "DVN", "EBAY", "EMC", "EMR", "EXC", "F", "FB", "FCX", "FDX", "FOXA", "GD", "GE", "GILD",
        "GM", "GOOG", "GS", "HAL", "HD", "HON", "IBM", "INTC", "JNJ", "JPM", "KO", "LLY", "LMT", "LOW", "MA", "MCD", "MDLZ", "MDT", "MET", "MMM", "MO", "MON", "MRK", "MS", "MSFT", "NEE", "NKE", "NOV", "NSC", "ORCL", "OXY", "PEP", "PFE", "PG", "PM", "QCOM", "RTN", "SBUX", "SLB", "SO", "SPG", "T", "TGT", "TWX", "TXN", "UNH", "UNP", "UPS", "USB", "UTX", "V", "VZ", "WBA", "WFC", "WMT", "XOM"
    ]
    $("#symbol-search").autocomplete({
        source: availableTags,
        response: function(event, ui) {
            // ui.content is the array that's about to be sent to the response callback.
            if (ui.content.length === 0) {
                $("#symbol-search").text("No results found");
            } else {
                $("#symbol-search").empty();
            }
        }
    });
    // Btn filter click and Refresh and append the symbol list 
    let sector = "All";
    symbolListSector(sector);

    $('.btn-filter').click(function() {
        sector = $(this).attr('value');
        $("#overview").DataTable().clear();
        symbolListSector(sector);
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
    let symbol_name = 'AAPL';
    symbolInfo(symbol_name);
    //// Onclick symbol
    $('#overview tbody').on('click', 'td', function() {
        let cell = overview.cell(this).node();
        let value = cell.childNodes[0];
        symbol_name = value.getAttribute("value");
        document.getElementById("symbol-header").innerHTML = symbol_name;
        symbolInfo(symbol_name);
        $("#stream-list").empty();
        twitsMessage(symbol_name);
    });

    // Append Twits
    let symbol = "All";
    twitsMessage(symbol);
});
