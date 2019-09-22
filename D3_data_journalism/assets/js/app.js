//x-AXIS: poverty, age median, household income median
//y-axis: obese %, smokes %, lacks healthcare %
//-----------------------------------------------------------------------------------
//Setup svg area
//-----------------------------------------------------------------------------------

var svgWidth = 960;
var svgHeight = 500;

var margin ={
    top: 20,
    right: 40,
    bottom: 100,
    left: 105
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
var chosenYaxis = 'healthcareLow';

//-----------------------------------------------------------------------------------
// Define set of functions that are going to be used to update the graph
//-----------------------------------------------------------------------------------

// Function used for updating x-scale var upon click on axis label :v
function xScale(chartData, chosenXAxis){
    //Create scales
    /*
    var x = d3.scaleLinear()
        .domain(d3.extent(chartData, d=> d[chosenXAxis])) //SI ALGO NO FURULA ES ALTAMENTE PROBABLE QUE SEA POR ESA LINEA
        .range([0, width]);
    */
    
    var min = d3.min(chartData, d=> d[chosenXAxis]);
    var max = d3.max(chartData, d => d[chosenXAxis]);
    
    // Multiply the domain by 0.03 so the dots won't be over the axes
    var x = d3.scaleLinear()
        .domain([min - min*0.05, max ])
        .range([0,width]);
    
    return x
};

//Function used for updating y-scale var upon click on axis label :v
function yScale(chartData, chosenYAxis){
    //Create scales
    /*
    var y = d3.scaleLinear()
        .domain(d3.extent(chartData, d=> d[chosenYAxis]))
        .range([height,0])
    */
    
    var min = d3.min(chartData, d => d[chosenYAxis]);
    var max =  d3.max(chartData, d=> d[chosenYAxis]);
    
    // Multiply the domain by 0.5 so the dots won't be over the axes
    var y = d3.scaleLinear()
        .domain([min - min * 0.5, max])
        .range([height, 0]);
    return y
};


// Function used for updating x-axis var upon click on axis label
function renderAxes(newXScale, xAxis, newYScale, yAxis){
    var bottomAxis = d3.axisBottom(newXScale);
    var leftAxis = d3.axisLeft(newYScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    //It needs to be returnes as a list because otherwise one of them won't update on the click event :(
    return [xAxis, yAxis];
};


// Function used for updating circles group with new tooltip
function updateTooltip(circlesGroup, chosenXAxis, chosenYaxis){
    var toolTip = d3.tip()
        .attr('class', 'tooltip')
        .offset([80,-60])
        .html(d => `${d['state']}<br>${chosenXAxis}: ${d[chosenXAxis]}<br>${chosenYaxis}: ${d[chosenYaxis]}`);
    
    circlesGroup.call(toolTip);
    
    circlesGroup
        .on('mouseover', d=> {toolTip.show(d)})
        .on('mouseout', d => toolTip.hide(d));
    
    return circlesGroup;
};



// Function used for updating circles group with a transition to new circles
//It also moves the already existing text
function renderCircles(circlesGroup, statesGroup,newXScale, chosenXAxis, newYScale, chosenYaxis,radius){
    circlesGroup.transition()
        .duration(1000)
        .attr('cx', d => newXScale(d[chosenXAxis]))
        .attr('cy', d => newYScale(d[chosenYaxis]))
    
    statesGroup.transition()
        .duration(1000)
        .attr('x', d => newXScale(d[chosenXAxis]))
        .attr('y', d=> newYScale(d[chosenYaxis]) + radius/3)
    
    return circlesGroup, statesGroup
};



//-------------------------------------------------------------------------------------
//Hacer cosas locoshonas que solamente los dioses del JavaScript saben que onda
//In other words, read the data and build the graphs
//-------------------------------------------------------------------------------------
// Import our CSV data with d3's .csv import method
d3.csv("assets/data/data.csv").then(stateData => {
    //console.log(stateData);
  // parse data
    
     stateData.forEach( data => {
        data['poverty'] = +data['poverty'];
        data['age'] = +data['age'];
        data['income'] = +data['income'];
        data['healthcareLow'] = +data['healthcareLow'];
        data['smokes'] = +data['smokes'];
        data['obesity'] = +data['obesity'];
        //console.log(data);
    });

    //--------------------------------------------------------------------------
    //Define initial stuff for my graph :v
    //-------------------------------------------------------------------------
    //Create an xScale
    var x = xScale(stateData, chosenXAxis);
    
    // Create yScale
    var y = yScale(stateData, chosenYaxis);
    
    //Call xAxis
    var xAxis = d3.axisBottom(x);
    
    var xAxis = chartGroup.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);
    
    //Call yAxis
    var yAxis = d3.axisLeft(y);
    
    var yAxis = chartGroup.append('g')
        .call(yAxis);


    
    // Create cool initial circles
    var radius = 14;
    
    var circles = chartGroup.selectAll('circle')
        .data(stateData)
        .enter();
    

    
    // Create circles group and append circles :v
    var circlesGroup =circles.append('circle')
            .attr('cx', d => x(d[chosenXAxis]))
            .attr('cy', d=> y(d[chosenYaxis]))
            .attr('r', radius)
            .attr('fill', 'crimson')
            .attr('opacity',0.6)
    
    //Create statesGroup and append text to it :v
    var statesGroup = circles.append('text')
            .attr('x', d => x(d[chosenXAxis]))
            .attr('y', d => y(d[chosenYaxis]) + radius/3 )
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-size', 10)
            .text(d => d['abbr'])

    
    // Create group for 3-axis labels
    var xLabels = chartGroup.append('g')
        .attr('transform',`translate(${width/2},${height+20})`);
    
    //Create xAxis labels :v
    // Each label has a value referenced to it :v
    var povertyLabel = xLabels.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'arial')
        .attr('font-size', 20)
        .attr('value', 'poverty')
        .classed('active', true)
        .text('In Poverty (%)')
    
    var ageLabel = xLabels.append('text')
        .attr('x', 0)
        .attr('y', 45)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'arial')
        .attr('font-size', 20)
        .attr('value','age')
        .classed('inactive', true)
        .text('Age (Median)')
    
    var incomeLabel = xLabels.append('text')
        .attr('x', 0)
        .attr('y', 70)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'arial')
        .attr('font-size', 20)
        .attr('value','income')
        .classed('inactive', true)
        .text('Household income (Median)')
    
    
    // Create group for 3 y-axis labels
    var yLabels = chartGroup.append('g')
        .attr('transform',`translate(${0},${height/2})`)
    
    // Create yAxis label
    // Each label has a value referenced to it :v
    var healthcareLabel = yLabels.append('text')
        .attr('x', 0)
        .attr('y', -25)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'arial')
        .attr('font-size', 20)
        .attr('transform', 'rotate(-90)')
        .attr('value', 'healthcareLow')
        .classed('active', true)
        .text('Low Healthcare %')
    
    var smokesLabel = yLabels.append('text')
        .attr('x', 0)
        .attr('y', -50)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'arial')
        .attr('font-size', 20)
        .attr('transform', 'rotate(-90)')
        .attr('value', 'smokes')
        .classed('inactive', true)
        .text('Smokes (%)')
    
    var obeseLabel = yLabels.append('text')
        .attr('x', 0)
        .attr('y', -75)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'arial')
        .attr('font-size', 20)
        .attr('transform', 'rotate(-90)')
        .attr('value', 'obesity')
        .attr('value', 'obesity')
        .classed('inactive', true)
        .text('Obese (%)')
    
    
    //Call the tooltip :v
    var toolTipLoco = updateTooltip(circlesGroup, chosenXAxis, chosenYaxis);
    
    
    
    //---------------------------------------------------------------------------
    //Create x-axis lables event-listeners
    //--------------------------------------------------------------------------
    xLabels.selectAll('text')
        .on('click', function(){
            //Get value of selection
            var valueX = d3.select(this).attr('value');
        
            if (valueX != chosenXAxis){
                //Replace chosenXAxis with value
                chosenXAxis = valueX;
                // console.log(chosenXAxis);
                //Define new scale
                x = xScale(stateData, chosenXAxis);
                
                //Updates xAxis with transition
                //The function returns a list where in index 0 is the xAxis
                xAxis = renderAxes(x, xAxis, y, yAxis)[0];
                
                //Updates circles and text
                //Function defines before reading csv
                renderCircles(circlesGroup, statesGroup, x, chosenXAxis, y, chosenYaxis,radius)
                
                //Update the tooltip
                updateTooltip(circlesGroup, chosenXAxis, chosenYaxis);
                
                if (chosenXAxis === 'poverty'){
                    povertyLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    ageLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    incomeLabel
                        .classed('active', false)
                        .classed('inactive', true);
                }else if(chosenXAxis === 'age'){
                    povertyLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    ageLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    incomeLabel
                        .classed('active', false)
                        .classed('inactive', true);
                }else if (chosenXAxis === 'income'){
                    povertyLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    ageLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    incomeLabel
                        .classed('active', true)
                        .classed('inactive', false);
                }
            };
        });
    
    //------------------------------------------------------------------------------
    //Create y-axis labels event-listeners
    //-------------------------------------------------------------------------------
    yLabels.selectAll('text')
        .on('click', function(){
            var valueY = d3.select(this).attr('value');
            
            if (valueY != chosenYaxis){
                //Replace chosenYaxis value
                chosenYaxis = valueY;
                console.log(chosenYaxis);
                //Define new Y scale
                y = yScale(stateData, chosenYaxis);
                
                // Updates yAxis with transition;
                //The function returns a list, where in index 1 is the yAxis
                yAxis = renderAxes(x, xAxis, y, yAxis)[1];
                
                //Updates circles and text
                //Function assigned before reading csv
                renderCircles(circlesGroup, statesGroup, x, chosenXAxis, y, chosenYaxis,radius)
                
                //Update the tooltip :v
                updateTooltip(circlesGroup, chosenXAxis, chosenYaxis);
                
                if (chosenYaxis === 'healthcareLow'){
                    healthcareLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    smokesLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    obeseLabel
                        .classed('active', false)
                        .classed('inactive', true);
                }else if(chosenYaxis === 'smokes'){
                    healthcareLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    smokesLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    obeseLabel
                        .classed('active', false)
                        .classed('inactive', true);
                }else if (chosenYaxis === 'obesity'){
                    healthcareLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    smokesLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    obeseLabel
                        .classed('active', true)
                        .classed('inactive', false);
                }
            };
        
        })
}).catch(error =>{console.log(error)});


