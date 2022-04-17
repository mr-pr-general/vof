
const d_margin = {top: 20, right: 10, bottom: 30, left: 80};
const d_margin_bc = {top: 60, right: 20, bottom: 30, left: 100};
//var margin = {top: 20, right: 10, bottom: 20, left: 10}
const v_graph_width = 960 - d_margin.left - d_margin.right;
const v_graph_height = 500 - d_margin.top - d_margin.bottom;
const v_graph_width_bc = 660 - d_margin.left - d_margin.right;
const v_graph_height_bc = 400 - d_margin.top - d_margin.bottom;
var a_colors = ["red", "green", "blue", "yellow", "purple", "brown", "gray", "orange", "violet", "lightblue"];



// Scales
var x_lc = d3.scaleLinear().range([0, v_graph_width]),
    y_lc = d3.scaleLinear().range([v_graph_height, 0]),
    z_lc = d3.scaleOrdinal(d3.schemeCategory10),
    //x_bc = d3.scaleLinear().range([0, v_graph_width_bc]),
    //y_bc = d3.scaleBand().range([0, v_graph_height_bc]);
    y_bc = d3.scaleLinear().range([0, v_graph_height_bc]),
    y_bc_axis = d3.scaleLinear().range([v_graph_height_bc, 0]),
    x_bc = d3.scaleBand().range([0, v_graph_width_bc]);





d3.json("../data/volunteer_toronto.json", function(d) {
    //return {
    //    source: d.source,
    //    target: d.target,
    //    value: +d.value
    //}
}).then(function(data) {
    //console.log(data);


    var volunteer_opportunities = data;

    //var nodes = {};
    var a_locations=[];
    var d_locations={};
    var v_num_opportunities=0;
    var v_location="";
    // compute the distinct nodes from the links.
    volunteer_opportunities.forEach(function(opp) {
        //console.log(opp.location);
        //v_location = opp.location;
        v_location = opp.location.split(",")[0].toLowerCase().trim()
        //console.log(v_location);
        //console.log(d_locations[v_location]);
        //console.log(v_location.split(",")[0].toLowerCase().trim());
        d_locations[v_location] = (d_locations[v_location] || 0) + 1;

        ///if (v_location in d_locations) {
            //console.log("IN");
            //d_locations[v_location] = d_locations[v_location] + 1;
        //}
        //else {
        //    console.log("NOT IN");
        //}
        //v_num_opportunities = 1;
        //a_locations.push({v_location:v_num_opportunities});
        //d_locations[v_location] = v_num_opportunities;
    });
    //console.log(d_locations);
    a_locations.push(d_locations);
    //console.log(a_locations);

    //Bar Chart
    var div_bc = d3.select("body").append("div")
        .attr("id", "bar_chart_title")
        .attr("transform", `translate(${v_graph_width/2},30)`)
        .text("Volunteer Opportunities by Location");

    var svg_bc = d3.select("body").append("svg")
        .attr("id", "bar_chart")
        .attr("width", v_graph_width_bc + d_margin_bc.left + d_margin_bc.right)
        .attr("height", v_graph_height_bc + d_margin_bc.top + d_margin_bc.bottom);

    // var svg_tbl = d3.select("body").append("svg")
    //     .attr("id", "table")
    //     .attr("width", v_graph_width_bc + d_margin_bc.left + d_margin_bc.right)
    //     .attr("height", v_graph_height_bc + d_margin_bc.top + d_margin_bc.bottom);



    var v_max_num_opp=0;
    var a_cities_freq=[];
    var a_locations_ticks = [];
    for (const [key, value] of Object.entries(d_locations)) {
        //console.log(key, value);
        a_locations_ticks.push(key);
        if (value > v_max_num_opp) {
            v_max_num_opp = value;
        }
        a_cities_freq.push({locations:key,counts:value});

    }
    //console.log(a_cities_freq);
    //console.log(v_max_num_opp);
    //console.log(Object.keys(d_locations).length);

    y_bc.domain([0, v_max_num_opp]);
    y_bc_axis.domain([0, v_max_num_opp]);
    //x_bc.domain([0, Object.keys(d_locations).length]);
    x_bc.domain(Array.from(Array(11).keys()));
    //console.log(a_cities_freq)


    //console.log(y_bc);
    //console.log(x_bc);
    //console.log("domains");
    //console.log(x_bc.domain());

    const g_graph_bc_bars = svg_bc.append("g")
        .attr("id", "bars")
        .attr("width", v_graph_width_bc)
        .attr("height", v_graph_height_bc)
        .attr("transform", `translate(${d_margin.left}, ${d_margin.top})`);
    // const g_table = svg_tbl.append("g")
    //     .attr("id", "g_table")
    //     .attr("width", v_graph_width_bc)
    //     .attr("height", v_graph_height_bc);



    //var x_axis = d3.axisBottom(x_bc);
    //console.log(a_locations_ticks);

    var x_axis = d3.axisBottom(x_bc)
        // .data(volunteer_opportunities)
        .tickFormat(function(d,i){
        //.tickFormat("TXT");
        //
            if (i < 10) {
                //console.log(a_locations_ticks[i].substring(0, 8));
                return a_locations_ticks[i].substring(0, 10);
            }
        //
         });
    var y_axis = d3.axisLeft(y_bc_axis);

    const x_axis_group = g_graph_bc_bars.append("g")
        .call(x_axis)
        .attr("transform", `translate(0, ${350})`);
    const y_axis_group = g_graph_bc_bars.append("g")
        .call(y_axis);
        //.attr("transform", `translate(0, 0)`);


    //
    // const y_grid_lines = g_graph_bc_bars.append("g")
    //     .attr("class", "grid")
    //     .attr("transform", `translate(0, ${d_margin.top})`)
    //     .call(d3.axisLeft()
    //         .scale(y_bc)
    //         .tickSize(-300, 0, 0)
    //         .tickFormat(""));


    var v_first_mouse_enter = 1;

    g_graph_bc_bars.selectAll(".rect")
        .data(a_cities_freq)
        .enter().append("rect")
        .on("mouseenter", function (d, i) {
            d3.select(this).attr("opacity", 0.5)
            if (v_first_mouse_enter == 0) {remove_table()};

            get_details(d.locations)

        })
        .on("mouseleave", function (d, i) {
            d3.select(this).attr("opacity", 1)
            //

        })
        .transition()
        .attr("width", x_bc.bandwidth())
        .delay(function(d, i) { return i * 150})
        .ease(d3.easeBounceIn)

        //.attr("x", x_bc(0) + (d_margin_bc.left + 100))
        //.attr("y", 0 )
        .attr("width", x_bc.bandwidth())

        // .attr("x",  function (d) {
        //     //console.log(y_bc(d.));
        //     return x_bc(9);
        // })

        .attr("x", function(d, i) {

            //console.log("i ", i);
            return x_bc(i);})
        .attr("y", function(d, i) { return v_graph_height_bc-y_bc(d.counts);})

        .attr("height", function (d) {
            return y_bc(d.counts);
        })
        //.attr("fill", "#699cb3");
        .attr("fill", function(d, i) {
            return a_colors[getRandomInt(11)];
            // if (i ) {
            //     v_color = "blue";
            // } else {
            //     v_color = "red";
            // }
            // return v_color
        });

    //var table = g_table.append("table");


    function get_details(location) {
        var table = d3.select("body").append("table")
            .attr("id", "tbl_detail");

        var thead = table.append('thead');
        var	tbody = table.append('tbody');
        //console.log(location);
        var a_tbl_columns = [];
        var a_tbl_data = [];
        var v_first_row = 0;
        //var header = table.append("thead").append("tr");
        volunteer_opportunities.forEach(function(opp) {
            //console.log(opp.location);
            //v_location = opp.location;
            v_location = opp.location.split(",")[0].toLowerCase().trim();
            if (v_location == location) {
                //console.log(opp);
                // Obtain Keys for Column Names. First Row only.
                if (v_first_row == 0) {
                    for (const [key, value] of Object.entries(opp)) {
                        //console.log(key, value);
                        a_tbl_columns.push(key)
                    }
                    // append the column names to the table
                    thead.append('tr')
                        .selectAll('th')
                        .data(a_tbl_columns).enter()
                        .append('th')
                        .text(function (a_tbl_columns) { return a_tbl_columns; });
                    v_first_row = 1;
                }
                a_tbl_data.push(opp);
                //console.log(a_tbl_columns);


                // create a row for each entry

            }

        });
        //console.log(a_tbl_data);
        //console.log(a_tbl_data[0]);
        var rows = tbody.selectAll('.tr')
            .data(a_tbl_data)
            .enter()
            .append('tr');

        // create a cell in each row for each column
        var cells = rows.selectAll('td')
            .data(function (row) {
                return a_tbl_columns.map(function (a_tbl_columns) {
                    return {column: a_tbl_columns, value: row[a_tbl_columns]};
                });
            })
            .enter()
            .append('td')
            .text(function (d) { return d.value; });

        v_first_mouse_enter = 0;
    };




}).catch(function(error) {
    console.log(error);

});

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
};

function remove_table() {
//return;
    var el1 = document.getElementById("tbl_detail");
    el1.remove();
    // var el2 = document.getElementById("a_tbl_data");
    // el2.remove();

}
