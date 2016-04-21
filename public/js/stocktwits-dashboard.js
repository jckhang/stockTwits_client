// StockTwits Realtime Dashboard
var sector = "All";
var sectorAPI = "https://stocktwitsbackend.herokuapp.com/sectors";
var symbolAPI = "https://stocktwitsbackend.herokuapp.com/search"

function symbolListSector(sector) {
    $.getJSON(sectorAPI, {
            sector: sector
        })
        .done(function(data) {
            var t = $("#table1").DataTable();
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
        var hpanel = $(event.target).closest('div.panel');
        var icon = $(event.target).closest('i');
        var body = hpanel.find('div.panel-body');
        var footer = hpanel.find('div.panel-footer');
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
        var hpanel = $(event.target).closest('div.panel');
        hpanel.remove();
    });

    // Handle filter button selection
    $('.btn-filter').click(function() {
        $('.btn-filter').not(this).removeClass('active'); // remove buttonactive from the others
        $(this).toggleClass('active')
    });
    // Handle Symbol Search !!!!!!!!!!!!!To be done
    $("#symbol-search").bind('keyup', function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            console.log('yes');
        }
    });

    // Btn filter click and Refresh and append the symbol list 
    var sector = "All";
    symbolListSector(sector);

    $('.btn-filter').click(function() {
        sector = $(this).attr('value');
        $("#table1").DataTable().clear();
        symbolListSector(sector);
        console.log('haha');
    });
    // DataTable setting up
    var table1 = $('#table1').DataTable({
        "order": [
            [1, "desc"]
        ],
        "searching": false,
        "paging": false,

        "lengthChange": false,
        "info": false
    });
    // DataTable click and refresh symbol-info information
    // Onload
    var symbol_name = 'AAPL';

    // Onclick 
    $('#table1 tbody').on('click', 'td', function() {
        var cell = table1.cell(this).node();
        var value = cell.childNodes[0];
        symbol_name = value.getAttribute("value");
        document.getElementById("symbol-header").innerHTML = symbol_name;
    });
});
