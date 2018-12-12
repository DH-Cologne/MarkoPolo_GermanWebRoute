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

    // GET GLOBAL DATA TABLE JSON
    // ---------------------
    let dataTableE = require('../../../assets/dataTable.json');
        
      // Global-DataTable-Object
      this.dataTable =dataTableE["objects"];

      // go through Global-DataTable-Elements
      for (let i = 0; i < this.dataTable.length; i++){

        // IF Global-DataTable-Element has "xml_id" Attribute:
        if (this.dataTable[i]["xml_id"] != undefined){

          // global_object_xml_id
          let global_object_xml_id = this.dataTable[i]["xml_id"];          

          // Find Local-Element with this Global-Element connection
          // ----------------------------------------------------
          // Objekte mit "xml_id"
          let xmlIdObjects = document.querySelectorAll('a[xml_id]');

          // GET LOCAL OBJECT 
          // WITH FITTING:
          // XML_ID
          for(let j = 0; j < xmlIdObjects.length; j++){

            // get local "xml_id"
            let local_object_xml_id =  String(xmlIdObjects[j].getAttribute("xml_id"));

            // compare global_id & local_id  -- if (equal):
            if (local_object_xml_id == global_object_xml_id){
              
              // set "globalIdentifier"
              let globalIdName = this.dataTable[i]["name"];
              xmlIdObjects[j].setAttribute("globalIdentifier", globalIdName);

              // set "click-event" - "NodeZoom(event)" function
              xmlIdObjects[j].addEventListener("click", this.NodeZoom);

              // set "id"
              xmlIdObjects[j].setAttribute("id", "xml-" + globalIdName);

              // set "href"
              xmlIdObjects[j].setAttribute("href", "#rdf-" + globalIdName);
            }
          }
        }
      }

    
    // OLD VERSION BEFORE GLOBAL_DATA-TABLE
    // -----------------------------------
    // // Objekte mit "globalIdentifier"
    // let identifierObjects = document.querySelectorAll('a[globalIdentifier]');
    
    // for (let i=0; i < identifierObjects.length; i++){

    //   // click-event for "NodeZoom(event)" function
    //   identifierObjects[i].addEventListener("click", this.NodeZoom);
    //   // get "globalIdentifier"
    //   let globalId =  String(identifierObjects[i].getAttribute("globalIdentifier"));
    //   // set "id"
    //   identifierObjects[i].setAttribute("id", "xml-" + globalId);
    //   // set "href"
    //   identifierObjects[i].setAttribute("href", "#rdf-" + globalId);
    // }
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