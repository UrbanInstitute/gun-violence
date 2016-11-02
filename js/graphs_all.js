 
var data = [];
var options = {
    categoryRange: 'DC'
  };

var VALUES = ["all", "retail"];
var LABELS = {
    all: "All businesses",
    retail: "Retail and service",
};


  
  var margin = { top: 15, right: 15, bottom: 35, left: 45 } ; //spacing b/w svg and g
  var width = 350 - margin.right - margin.left;
  var height = 250 - margin.top - margin.bottom;
  // FETCH DATA
d3.csv("data/all_employment_data.csv", type, function(error, data) {
  d3.csv("data/all_homicide_data.csv", type2, function(error2, data2){
  if (error) throw error;

  var homicideChart = new HomicideChart(data2);
  var employmentChart = new EmploymentChart(data);
  // EVENT HANDLERS
  // d3.select('#cities').on('change', function () {
  //   options.categoryRange = d3.event.target.value;
  //   employmentChart.update(data);
  //   homicideChart.update(data2);
  //   });
  $( "#cities" ).selectmenu({
    change: function(event, d){
      options.categoryRange = this.value;
      employmentChart.update(data);
      homicideChart.update(data2);
 
    }
  });
  
  });
});

function type(d) {
  d.growth = +d.growth;
  return d;
}

function type2(d) {
  d.rate = +d.rate;
  return d;
}

function EmploymentChart(data) {
  var chart = this;
    var data = data.filter(function(d){ return d.city == options.categoryRange})


  chart.svg = d3.select('#employment_chart')
    .append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left*1.3 + ',' + margin.top*2 + ')');

//SCALES
    var y0 = Math.max(-d3.min(data, function (d) {
      return Math.max(d.growth);
    }), d3.max(data, function(d) { 
      return Math.max(d.growth);
    }));

    chart.y = d3.scaleLinear()
      .domain([0,.2])
      .rangeRound([height, 0]);



    chart.x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
//    y = d3.scaleLinear().rangeRound([height, 0]);
    
    chart.x.domain(data.map(function(d) { return d.type }));

//TICKS
    var tickNames = ["2010", "", "2010", "", "2011", "", "2012"]
  
    chart.gx = chart.svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(chart.x)
        .tickFormat(function(d) { return tickNames[d] }))
      .selectAll("text")
        .attr("y", 7)
        .attr("x", -38)
          .style("text-anchor", "start")


// gridlines in y axis function
function make_y_gridlines() {   
    return d3.axisLeft(chart.y)
        .ticks(5)
}
//LEGEND

    chart.svg.append("circle")
      .attr("id", "all-circle")
      .attr("class", "legend-icon")
      .attr("cx", 163)
      .attr("cy", -7)
      .attr("r", 5);

    chart.svg.append("text")
      .attr("class", "legend")
      .attr("x", 177)
      .attr("y", -3)
      .attr("text-anchor", "start")
      .text(function (d, i) {
          return LABELS["all"];
      });

    chart.svg.append("circle")
      .attr("id", "retail-circle")
      .attr("class", "legend-icon")
      .attr("cx", 163)
      .attr("cy", 8)
      .attr("r", 5);

    chart.svg.append("text")
      .attr("class", "legend")
      .attr("x", 178)
      .attr("y", 12)
      .attr("text-anchor", "start")
      .text(function (d, i) {
          return LABELS["retail"];
      });




 /* var ticks = d3.selectAll(".tick text");
  ticks.attr("class", function(d,i){
    if(i%2 == 0) d3.select(this).remove();
  });
  */

  chart.svg.append("text")
      .style("text-anchor", "left")
      .attr("class", "axistitle")
      .attr("x", -40)
      .attr("y", -10)
      .text("Employment growth")
      .attr("opacity", 1);
  

var gridLines = chart.svg.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
      .tickSize(-width)
      .tickFormat("")
      );
chart.gridLines = gridLines

d3.selectAll(".grid .tick line")
  .attr("class", function(d,i){
    return "gridLine-" + d
  })

  var gy = chart.svg.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(chart.y).ticks(5, "%"))

    chart.gy = gy;

  
      // chart.update(data); console.log(data)
    chart.data = data;

    chart.tooltip = d3.select("body").append("div")   
          .attr("class", "chartTooltip")               
          .style("opacity", 0);


     var percentFormat = d3.format(".1%")
     var rects =chart.svg.selectAll(".bar")
        .data(data) 
        .enter().append("rect")
         .on("mouseover", function(d) { 
            chart.tooltip.transition()        
              .duration(200)      
              .style("opacity", 0.8)
            chart.tooltip.html("Employment growth:" + "<br /><strong>" + percentFormat(d["growth"]) + "</strong>")
              .style("left", function(){
                if(d3.event.pageX + this.getBoundingClientRect().width >= d3.select("#employment_chart").node().getBoundingClientRect().right){
                  return (d3.event.pageX - this.getBoundingClientRect().width) + "px"
                }else{
                  return (d3.event.pageX) + "px"
                }
              })    
              .style("top", (d3.event.pageY - 40) + "px");
          })
          .on("mouseout", function(d) {      
            chart.tooltip.html("")
              .transition()        
              .duration(500)      
              .style("opacity", 0)
          })    
          .attr("class", function(d) {
             if (d.retail == 0) {
               return 'bar_blue';
             } else {
              return 'bar_yellow';
             }
           })
          .attr("x", function(d) { return chart.x(d.type); })
          .attr("y", function(d) {
              return chart.y(d.growth);
          })
          .attr("width", chart.x.bandwidth())
          .attr("height", function(d) {
              return height - chart.y(d.growth); 
          });
}

EmploymentChart.prototype.update = function(data) {
  var chart = this;
  var city = options.categoryRange;
    // if (options.categoryRange !== 'DC') {
    //  // var categoryRange = options.categoryRange.split('');
  data= data.filter(function(d){ return d.city == city})
    //   console.log(data)

    // }
  if( city == 'oak'){
    chart.y.domain([-.1,.1])
  }
  else if( city == 'DC'){
    chart.y.domain([0, .2])
  }else{
    chart.y.domain([0, .1])
  }

function make_y_gridlines() {   
    return d3.axisLeft(chart.y)
        .ticks(5)
}
chart.gridLines
      .call(make_y_gridlines()
      .tickSize(-width)
      .tickFormat("")
      );

  chart.gy.transition().call(d3.axisLeft(chart.y).ticks(5, "%"))
  // console.log(chart.gy(), chart.y)
  d3.selectAll(".grid .tick line")
    .attr("class", function(d,i){
      return "gridLine-" + d
    })

  chart.svg.selectAll("rect")
    .data(data)
    .transition() 
      .attr("y", function(d) {
        if(d.growth < 0){
          return chart.y(0)
        }else{
          return chart.y(d.growth);
        }
      })
      .attr("height", function(d) {
        if(city == "oak"){
          if(d.growth < 0){
            return chart.y(d.growth) - chart.y(0); 
          }else{  
            return chart.y(0) - chart.y(d.growth);
          }
        }else{
          return height- chart.y(d.growth)
        }
      });


}


function HomicideChart(data2) {
  var chart = this;
    var data2 = data2.filter(function(d){ return d.city == options.categoryRange})


  chart.svg = d3.select('#homicide_chart')
    .append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left*1.3 + ',' + margin.top *2 + ')');


//SCALES
    var y0 = Math.max(-d3.min(data2, function (d) {
      return Math.max(d.rate);
    }), d3.max(data, function(d) { 
      return Math.max(d.rate);
    }));

    chart.y = d3.scaleLinear()
     // .domain(d3.extent(data, function (d) { return d.Math_proficient/100; })) 
      .domain([0,30])
      .rangeRound([height, 0]);
    chart.x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
//    y = d3.scaleLinear().rangeRound([height, 0]);
    
    chart.x.domain(data2.map(function(d) { return d.type }));

    chart.svg.append("text")
      .style("text-anchor", "left")
      .attr("class", "axistitle")
      .attr("x", -30)
      .attr("y", -10)
      .text("Gun homicide rate (per 100,000 people)")
      .attr("opacity", 1);

//TICKS
  var tickNames2 = ["","2010", "2011", "2012"]
  
  var gx = chart.svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(chart.x)
      .tickFormat(function(d) { return tickNames2[d] }));

function make_y_gridlines() {   
    return d3.axisLeft(chart.y)
        .ticks(5)
}
chart.svg.append("g")
      .attr("class", "grid" )
      .call(make_y_gridlines()
      .tickSize(-width)
      .tickFormat("")
      );

d3.selectAll(".grid .tick line")
  .attr("class", function(d,i){
    return "gridLine-" + d
  })

  var gy = chart.svg.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(chart.y).ticks(6))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Growth");

  chart.gy = gy;
  
      // chart.update(data2);
  chart.data2 = data2;

  chart.tooltip = d3.select("body").append("div")   
      .attr("class", "chartTooltip")               
      .style("opacity", 0);

   var rects =chart.svg.selectAll(".bar")
      .data(data2) 
      .enter().append("rect")
      .on("mouseover", function(d) { 
        chart.tooltip.transition()        
          .duration(200)      
          .style("opacity", 0.8)
        chart.tooltip.html("Gun homicide rate:" + "<br /><strong>" + d["rate"] + " per 100,000</strong>")
          .style("left", function(){
            if(d3.event.pageX + this.getBoundingClientRect().width >= d3.select("#homicide_chart").node().getBoundingClientRect().right){
              return (d3.event.pageX - this.getBoundingClientRect().width) + "px"
            }else{
              return (d3.event.pageX) + "px"
            }
          })     
          .style("top", (d3.event.pageY - 40) + "px");
      })
      .on("mouseout", function(d) {      
        chart.tooltip.html("")
          .transition()        
          .duration(500)      
          .style("opacity", 0)
      })    
      .attr("class", function(d) {
         if (d.retail == 0) {
           return 'bar_blue';
         } else {
          return 'bar_yellow';
         }
       })
      .attr("class", 'bar_grey')
      .attr("x", function(d) { return chart.x(d.type); })
      .attr("y", function(d) { return chart.y(d.rate); })
      .attr("width", chart.x.bandwidth())
      .attr("height", function(d) {return height - chart.y(d.rate); });
}

HomicideChart.prototype.update = function(data2) {
  var chart = this;
  var city = options.categoryRange

 // var categoryRange = options.categoryRange.split('');
  data2= data2.filter(function(d){ return d.city == city})

 chart.svg.selectAll("rect")
    .data(data2) 
    .transition()
      .attr("y", function(d) { return chart.y(d.rate); })
      .attr("height", function(d) {return height - chart.y(d.rate); });


} 

var pymChild = new pym.Child()