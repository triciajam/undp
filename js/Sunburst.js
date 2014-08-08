
Sunburst = function(element, width, height, innerRad, leaders) {
  var element = element;
  var flatdata;
  var leaders = leaders;
  //var flatdata = data;
  // 270, 250
  var width = width;
  var height = height;
  var innerRad = innerRad; //15, 100

  var margin = { left: 20, right: 0, top: 0, bottom: 0, cols: 3 };
  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;
  var text_width = 160;
  var pie_width = width - text_width;
  var label_height = 16;
  
  console.log("width " + width);
  console.log("pie_width " + pie_width);
  console.log("height " + height);
  
  var ccode;
  var outer_radius = d3.min(new Array(pie_width, height)) / 2;
  
  var center_x = outer_radius;
  var center_y = center_x;  
  //var outer_radius = d3.min(new Array(center_x, center_y - label_height));
  console.log("outer_radius" + outer_radius);
  
  var equalchunks = true;

  //var radius = d3.scale.ordinal().domain(data.map(function(el, ind) { return ind; })).rangeRoundBands([innerRad, outer_radius],.07);
  //var data = d3.nest()
  //          .key(function(d) { return d.ring; })
  //          .entries(flatdata);  
  //var radius = d3.scale.ordinal().domain(data.map(function(el, ind) { return ind; })).rangeRoundBands([innerRad, outer_radius],.07);
  var data;
  var radius;

  var pie = d3.layout.pie()
      .value(function(el) { return el.arcvalue ; })
      .sort(null);

  var arc = d3.svg.arc();

  var cont = d3.select(element).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
    
  var txtcenter = cont.append("g")
                .attr("transform", "translate(" + (margin.left + center_x) + "," + (margin.top + center_y) + ")");
                
  var txtbottomright = cont.append("g")
                .attr("transform", "translate(" + (margin.left + pie_width) + "," + (margin.top) + ")");
  var txttopright = cont.append("g")
                .attr("transform", "translate(" + (margin.left + pie_width) + "," + (margin.top) + ")");
  
    
  var txt_svg = txtcenter.append("g")
//      .attr("transform", "translate(" + (margin.cols + pie_width) + "," + margin.top + ")")            
      .attr("transform", "translate(0,0)")            
      .append("text")
      .attr("x", 0)
        .attr("y", label_height)
        .attr("width", width)
        .attr("height", label_height)
        .attr("class", "pietext")
        .attr("text-anchor", "middle")
        .text("mouse over a pie chunk to see data");
  var txt_svg2 = txtcenter.append("g")
      //.attr("transform", "translate(" + (margin.cols + pie_width) + "," + (margin.top + label_height) + ")")            
      .attr("transform", "translate(0,0)")            
      .append("text")
      .attr("x", 0)
        .attr("y", -label_height)
        .attr("width", width)
        .attr("height", label_height)
        .attr("class", "pietext")
        .attr("text-anchor", "middle")
        .text("mouse over a pie chunk to see data");
  var txt_svg3 = txtcenter.append("g")
      //.attr("transform", "translate(" + (margin.cols + pie_width) + "," + (margin.top + 2*label_height) + ")")            
      .append("text")
      .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", label_height)
        .attr("class", "pietext")
        .attr("text-anchor", "middle")
        .text("mouse over a pie chunk to see data");
  var txt_svg4 = txtbottomright.append("g")
      //.attr("transform", "translate(" + (margin.cols + text_width) + "," + (margin.top + 3*label_height) + ")")            
      //.attr("transform", "translate(0," + (margin.top + 2*label_height) + ")")            
      .append("text")
      .attr("x", 0)
        .attr("y", pie_width - 5*label_height)
        .attr("width", width)
        .attr("height", label_height)
        .attr("class", "pietext")
        .text("mouse over a pie chunk to see data");
  var txt_svg5 = txtbottomright.append("g")
      //.attr("transform", "translate(" + (margin.cols + pie_width) + "," + (margin.top + 4*label_height) + ")")            
      //.attr("transform", "translate(0," + (margin.top + 3*label_height) + ")")            
      .append("text")
      .attr("x", 0)
        .attr("y", pie_width - 4*label_height)
        .attr("width", width)
        .attr("height", label_height)
        .attr("class", "pietext")
        .text("mouse over a pie chunk to see data");
  var txt_svg6 = txtbottomright.append("g")
      //.attr("transform", "translate(" + (margin.cols + pie_width) + "," + (margin.top + 5*label_height) + ")")            
      //.attr("transform", "translate(0," + (pie_width - 3*label_height) + ")")            
      .append("text")
      .attr("x", 0)
        .attr("y", pie_width - 3*label_height)
        .attr("width", width)
        .attr("height", label_height)
        .attr("class", "pietext")
        .text("mouse over a pie chunk to see data");
   var txt_svg7 = txtbottomright.append("g")
      //.attr("transform", "translate(" + (margin.cols + pie_width) + "," + (margin.top + 6*label_height) + ")")            
      //.attr("transform", "translate(0," + (pie_width - 2*label_height) + ")")            
      .append("text")
      .attr("x", 0)
        .attr("y", pie_width - 2*label_height)
        .attr("width", width)
        .attr("height", label_height)
        .attr("class", "pietext")
        .text("mouse over a pie chunk to see data");
   var txt_svg8 = txtbottomright.append("g")
      //.attr("transform", "translate(" + (margin.cols + pie_width) + "," + (margin.top + 7*label_height) + ")")            
      //.attr("transform", "translate(0," + (pie_width - label_height) + ")")            
      .append("text")
      .attr("x", 0)
        .attr("y", pie_width - label_height)
        .attr("width", width)
        .attr("height", label_height)
        .attr("class", "pietext")
        .text("mouse over a pie chunk to see data");

   var txt_svg9a = txttopright.append("g")
      //.attr("transform", "translate(" + (margin.cols + pie_width) + "," + (margin.top + 7*label_height) + ")")            
      //.attr("transform", "translate(0," + (pie_width - label_height) + ")")            
      .append("text")
      .attr("x", 0)
        .attr("y", label_height)
        .attr("width", width)
        .attr("height", label_height)
        .attr("class", "pietext")
        .text("Mouse over pie to see data.");
   var txt_svg9 = txttopright.append("g")
      //.attr("transform", "translate(" + (margin.cols + pie_width) + "," + (margin.top + 7*label_height) + ")")            
      //.attr("transform", "translate(0," + (pie_width - label_height) + ")")            
      .append("text")
      .attr("x", 0)
        .attr("y", label_height*2)
        .attr("width", width)
        .attr("height", label_height)
        .attr("class", "pietext")
        .text("each ring = one year");
   var txt_svg10 = txttopright.append("g")
      //.attr("transform", "translate(" + (margin.cols + pie_width) + "," + (margin.top + 7*label_height) + ")")            
      //.attr("transform", "translate(0," + (pie_width - label_height) + ")")            
      .append("text")
      .attr("x", 0)
        .attr("y", label_height*3)
        .attr("width", width)
        .attr("height", label_height)
        .attr("class", "pietext")
        .text("each chunk = one mineral");
  var txt_svg11 = txttopright.append("g")
      //.attr("transform", "translate(" + (margin.cols + pie_width) + "," + (margin.top + 7*label_height) + ")")            
      //.attr("transform", "translate(0," + (pie_width - label_height) + ")")            
      .append("text")
      .attr("x", 0)
        .attr("y", label_height*4)
        .attr("width", width)
        .attr("height", label_height)
        .attr("class", "pietext")
        .text("fill shows relative prod.");
  var txt_svg11 = txttopright.append("g")
      //.attr("transform", "translate(" + (margin.cols + pie_width) + "," + (margin.top + 7*label_height) + ")")            
      //.attr("transform", "translate(0," + (pie_width - label_height) + ")")            
      .append("text")
      .attr("x", 0)
        .attr("y", label_height*5)
        .attr("width", width)
        .attr("height", label_height)
        .attr("class", "pietext")
        .text("darker = higher values");


  var pie_svg = cont.append("g")
      .attr("transform", "translate(" + (margin.left + center_x) + "," + (margin.top + center_y) + ")")
      .on("click", function(d){
        changeChunks();  
       });
  

  var gs, path;
  var obj = this;
  
  var labels;
   //var hole = 0;

  //!! add setNewCountry method that 
  // nests the data, does the roll-up, 
  // Creates the new pie that checks equalcunks and then either points
  // the pie to value (actial value) or arcvalue (which I will always make one)
  // then it calls update
  //!! add setEqualChunks method that take a boolean and sets the private variable.


  update = function() {
       
    //flatdata = newdata;
    
    /*
    d3.nest().key(function(d) { return d.ring; })
             .rollup()
    */
    /*
    data = d3.nest()
            .key(function(d) { return d.ring; })
            .entries(flatdata);      
    */        
            
    
    console.log("in update function for pie");
    pie_svg.selectAll("g").remove();
    
    console.log("nested data");
    console.log(data);
      
      
    labels = data.map(function(el) { return el.key; }); 
    console.log(labels);
    chunks = data[0].values.map(function(el) { return el.chunk; }); 
    console.log(chunks);
    var color = d3.scale.ordinal().domain(chunks).range(colorbrewer.Pastel1[6]);
    
    
    gs = pie_svg.selectAll("g")
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
        //console.log("mouse pie");
        //console.log(d);        
        //txt.text(labels[j] + " " + varnames[chunks[i]] + " " + d3.format("$,")(d3.round(data[j].values[i].value,0)))
        //txt_svg2.text(data[j].values[i].dispvalue);
        txt_svg.text(d.data.ring);
        txt_svg2.text(d.data.chunk); //d3.format(",")(d.data.value) + "mt");
        txt_svg3.text(d3.format(",")(d.data.value) + " mt");
        txt_svg4.text(d3.format("%")(d.data.pctOfAllCountryProd) + " " + ccode + " Total Prod")
        txt_svg5.text((d.data.pctOfAllChunkProd != null) ? d3.format("%")(d.data.pctOfAllChunkProd) + " of " + d.data.chunk : "No Production")
        if (d.data.pctOfAllChunkProd != null) {
          txt_svg6.text("1: " + leaders[d.data.chunk][j][0].key + " " + d3.format(",")(leaders[d.data.chunk][j][0].value));
          txt_svg7.text("2: " + leaders[d.data.chunk][j][1].key + " " + d3.format(",")(leaders[d.data.chunk][j][1].value));
          txt_svg8.text("3: " + leaders[d.data.chunk][j][2].key + " " + d3.format(",")(leaders[d.data.chunk][j][2].value));
        } else {
          txt_svg6.text("");
          txt_svg7.text("");          
          txt_svg8.text("");                  
        }
        
        
        //txt_svg5.text("of " + ccode + " Total Prod");
        //txt_svg7.text("of All " + d.data.chunk + " Prod");        
        //txt_svg6.text(d.data.ring + " " + d3.format("%")(d.data.pctOfAllChunkProd));
      })  
      .on("mouseout", function(d,i,j){
        //txt_svg.text("");
        //txt_svg2.text("");
        
        //console.log("mouse");  
      });
  };
  
  this.setCountry = function(name, subname, newdata) {
    ccode = name;
    flatdata = newdata;
    flatdata.forEach(function(chunkObj) {
      chunkObj.arcvalue = (equalchunks) ? 1 : chunkObj.value;  
    })
    data = d3.nest()
            .key(function(d) { return d.ring; })
            .entries(flatdata);   
    radius = d3.scale.ordinal().domain(data.map(function(el, ind) { return ind; })).rangeRoundBands([innerRad, outer_radius],.07);
    
    txt_svg.text("Production");
    txt_svg2.text(ccode + " 2007-2011");
    txt_svg3.text("Mineral");
    txt_svg4.text("")
    txt_svg5.text("");
    txt_svg6.text("");
    txt_svg7.text("");
    txt_svg8.text("");
    
    
    update();        
     
  }
   
  changeChunks = function() {
  
    console.log("change chunks");
    console.log(equalchunks);
    equalchunks = (equalchunks) ? false : true;
    console.log(equalchunks);
    
    flatdata.forEach(function(chunkObj) {
      chunkObj.arcvalue = (equalchunks) ? 1 : chunkObj.value;  
    })
    data = d3.nest()
            .key(function(d) { return d.ring; })
            .entries(flatdata);   
    this.update();
    
    /*
    data.forEach(function(ringObj, ringIndex) {
      console.log("ringObj");
      console.log(ringObj);
        
      ringObj.values.forEach(function(chunkObj, chunkIndex) {
          chunkObj.arcvalue = (equalchunks) ? 1 : chunkObj.value;    
        });
    });
    this.update(data);
    */
  };
    
 
  //this.changeChunks(flatdata);
}
  
