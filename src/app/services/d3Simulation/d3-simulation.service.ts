import { Injectable } from '@angular/core';

import * as d3 from 'd3';
import { JsonToD3Service } from "../../services/jsonToD3/json-to-d3.service";

@Injectable({
  providedIn: 'root',
})
export class D3SimulationService {

  constructor(private jsonToD3Service: JsonToD3Service) {
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
      .force('link', d3.forceLink().id((d: any) => d.id).distance(200).strength(2))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(200));

    // // create json for d3-json 
    // use the output json (value) 
    this.jsonToD3Service.myD3PromiseObject.then(function(value) {

      console.log(value);
      update(value.links, value.nodes, g);
    });
    

    // Update Nodes and Links
    // create link and node and d3-instances for html 
    function update(links, nodes, g) {

      // links
      const link = g.selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
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
          if (d.type == "globalIdentifier") {return "/#"+"xml-"+ d.label} ;})
        
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
            if (d.type == "globalIdentifier") {return d.label};});
      
      // Set title
      node.append("title")
          .text( (d: any) => {
            if (d.type != "globalIdentifier") {return d.label};});
        

      // simulation -- nodes and links
      simulation
          .nodes(nodes)
          .on("tick", ticked);
      simulation.force<d3.ForceLink<any, any>>('link')
          .links(links);

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
