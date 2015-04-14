var vis = d3.select("#visualisation"),
    WIDTH = 1000,
    HEIGHT = 500,
    MARGINS = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 50
    },
    chart = { 
        min: {x:2000, y: 50},
        max: {x:2030, y: 250},
    },
    xScale = d3.time.scale().domain([new Date("2001-02-01T12:00"), d3.time.day.offset(new Date("2030-02-02T12:00"), 1)]).rangeRound([MARGINS.left, WIDTH - MARGINS.right]),
    yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([chart.min.y, chart.max.y]),
    xAxis = d3.svg.axis()
       .scale(xScale)
       .tickFormat(d3.time.format('%Y'))
       .ticks(7)
       .tickSize((-HEIGHT + MARGINS.top + MARGINS.bottom), 0),
    yAxis = d3.svg.axis()
        .scale(yScale)
        .tickSize((-WIDTH + MARGINS.left + MARGINS.right), 0)
        .orient('left')
        .ticks(10);

vis.append("svg:g")
    .attr('class', 'x axis')
    .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
    .call(xAxis);
vis.append("svg:g")
    .attr('class', 'y axis')
    .attr("transform", "translate(" + (MARGINS.left) + ", 0)")
    .call(yAxis);

var area = d3.svg.area().x(function(d){
        return xScale(new Date(d.reportedDate));
    }).y0(HEIGHT- MARGINS.bottom -1)
    .y1(function(d){
        return yScale(d.score);
    });

var lineGen = d3.svg.line()
  .x(function(d) {
    return xScale(new Date(d.reportedDate));
  })
  .y(function(d) {
    return yScale(d.score);
  });

vis.append("svg:path")
    .datum(yearObj[0].points)
    .attr("class", "area")
    .attr('id', 'area-' + yearObj[0].id)
    .attr("d", area);

vis.append('svg:path')
    .attr('class', 'line')
    .attr('d', lineGen(yearObj[1].points))
    .attr('stroke', '#F00')
    .attr('stroke-width', 2)
    .attr('id', 'line-' + yearObj[1].id)
    .attr('fill', 'none');

vis.selectAll('circle.mark').data(yearObj[1].points).enter().append('svg:circle')
    .attr('class', 'mark')
    .attr('cx', function(d, i){return xScale(new Date(d.reportedDate));})
    .attr('cy', function(d){return yScale(d.score);})
    .attr('r', 3.5);

var currentIndex = 0;
function updateScale(){
    console.log(currentIndex, yearObj);
    var currentScale = (currentIndex % 3 == 0) ? yearObj: (currentIndex % 3 == 1 ? month: day); 
    var min,max, pattern, ticks;
    switch(currentIndex % 3){
        case 0:
            min = "2001-02-01T12:00";
            max = "2030-02-02T12:00";
            pattern = "%Y";
            ticks = 10;
            break;
        case 1:
            min = "2001-02-01T12:00";
            max = "2003-09-02T12:00";
            pattern = "%b - %y";
            ticks = 15;
            break;
        case 2:
            min = "2001-03-01T01:00";
            max = "2001-03-29T01:00";
            pattern = "%a";
            ticks = 30;
            break;
    }

    xScale = d3.time.scale()
        .domain([new Date(min), d3.time.day.offset(new Date(max), 1)])
        .rangeRound([MARGINS.left, WIDTH - MARGINS.right]),
    yScale = d3.scale.linear()
        .range([HEIGHT - MARGINS.top, MARGINS.bottom])
        .domain([chart.min.y, chart.max.y]),
    xAxis = d3.svg.axis()
       .scale(xScale)
       .tickFormat(d3.time.format(pattern))
       .ticks(ticks)
       .tickSize((-HEIGHT + MARGINS.top + MARGINS.bottom), 0),
    yAxis = d3.svg.axis()
        .scale(yScale)
        .tickSize((-WIDTH + MARGINS.left + MARGINS.right), 0)
        .orient('left')
        .ticks(10);



    d3.selectAll('.line').remove();
    d3.selectAll('.area').remove();
    d3.selectAll('.mark').remove();
    d3.selectAll("g.x.axis")
        .call(xAxis);
    d3.selectAll("g.y.axis")
        .call(yAxis);

    vis.append("svg:path")
        .datum(currentScale[0].points)
        .attr("class", "area")
        .attr('id', 'area-' + currentScale[0].id)
        .attr("d", area);

    vis.append('svg:path')
        .attr('class', 'line')
        .attr('d', lineGen(currentScale[1].points))
        .attr('stroke', '#0FF')
        .attr('stroke-width', 2)
        .attr('id', 'line-' + currentScale[1].id)
        .attr('fill', 'none');

    vis.selectAll('circle.mark')
        .data(currentScale[1].points)
        .enter()
        .append('svg:circle')
        .attr('class', 'mark')
        .attr('cx', function(d, i){return xScale(new Date(d.reportedDate));})
        .attr('cy', function(d){return yScale(d.score);})
        .attr('r', 2.5);

    var year = 0;
    d3.selectAll('.x.axis g.tick')
      .filter(function(d){  
            switch(currentIndex%3){
                case 1:
                    if(year != 0 & year != d.getYear()){
                        year = d.getYear();
                        return true;
                    }
                    year= d.getYear();
                    break;
                case 2:
                    return d.getDay() == 0;
                    break;
            }
        })
      .select('line') 
      .attr('class', 'quadrantBorder') 
      .style('stroke-width', 5); 


     currentIndex++;
}


function updateArea(){
    var area = d3.select('.area');
    if(area.style('display') != 'none'){
       // area.data('display', area.style('display'));
        area.style('display', 'none');
    }else {
        area.style('display', 'inline');
    }
}