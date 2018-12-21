import {Component, OnInit} from '@angular/core';

import * as d3 from 'd3';


@Component({
  selector: 'app-textview',
  templateUrl: './textview.component.html',
  styleUrls: ['./textview.component.css']
})
export class TextviewComponent implements OnInit {

  public dataTable;


  constructor() {
  }

  ngOnInit(){
    
    //                              MARKO POLO    
    // GET GLOBAL DATA TABLE JSON
    // ---------------------
    let dataTableMarko = require('../../../assets/dataTableMarko.json');
        
      // Global-DataTable-Object
      this.dataTable =dataTableMarko["places"];

      // go through Global-DataTable-Elements
      for (let i = 0; i < this.dataTable.length; i++){

        // IF Global-DataTable-Element has "xml_id" Attribute:
        if (this.dataTable[i]["ref"] != undefined){

          // global_object_ref
          let global_object_ref = this.dataTable[i]["ref"];   

          // Find Local-Element with this Global-Element connection
          // ----------------------------------------------------
          // Alle Objekte mit "a[class="placeName"]" 
          let xmlIdPlaces = document.querySelectorAll('a[class="placeName"]');

          // GET LOCAL OBJECT 
          // WITH FITTING:
          // ref
          for(let j = 0; j < xmlIdPlaces.length; j++){

            // get local "ref"
            let local_object_ref =  String(xmlIdPlaces[j].getAttribute("ref"));

            // compare global_id & local_id  -- if (equal):
            if (local_object_ref == global_object_ref){
              
              // set "globalIdentifier"
              let globalIdName = this.dataTable[i]["name"];
              xmlIdPlaces[j].setAttribute("globalIdentifier", globalIdName);

              // set "click-event" - "NodeZoom(event)" function
              xmlIdPlaces[j].addEventListener("click", this.NodeZoom);

              // set "id"
              xmlIdPlaces[j].setAttribute("id", "xml-" + globalIdName);

              // set "href"
              xmlIdPlaces[j].setAttribute("href", "#rdf-" + globalIdName);
            }
          }
        }
      }

  }

  
  // Function -- NodeZoom for zoom on rdf-Visualization
  NodeZoom(event) {

    // declare witch node to zoom on by XML-Object-ID
    var target = event.target || event.srcElement || event.currentTarget;
    var id = target.attributes.globalIdentifier.nodeValue;
    let targetNode = "rdf-" + String(id); 
    
    console.log(targetNode);

    // get node-position by node-id 
    if (document.getElementById(targetNode) != null){
  
      let b = (document.getElementById(targetNode) as any).getBBox();
      
      let matrix = (document.getElementById(targetNode) as any).getAttribute("transform").replace(/[^0-9\-.,]/g, '').split(',');
      matrix[0] =  Number(matrix[0]) + Number(b.x);
      matrix[1] =  Number(matrix[1]) + Number(b.y);

      let svg = document.getElementById('svg');    

      // update svg viewbox in html with node-position
      svg.setAttribute("viewBox", matrix[0] + " " + matrix[1] + " " + 690 + " " + 650);
      
      // update transform in html
      document.getElementById('everythingZoom').setAttribute("transform","translate("+ 345 +","+ 325 +") scale(1)");
    
      // update transform --zoom.transform-- in "svg" d3-selection
      let t = d3.zoomIdentity.translate(345, 325).scale(1);
      let zoom = d3.zoom();
      let svgD3 = d3.select("svg")
              .call(zoom.transform, t);
    }
  }
}