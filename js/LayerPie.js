
LayerPie = function(element,data, width, height, innerRad) {
  this.element = element;
  var data = data;
  // 270, 250
  var width = width;
  var height = height;
  var innerRad = innerRad; //15, 100
  //var cwidth = 8;
  var label_height = 20;
  
  var center_x = width / 2;
  var center_y = label_height + (height - label_height) / 2;
  var outer_radius = d3.min(new Array(center_x, center_y - label_height));
  console.log("outer_radius" + outer_radius);
  
  var equalchunks = false;

  /*
  data = d3.nest()
    .key(function(d) { return d.ring; })
    .entries(data);
    
  console.log("nested data");
  console.log(data);
  */

  //var color = d3.scale.category20();
  var radius = d3.scale.ordinal().domain(data.map(function(el, ind) { return ind; })).rangeRoundBands([innerRad, outer_radius],.07);
  //console.log("rad: " + radius(1));
  //console.log("rad: " + radius.rangeBand());
  //console.log(data.map(function(el, ind) { return ind; }));

  var pie = d3.layout.pie()
      .value(function(el) { return el.arcvalue ; })
    //.value(function(el) { return ( (equalchunks) ? el.propvalue : el.value ); })
    //.value(function(el) { return (el.value == null) ? 0 : el.value; })
    .sort(null);

  var arc = d3.svg.arc();

  var cont = d3.select(this.element).append("svg")
    .attr("width", width)
    .attr("height", height);
    
  var txt = cont      
        .append("text")
        .attr("x", 0)
        .attr("y", label_height)
        .attr("width", width)
        .attr("height", label_height)
        .attr("class", "datatext")
        .text("mouse over a pie chunk to see data");
  var svg = cont.append("g")
//      .attr("width", width)
//      .attr("height", height - label_height)        
    //.attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")")
    .attr("transform", "translate(" + center_x + "," + center_y + ")")
    .on("click", function(d){
      obj.changeChunks();  
      });
  
/*
// originals below
  var svg = d3.select(this.element).append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .append("g")
    //.attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")")
    .attr("transform", "translate(" + center_x + "," + center_y + ")")
    .on("click", function(d){
      obj.changeChunks();  
      });
  var txt = svg.append("text")
        .attr("x", -(center_x))
        .attr("y", -(80))
        .attr("width", center_x)
        .attr("height", 50)
        .attr("class", "datatext")
        .text("mouse over a pie chunk to see data");
*/        
  var gs, path;
  var obj = this;
  
  var labels;
   //var hole = 0;


  this.update = function(newdata) {
    
    data = newdata;
    
    console.log("in update function for pie");
    svg.selectAll("g").remove();
    
  /*
  data = d3.nest()
      .key(function(d) { return d.ring; })
      .entries(data);
    */
    console.log("nested data");
    console.log(data);
      
      
    labels = data.map(function(el) { return el.key; }); 
    console.log(labels);
    chunks = data[0].values.map(function(el) { return el.chunk; }); 
    console.log(chunks);
    var color = d3.scale.ordinal().domain(chunks).range(colorbrewer.Pastel1[6]);
    
    
    gs = svg.selectAll("g")
        .data(data, function(d) { return d.key; })
        .enter().append("g");
        
    console.log("gs");
    console.log(gs);
          
    path = gs.selectAll("path")
      .data(function(d) { return pie(d.values); })
      //.data(function(d) { return pie(d.values.map(function(el) { console.log("chunk"); console.log(el); return (el.value == null) ? 0 : el.value; })); })
      .enter().append("path")
      .attr("class", "piepath")      
      //.attr("fill", function(d, i,j) { return d3.scale.linear().domain([0, data[j].values[i].total]).range(["white", color(i)])(data[j].values[i].value); })      
      //.attr("fill", function(d, i) { return color(i); })
      .attr("fill", function(d, i,j) { return data[j].values[i].color; })
      //.attr("d", function(d, i, j) { return arc.innerRadius(hole + 2+cwidth*j).outerRadius(hole + cwidth*(j+1))(d); })
      .attr("d", function(d, i, j) { return arc.innerRadius(radius(j)).outerRadius(radius(j) + radius.rangeBand())(d); })
      .on("mouseover", function(d,i,j){
        //console.log("mouse");
        //console.log(d);        
        //txt.text(labels[j] + " " + varnames[chunks[i]] + " " + d3.format("$,")(d3.round(data[j].values[i].value,0)))
        txt.text(data[j].values[i].dispvalue);
      })  
      .on("mouseout", function(d,i,j){
        txt.text("");
        //console.log("mouse");  
      });
  };  
  this.changeChunks = function() {
  
    console.log("change chunks");
    console.log(equalchunks);
    equalchunks = (equalchunks) ? false : true;
    console.log(equalchunks);
    
    data.forEach(function(ringObj, ringIndex) {
      console.log("ringObj");
      console.log(ringObj);
        
      ringObj.values.forEach(function(chunkObj, chunkIndex) {
          chunkObj.arcvalue = (equalchunks) ? 1 : chunkObj.value;    
        });
    });
    this.update(data);
  };
    
 
  this.update(data);
}
  