<style>

.line {
  fill: none;
  stroke: gray;
  stroke-opacity: .8;
  stroke-width: 1.5px;
}

.line.active{
  fill: none;
  stroke: red;
}

.path.active{
  fill: none;
  stroke: black;
}

text {
  font-size: 28px;
  font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
  text-align: "center";
}

path.vorgons {
fill: aliceblue;
stroke: aliceblue;
stroke-opacity: 0;
fill-opacity: 0;
}
</style>    

           <input type="number" id = "sampsize" min="10" max="1000" step="1" value="150">

  
  <button name = "sample" type = "button" class="button postfix"> Resample! </button>

<script src="http://d3js.org/d3.v3.min.js"></script>
<script>

var margin = {top: 60.5, right: 10.5, bottom: 5.5, left: 10.5},
    width = $("p").width() - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([-3, 3])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");


var line = d3.svg.line()
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1]); })
   ;
   


var svg = d3.select("p").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var voronoi = d3.geom.voronoi()
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1]); })
    .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);

var title = svg.selectAll("text").data("1");
var header = "Michael Sachs"

title.enter().append("text")
.text(header)
.attr("text-anchor", "middle")
.attr("x", function(d){ return x(.5); })
.attr("y", function(d){ return y(2.5); });

function sampleData(nnn){

  var U = [];
  var S = [];
  for(var i=0; i<nnn; i++){
      U.push(Math.random());
      S.push((i+1)/nnn);
  }
  var U1 = U.sort();

  var d = (Math.random()*.4 + .8);
  var out = [];
  for(var i=0; i<nnn; i++){

    out.push([S[i], Math.sqrt(nnn)*(U1[i] - d*S[i])]);

  }

  return out;
  
}
  
  var mydat = [{"link":"http://sachsmc.github.io/blog","name":"a", "desc":"Blog", "pts":sampleData(150)},
{"link":"http://www.ncbi.nlm.nih.gov/pubmed/?term=Michael+Sachs%5BAuthor+-+Full%5D#!","name":"b", "desc":"Papers", "pts":sampleData(150)},
{"link":"http://github.com/sachsmc","name":"c", "desc":"Projects", "pts":sampleData(150)},
{"link":"https://en.wikipedia.org/wiki/Empirical_process","name":"d", "desc":"What is this plot?", "pts":sampleData(150)}];


var cdfs = svg.selectAll("svg")
.data(mydat).enter().append("a")
.selectAll("a.path").append("a.path").data(mydat.map(function(d){ return d.pts; }))
;

cdfs.enter().append("path")
    .attr("class", "line")
    .attr("d", line)
    .attr("id", function(d, i){ return mydat[i].name;  })
    ;
  
    
var dattogons = [];
for(var i=0; i<mydat.length; i++){

  for(var j=0; j<mydat[i].pts.length; j++){
  
  dattogons.push({"name":mydat[i].name,"desc":mydat[i].desc, "link": mydat[i].link, "pts": mydat[i].pts[j]});
  
  }

}
    
var gons = voronoi(dattogons.map(function(d){ return d.pts; }))
    .map(function(d, i){  
    return {"name":dattogons[i].name, "link":dattogons[i].link, "desc":dattogons[i].desc, "verts":d };  
    });


    
var polys = svg.selectAll("a.path.vorgons")
    .data(gons);

polys.enter().append("a").attr("xlink:href", function(d){ return d.link; })
.append("path").attr("class", "vorgons")
    .attr("d", function(d) { return "M" + d.verts.join("L") + "Z"; })
    .attr("name", function(d){ return d.name; })
     .on("mouseover", function(d){
     
       svg.selectAll("a").selectAll("path#"+d.name)
              .classed("active", true);   
              
   svg.selectAll("text").transition().duration(150).style("fill-opacity", 0)
   .transition().delay(150).text(d.desc).style("fill-opacity", 1);
   
   
   
;



    })
    .on("mouseout", function(d){
      
      svg.selectAll("a").selectAll("path#"+d.name)
              .classed("active", false);    
  
  svg.selectAll("text").transition().duration(150).style("fill-opacity", 0)
   .transition().delay(150).text(header).style("fill-opacity", 1);
   
    
    });
  


// update function

function update(cdfs, polys, data){

  
var dattogons = [];
for(var i=0; i<data.length; i++){

  for(var j=0; j<data[i].pts.length; j++){
  
  dattogons.push({"name":data[i].name,"desc":data[i].desc, "link": data[i].link, "pts": data[i].pts[j]});
  
  }

}
    
var gons = voronoi(dattogons.map(function(d){ return d.pts; }))
    .map(function(d, i){  
    return {"name":dattogons[i].name,"desc":dattogons[i].desc, "link":dattogons[i].link, "verts":d };  
    });


var polys = svg.selectAll("path.vorgons").data(gons);

polys.enter().append("a").attr("xlink:href", function(d){ return d.link; })
.append("path").attr("class", "vorgons")
    .attr("d", function(d) { return "M" + d.verts.join("L") + "Z"; })
    .attr("name", function(d){ return d.name; }).on("mouseover", function(d){
     
       svg.selectAll("a").selectAll("path#"+d.name)
              .classed("active", true);   
              
   svg.selectAll("text").transition().duration(150).style("fill-opacity", 0)
   .transition().delay(150).text(d.desc).style("fill-opacity", 1);
   
   
   
;



    })
    .on("mouseout", function(d){
      
      svg.selectAll("a").selectAll("path#"+d.name)
              .classed("active", false);    
  
  svg.selectAll("text").transition().duration(150).style("fill-opacity", 0)
   .transition().delay(150).text(header).style("fill-opacity", 1);
   
    
    });

polys.transition().duration(10)
.attr("xlink:href", function(d){ return d.link; })
.attr("class", "vorgons")
    .attr("d", function(d) { return "M" + d.verts.join("L") + "Z"; })
    .attr("name", function(d){ return d.name; });
    
polys.exit().remove();    
   
var cdfs = cdfs.data(data.map(function(d){ return d.pts; }))
;

cdfs.transition().duration(500)
    .attr("d", line)
    .attr("id", function(d, i){ return data[i].name;  })
    ;   
   

}





d3.select(".button").on("click", function(){
var ssize = Number(document.getElementById("sampsize").value);
update(cdfs, polys,  [{"link":"http://sachsmc.github.io/blog","name":"a", "desc":"Blog", "pts":sampleData(ssize)},
{"link":"http://www.ncbi.nlm.nih.gov/pubmed/?term=Michael+Sachs%5BAuthor+-+Full%5D#!","name":"b", "desc":"Papers", "pts":sampleData(ssize)},
{"link":"http://github.com/sachsmc","name":"c", "desc":"Projects", "pts":sampleData(ssize)},
{"link":"https://en.wikipedia.org/wiki/Empirical_process","name":"d", "desc":"What is this plot?", "pts":sampleData(ssize)}]);  
});

    
</script>     
      
