
//-----------------------------------------------------------------------------------
//Setup svg area
//-----------------------------------------------------------------------------------

var svgWidth = 960;
var svgHeight = 500;

var margin ={
    top: 20,
    right: 40,
    bottom: 100,
    left: 80
};

var width = svgWidth - margin['right'] - margin['left'];
var height = svgHeight - margin['top'] - margin['bottom'];

//----------------------------------------------------------------------------------
// Create an SVG wrapper :v
//----------------------------------------------------------------------------------
var svg = d3
    .select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);


//Append a powerful svg group
var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin['left']},${margin['top']})`)

//Initial Params
var chosenXAxis = 'poverty';


/*
// Function used for updating x-scale var upon click on axis label :v
function xScale(chartData, chosenXAxis){
    //Create scales
    var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(chartData[chosenXAxis])) //SI ALGO NO FURULA ES ALTAMENTE PROBABLE QUE SEA POR ESA LINEA
        .range(0, width);
    
    return xLinearScale
};



// Function used for updating x-axis var upon click on axis label
function renderAxes(newXScale, xAxis){
    var bottomAxis = d3.axisBottom(newXScale);
    
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis)
    
    return xAxis
};

// Function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis){
    circlesGroup.transition()
        .duration(1000)
        .attr('cx', d => newXScale(d[chosenXAxis]))
    
    return circlesGroup
};
*/

// PONER AQUI TOOLTIP SI ASI LO DESEO


//-------------------------------------------------------------------------------------
//Hacer cosas locoshonas que solamente los dioses del JavaScript saben que onda
//-------------------------------------------------------------------------------------
// Import our CSV data with d3's .csv import method.


d3.csv("assets/data/data.csv").then(stateData => {
    //console.log(stateData);
  // parse data
    
    stateData.forEach( data => {
        data['poverty'] = +data['poverty'];
        data['age'] = +data['age'];
        data['income'] = +data['income'];
        data['healthcareLow'] = +data['healthcareLow'];
        //console.log(data);
    });
    
    //Create xAxis label
    
    svg.append('text')
        .attr('x', width/2 + 50)
        .attr('y', 450)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .attr('font-family', 'arial')
        .attr('font-size', 20)
        .text('Poverty % :v')
    
    // Create yAxis label
    svg.append('text')
        .attr('x', -height/2)
        .attr('y', 50)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .attr('font-family', 'arial')
        .attr('font-size', 20)
        .attr('transform', 'rotate(-90)')
        .text('Low Healthcare %')
    
    /*
                .attr('x', width/2)
        .attr('y', height + 50)
        .attr('text-anchor', 'middle')
        .attr('fill','white')
        .text('Month')
    */
    //Create an xScale
    var x = d3.scaleLinear()
        .domain(d3.extent(stateData, d => d['poverty']))
        .range([0, width]);
    // Create yScale
    var y = d3.scaleLinear()
        .domain(d3.extent(stateData, d=> d['healthcareLow']))
        .range([height,0]);
    
    //Call xAxis
    var xAxis = d3.axisBottom(x);
    
    chartGroup.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);
    
    //Call yAxis
    var yAxis = d3.axisLeft(y);
    
    chartGroup.append('g')
        .call(yAxis);

    // Create cool circles
    var circles = chartGroup.selectAll('circle')
        .data(stateData)
    
    var radius = 12.5;
    
    circles.enter()
        .append('circle')
            .attr('cx', d => x(d['poverty']))
            .attr('cy', d=> y(d['healthcareLow']))
            .attr('r', radius)
            .attr('fill', 'blue')
            .attr('opacity',0.6)
    //Add the text to my circles :v
    circles.enter()
        .append('text')
            .attr('x', d => x(d['poverty']))
            .attr('y', d => y(d['healthcareLow']) + radius/3 )
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-size', radius)
            .text(d => d['abbr'])
        
}).catch(error =>{console.log(error)});


