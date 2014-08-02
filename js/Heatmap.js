
Heatmap = function(element, rowlabels, collabels, context, data) {
    
    var context = context;
    var data = data; // assume associative array with country as key, object is an array of stats and year
    var rowlabels = rowlabels;        
    var element = element;
    var collabels = collabels;
    var numcols = d3.keys(collabels).length;
    console.log(numcols);
    var numrows = rowlabels.length;
    console.log(numrows);
    
    var currentflatdata;
    var currentdata;
    var currentstat;
    var currentRowSelection = 0;
    var sorter = {};
    
    var margin = { top: 25, right: 0, bottom: 0, left: 21 };
    var width = 800 - margin.left - margin.right;
    var xscale = d3.scale.ordinal().domain(d3.range(0,numcols)).rangeRoundBands([0, width - margin.left], .07, 0);
    var rectheight = xscale.rangeBand();
    var rectstep = xscale(1) - xscale(0);
    var padding = rectstep - rectheight;
    var height = numrows * rectstep; 
    
    var colorScale = {};  
    var columns_container = {};
    
    var doSort = function(a, b, whichrowindex) {

      var nestdata = currentflatdata.filter(function (elem, index) { return elem.row == whichrowindex; });          
      var nestData2 = [];
      
      nestdata.forEach(function(elem, index) {
        nestData2[elem.ccode] = elem.value; 
      });

      //if (nestData2[a] == null && nestData2[b] == null) return 0;
      // both values are null then sort by alphabetical order
      if (nestData2[a] == null && nestData2[b] == null) {
        return (a > b) ? 1 : -1;
      }
                
      if (nestData2[a] == null) return 1;
      if (nestData2[b] == null) return -1;
                
      if (nestData2[a] > nestData2[b]) return -1;
      if (nestData2[a] < nestData2[b]) return 1;
      return 0;                          
    }; // doSort
          
    var setupChart = function() {     
            
      sorter = d3.nest()
          .key(function(d) {return d.ccode;});            
          
      var main_container = d3.select(element).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);              
      var rowlabelsg = main_container.append("g")
          .attr("transform", "translate(0," + (margin.top + rectheight) + ")")
          .selectAll("text")
          .data(rowlabels);              
      rowlabelsg.enter()
          .append("text")
          .text(function (d) { return d; })
          .attr("x", 0)
          .attr("id", function (d,i) { return i; })
          .attr("y", function(d,i) { return i*rectstep})
          .attr("class", "heatrowlabel")    
          .style("fill", function (d,i) { return (currentRowSelection == i) ? "#000000" : "#bebebe"; })
          //.attr("transform", "rotate(-90)")              
          //.style("text-anchor", "start")
          .on("click", function(d, i) { 
            main_container.selectAll(".heatrowlabel").style("fill", "#bebebe");
            d3.select(this).style("fill", "#000000");
            currentRowSelection = i;
            currentdata = sorter.sortKeys(function(a,b) { return doSort(a,b, currentRowSelection); })
                                .entries(currentflatdata);
            console.log("sorted by new year " + i); 
            console.log(currentdata);
            drawChart();
            });              
      columns_container = main_container.append("g")
          .attr("transform", "translate(" + margin.left + "," + (margin.top + padding) +")");                   
                          
    };//setupchart
  
    setupChart();
  
    
    var drawChart = function() {
      
      //var chart = this;
      
      //var localgridsize = this.gridSize;
      //var padding = this.padding;
      //var cs = this.colorScale;
  
      var columns_update = columns_container.selectAll("g").data(currentdata, function(d) { return d.key; });   
      console.log("columns update");
      console.log(columns_update);
      
      var columns_enter = columns_update.enter().append("g");
      columns_enter
          .append("text")
            .text(function (d) { return d.key; })
            .attr("x", 4) // once you rotate x becomes y
            .attr("y", -3)
            .attr("class", "heatcountrylabel")              
            .attr("transform", "rotate(-90)")              
            .style("text-anchor", "left")
            .on("click", function(d, i) { 
              //console.log(d);
              context.selectCountry(d.key);
            })
            .append("title")
              .text(function(d) {return d.values[0].name; });
              
      var rect_update = columns_update.selectAll("rect")
                            .data(function(d) { return d.values}, function(d) { return d.row; });                                
      rect_update.enter()
                .append("rect")
                .attr("x", function(d,i) { return -rectheight; })
                .attr("y", function(d,i) { return (i * rectstep); })
                //.attr("class", "hour bordered")
                .attr("width", function(d,i) { return rectheight; })
                .attr("height", function(d,i) { return rectheight; })
                //.style("fill", function(d,i) { return (d.value == null) ? "#eee" : colorScale(d.value); })
                // throwing in a title element
                .append("title")
                  .text(function(d) {return (d.value == null) ? "null" : d3.round(d.value,2);});      
                  
      //console.log("rect update");
      //console.log(rect_update.selectAll("rect"));
      
      var title_update = columns_update.selectAll("title")
                  .data(function(d) { return d.values}, function(d) { return d.row; })
                  .text(function(d) {return (d.value == null) ? "null" : d3.round(d.value,2) ;}, function(d) { return d.row; });
      rect_update
          .style("fill", function(d,i) { return (d.value == null) ? "#eee" : colorScale(d.value); });
      columns_update
          .transition()
          .duration(700)
          .attr("transform",function(d,i) { return "translate(" + (xscale(i)) + ",0)" });
      
    };//drawChart
    
    this.showStat = function(whichstat) {
      console.log(data);
      currentstat = whichstat;
      currentflatdata = [];
      
      d3.keys(collabels).forEach(function(ccode, index) {
        //console.log("ccode " + ccode);
        //console.log("data ccode " + data[ccode]);          
        rowlabels.forEach(function(row, rindex) {
          var entry = new Object();
          entry.ccode = ccode;
          entry.row = rindex;     
          entry.name = collabels[ccode];
          entry.value = data[ccode][currentstat][rindex];
          currentflatdata.push(entry);              
        }, this);  
      }, this);       
      console.log("heatmap: unnested, unsorted");
      console.log(currentflatdata);
      
      var min = d3.min(currentflatdata.map(function(d,i) { return d.value; }));
      var max = d3.max(currentflatdata.map(function(d,i) { return d.value; }));
      
      currentdata = sorter
          .sortKeys(function(a,b) { return doSort(a,b, currentRowSelection); })
          .entries(currentflatdata);
          
      console.log("heatmap: nested, sorted");
      console.log(currentdata);
      console.log("currentstat");
      console.log(currentstat);
      console.log(varlookup[currentstat].lightColor);
      
      var color = d3.scale.linear()
                     .domain([0,1])
                     .range([varlookup[currentstat].lightColor, varlookup[currentstat].darkColor]); 
      var colorq = d3.range(.1, 1.1, .1);
      colorq = colorq.map(function (input) { return color(input); });
      
      //console.log(d3.values(currentdata));
      
      //console.log(colorq);
      colorScale = d3.scale.quantize()
            .domain([min, max])
            .range(colorq);
        
      //setupChart();
      drawChart();
      
    };
    
    this.selectCountries = function(countries) {
      console.log("Select countries in heatmap: ");
      console.log(countries);
      
      var allcountrylabels = columns_container.selectAll("text.heatcountrylabel");
      allcountrylabels.style("fill", function(d,i) { return (countries.indexOf(d.key) != -1) ? "#000000" : "#bebebe" } );
    };
            
} // HEatmap

