import { Injectable } from '@angular/core';

import * as d3 from 'd3';
// import { JsonToD3Service } from "../../services/jsonToD3/json-to-d3.service";

import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class D3SimulationService {

  public d3Json: any;

  constructor( private http: HttpClient) {

  }

  // USE THE AUTOMATICALLY GENERATED DATA-TABLE (MARKO POLO) TO GENERATE THE D3 USABLE JSON WITH "LINKS" AND "NODES"
  // 
  // MARKO POLO
  public getJSON(): Observable<any> {
    return this.http.get("./assets/dataTableMarko.json")
  }

  public prepareSimulation(){
    
    // GET JSON_DATA_TABLE_MARKO
    this.getJSON().subscribe(data => {
      console.log("data-1");
      console.log(data);

      // TRANSFORM JSON-DATA FOR D3
      this.d3Json = jsonToD3(data);
      console.log("data-2");
      console.log(this.d3Json);

      // START SIMULATION
      this.createD3Simulation();
    });

  }

  

  public createD3Simulation() {


    // select <svg> Html-Selection for d3 
    const svg = d3.select("svg");
    // and add attributes -- width/height/color/id -- and zoom-behaviour
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    svg.attr("id", "svg")
    .call(d3.zoom()
            .scaleExtent([0.05, 3])
            .on("zoom", zoom_actions));
    
    //add encompassing group -- later seen as HTML-group (<g>-Tag) -- for the zoom 
    // with class and id attribute
    const g = svg.append("g")
          .attr("class", "everything")
          .attr("id", "everythingZoom");
    
    // d3 Simulation -- Simulates the Nodes and Links
    // with particular distance and thikness of the Links
    // oriented in the Centre of the svg
    // and particular distance of the Nodes
    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: any) => d.id).distance(100).strength(2))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(300));

  

    console.log("data-3");
    console.log(this.d3Json);

    // VIZUALIZATION FUNCTION
    update(this.d3Json.links, this.d3Json.nodes, g);



    

    // Update Nodes and Links
    // create link and node and d3-instances for html 
    function update(links, nodes, g) {

      // links
      const link = g.selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr('stroke', "red")
        .attr('stroke-width', "2")
        .attr('marker-end','url(#arrowhead)')
      link.append("title")
        .text((d:any) => d.type);
      
        // edges (connections)   
      const edgepaths = g.selectAll(".edgepath")
        .data(links)
        .enter()
        .append('path')
        .attr('class','edgepath')
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
        .attr('id',(d:any,i:any) => 'edgepath' + i)
        .style("pointer-events", "none");
      
        // edgelabels
      const edgelabels = g.selectAll(".edgelabel")
        .data(links)
        .enter()
        .append('text')
        .style("pointer-events", "none")
        .attr('class', 'edgelabel')
        .attr('id',(d:any,i:any) => 'edgelabel' + i)
        .attr('font-size', 10)
        .attr('fill', '#aaa');
      edgelabels.append('textPath')
        .attr('xlink:href', (d:any, i:any) => '#edgepath' + i)
        .style("text-anchor", "middle")
        .style("pointer-events", "none")
        .attr("startOffset", "50%")
        .text((d:any) => d.type);


      // nodes
      const node = g.selectAll(".node")
        .data(nodes)
        .enter()
        
        // Set: href
        .append("a")    
        .attr("xlink:href", (d:any) => {
          if (d.type == "name") {return "/#"+"xml-"+ d.label} ;})
        
        // Set: globalIdentifier
        .append("g")
        .attr("globalIdentifier", (d:any) => {
          if (d.type == "globalIdentifier") {return d.label};})

        .attr("class", "node")
        .attr("id", (d:any) => "rdf-" + d.label)
        .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                //.on("end", dragended)
              );
      node.append("circle")
          .attr("r", 10)
          .style("fill", (d:any, i:any) => color (d.color))
          .style("opacity", 5)
      
      // Set label
      node
          .append("text")
          .attr("dy", -8)
          .text( (d:any) => {
            return d.label
          });
      
      // Set title
      node.append("title")
          .text( (d: any) => {
            return d.label});
        

      // simulation -- nodes and links
      simulation
          .nodes(nodes)
          .on("tick", ticked);
      simulation.force<d3.ForceLink<any, any>>('link')
          .links(links);

      // simulation
      //     .force('tick', function(e) {
      //       nodes.forEach(function(d) {
      //         d.y += (height/2 - d.y);
      //       });
      //     })

      // tick function -- update node positions
      function ticked() {

        link
          .attr('x1', (d: any) =>  d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);
        node  
          .attr("transform", (d: any) => "translate(" + d.x + ", " + d.y + ")");
        edgepaths.attr('d', (d: any) => 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y);
        }
    }    
    
    //zoom functions
    function zoom_actions(){ 
      
      g.attr("transform", d3.event.transform);
    }

    // drag node
    function dragstarted(d) {

      simulation.restart();
      d.fx = d.x;
      d.fy = d.y;
    }
  
    // drag node end
    function dragged(d) {

      simulation.restart();
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
  }
}




// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
function jsonToD3(result) { 

  const content = result["places"];
  const d3Json_2 = { "prefixes": [], "nodes": [], "links": [] };
  
  // Every Node
  let node_id_global = 0;

  // Node-Counter for link Connection of Places (puffer = last-place)
  let node_id_puffer = 0;

  // Places Objects
  content.map(object => {

    // ID OF THE FIRST ADDED NODE OF AN OBJECT GROUP
    let sourceID_2 = d3Json_2.nodes.length;


    // ADD NAME-NODE:
    let node = {};
    node["type"] = "name";
    node["label"] = object["name"];
    node["id"] = node_id_global;
    node["color"] = 0;
    // Add Node
    d3Json_2.nodes.push(node);
    // Add Link
    addLink(node, sourceID_2, d3Json_2, node["type"]);
    node_id_global++;

    // ------------------------------------------------------------
    // Connect places (by order of appearance)
    let targetID;
    targetID = node["id"];
    const link = {};
    link["source"] = node_id_puffer;
    link["target"] = targetID;
    link["type"] = "Marko Polo Route";
    d3Json_2.links.push(link);
    // Puffer for next time equal to root of this place-object
    node_id_puffer = sourceID_2; 
    // ------------------------------------------------------------


    // // ADD GEO.LOCATION-NODE:
    // let node_2 = {};
    // node_2["type"] = "geo_location";
    // node_2["label"] = object["geo_location"];
    // node_2["id"] = node_id_global;
    // node_2["color"] = 1;
    // // Add Node
    // d3Json_2.nodes.push(node_2);
    // // Add Link
    // addLink(node_2, sourceID_2, d3Json_2, node_2["type"]);
    // node_id_global++;

    // // ADD REF-NODE:
    // let node_3 = {};
    // node_3["type"] = "ref";
    // node_3["label"] = object["ref"];
    // node_3["id"] = node_id_global;
    // node_3["color"] = 2;
    // // Add Node
    // d3Json_2.nodes.push(node_3);
    // // Add Link
    // addLink(node_3, sourceID_2, d3Json_2, node_3["type"]);
    // node_id_global++;

    
  });


  console.log("data-7");
  console.log(d3Json_2);
  return d3Json_2;
}

// --------------------------------------------------------------------------------------------
function addLink(node, sourceID, d3Json, key) {

  let typeID = key;

  if (typeID != "name") {

    let targetID;
    targetID = node["id"];
    const link = {};
    link["source"] = sourceID;
    link["target"] = targetID;
    link["type"] = typeID;
    d3Json.links.push(link);
  }
}