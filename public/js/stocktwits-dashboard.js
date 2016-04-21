// StockTwits Realtime Dashboard
var sector = "All";
var sectorAPI = "https://stocktwitsbackend.herokuapp.com/sectors";

function symbolListSector(sector) {
    $.getJSON(sectorAPI, {
            sector: sector
        })
        .done(function(data) {
            var t = $("#table1").DataTable();
            $.each(data[Object.keys(data)], function(i, item) {
                t.row.add([
                    item.name,
                    item.price,
                    item.ebitda
                ]).draw(false);
            });
        });
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
    // Handle Symbol Search
    $("#symbol-search").bind('keyup', function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            console.log('yes');
        }
    });

    // Refresh and append the symbol list 
    var sector = "All";
    symbolListSector(sector);

    $('.btn-filter').click(function() {
        sector = $(this).attr('value');
        $(".symbol-table").empty();
        symbolListSector(sector);
    });
    $('#table1').DataTable({
        "order": [
            [1, "desc"]
        ],
        "searching":false,
        "paging":false,
        
        "lengthChange":false,
        "info": false
    });
});
