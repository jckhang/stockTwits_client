// StockTwits Realtime Dashboard

$(document).ready(function() {
    // Handle minimalize left menu
    $('.left-nav-toggle a').on('click', function(event) {
        event.preventDefault();
        $("body").toggleClass("nav-toggle");
    });


    // Hide all open sub nav menu list
    $('.nav-second').on('show.bs.collapse', function() {
        $('.nav-second.in').collapse('hide');
    })

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
    })
    $('.btn-filter').click(function() {
        $('.btn-filter').not(this).removeClass('active'); // remove buttonactive from the others
        $(this).toggleClass('active')
    });
    var sectorAPI = "https://stocktwitsbackend.herokuapp.com/sectors";
    var sector = "All";
    $.getJSON(sectorAPI, {
            sector: sector
        })
        .done(function(data) {
            $.each(data[Object.keys(data)], function(i, item) {
                var items = [];
                items.push("<td>" + item.name + "</td>");
                items.push('<td>' + item.sector + "</td>");
                items.push("<td>" + item.price + "</td>"); // To be replaced by real Hotness data
                items.push("<td>" + item.ebitda + "</td>"); // To be replaced by real B/S data
                $("<tr>", {
                    html: items.join("\n")
                }).appendTo(".symbol-table");
            });
        });

    $('.btn-filter').click(function() {
        sector = $(this).attr('value');
        console.log(sector);
        $.getJSON(sectorAPI, {
                sector: sector
            })
            .done(function(data) {
                $(".symbol-table").empty();
                console.log(data[Object.keys(data)]);
                $.each(data[Object.keys(data)], function(i, item) {
                    var items = [];
                    items.push("<td>" + item.name + "</td>");
                    items.push('<td>' + item.sector + "</td>");
                    items.push("<td>" + item.price + "</td>");
                    items.push("<td>" + item.ebitda + "</td>");
                    $("<tr>", {
                        html: items.join("\n")
                    }).appendTo(".symbol-table");
                });
            });
    });
});
