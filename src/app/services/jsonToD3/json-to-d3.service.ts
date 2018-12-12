import { Injectable } from '@angular/core';
import { DataService } from "../data/data.service";

import { HttpClient, HttpClientJsonpModule } from '@angular/common/http'; 
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class JsonToD3Service {

  public myD3PromiseObject: Promise<any>;
 

  constructor(private dataService: DataService, private http: HttpClient) {

    this.createD3PromiseObject();
  }

  createD3PromiseObject() {

    let d3Json; 
     
    // myD3Data => zoneAwayPromise
                                                          // RDF-XML Eingabedatei
    this.myD3PromiseObject = this.dataService.xmlToJSON('./assets/wisski_test.xml').then(function (result) {

      console.log(result);

      // KeyList-Alternative
      const keyList = createKeylist(result);      
      
      // d3Json  
      d3Json = jsonToD3(keyList, result);

      // return zoneAwayPromise
      return d3Json;
    }, function (error) {
    });
  }
}


function getJSON(file): Observable<any> {
  HttpClientJsonpModule
  return this.http.get(file);
}

// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
function createKeylist(result) {

  const content = result["rdf:RDF"]["rdf:Description"];

  let keylist = [];  
  let raw1 = [];
  let raw2 = [];
  let raw3 = [];
  
  // add keylist[] --- level-1
  // -------------------------
  content.map(object => {

    Object.keys(object).map(key1 => {

      addKeyToKeylist(key1, raw1);
    });
  });
  keylist.push(raw1);


  // add keylist[][] --- level-2
  // -------------------------
  let x1 = 0;
  content.map(object => {

    Object.keys(object).map(key1 => {

      if (raw1[x1] == key1) {
 
        let raw2_1 = [];
        Object.keys(object[key1]).map(key2 => {
          
          addKeyToKeylist(key2, raw2_1);
        });

        if(raw2_1[0] == "0") {
          
          // IF ARRAY-0
          let bla = Object.keys(object[key1][raw2_1[0]]);
          
          if (bla[0] == "0") {
            
            raw2.push([null]);  
          }
          else {

            raw2.push(bla);
          }
        }
        else {

          raw2.push(raw2_1);
        }

        x1++;
      } 
    });
  });
  keylist.push(raw2);


  // add keylist[][][] --- level-3
  // ---------------------------
  let x2 = 0;
  content.map(object => {

    Object.keys(object).map(key1 => {

      if (raw1[x2] == key1) {

        let raw3_1 = [];

        Object.keys(object[key1]).map(key2 => {
            
            let raw3_2 = [];
            Object.keys(object[key1][key2]).map(key3 =>{

              // DEBUG
              // -------
              if (key3 == "$") {
                Object.keys(object[key1][key2][key3]).map(key4 =>{
                  addKeyToKeylist(key4, raw3_2);
                });
              }
              else {
                addKeyToKeylist(key3, raw3_2);
              }
              // -------
            });

            if(raw3_2[0] == "0") {

              raw3_1.push([null]); 
            }
            else {
    
              raw3_1.push(raw3_2);
            }
        });

        if(raw3_1[0] == "0") {

          raw3.push([null]);  
        }
        else {

          raw3.push(raw3_1);
        }
        x2++;
      } 
    });
  });
  keylist.push(raw3);

  return keylist;
}

// ADD ONE KEY TO CHOSEN KEYLIST_ARRAY
function addKeyToKeylist(key, keylist) {

  // check if "key" already in keylist
  for (let i = 0; i < keylist.length; i++) {

    if (key == keylist[i]) {

      // return if so
      return;
    }
  }
  // if not add key to keylist
  keylist.push(key);
}



// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
function jsonToD3(keyList, result) { 

  const content = result["rdf:RDF"]["rdf:Description"];
  const d3Json_2 = { "prefixes": [], "nodes": [], "links": [] };
  let node_id_global = 0;

  content.map(object => {

    // keyList
    let x = keyList;

    // ID OF THE FIRST ADDED NODE OF AN OBJECT GROUP
    let sourceID_2 = d3Json_2.nodes.length;
    
    // Search Object for Keys (Level-1)
    for (let i = 0; i < x[0].length; i++) {
      // OBJECT[KEY]
      let o_1 = object[x[0][i]];

      // IF OBJECT NOT AN ARRAY
      if (!Array.isArray(o_1)){

        // IF OBJECT != UNDEFINED
        if (o_1 != undefined) {

  
          // Search Object for Keys (Level-2)
          for (let j = 0; j < x[1][i].length; j++) {
            // OBJECT[KEY][KEY]
            const o_2 = o_1[x[1][i][j]];           
            if (o_2 != undefined) {
              
              // Search Object for Keys (Level-3)
              for (let k = 0; k < x[2][i][j].length; k++) {  
                // OBJECT[KEY][KEY][KEY]              
                let o_3 = o_2[x[2][i][j][k]];  
                if (o_3 != undefined) {

                  // IF OBJECT-VALUE === STRING
                  // PUSH NODE -- LEVEL-3
                  if(typeof o_3 === 'string'){

                    // ADD NODE:
                    let node = {};
                    node["type"] = x[0][i];
                    node["label"] = o_3;
                    node["id"] = node_id_global;
                    node["color"] = 3;
                    // Add Node
                    d3Json_2.nodes.push(node);
                    // Add Link
                    addLink(node, sourceID_2, d3Json_2, node["type"]);
                    node_id_global++;
                  }
                }
              }

              // IF OBJECT-VALUE === STRING
              // PUSH NODE -- LEVEL-2
              if(typeof o_2 === 'string'){

                // ADD NODE:
                let node = {};
                node["type"] = x[0][i];
                node["label"] = object[x[0][i]][x[1][i][j]];
                node["id"] = node_id_global;
                node["color"] = 2;
                // Add Node
                d3Json_2.nodes.push(node);
                // Add Link
                addLink(node, sourceID_2, d3Json_2, node["type"]);
                node_id_global++;

                // CHECK "RDF:DESCRIPTION" (= node["label"]) WITH GLOBAL_DATA_TABLE
                // --------------------------------------------------------------
                // --------------------------------------------------------------
                let dataTable = require('../../../assets/dataTable.json');
                
                // go through all global-Objects
                for(let o=0; o< dataTable["objects"].length; o++){
                  
                  // Global-Object has "rdf:about"
                  if (dataTable["objects"][o]["rdf:about"] != undefined){

                    // When local and global Element have got the same "rdf:about"
                    if (node["label"] == dataTable["objects"][o]["rdf:about"]){
                      
                      // ADD NOTE WITH GLOBAL_IDENTIFIER
                      let node = {};
                      node["type"] = "globalIdentifier";
                      node["label"] = dataTable["objects"][o]["name"];
                      node["id"] = node_id_global;
                      node["color"] = 10;
                      // Add Node
                      d3Json_2.nodes.push(node);
                      // Add Link
                      addLink(node, sourceID_2, d3Json_2, node["type"]);
                      node_id_global++;
                    }
                  }
                }
                // --------------------------------------------------------------
                // --------------------------------------------------------------
              }
            }      
          }

          // IF OBJECT-VALUE === STRING
          // PUSH NODE -- LEVEL-1
          if(typeof o_1 === 'string'){
          

            // ADD NODE
            let node = {};
            node["type"] = x[0][i];
            node["label"] = o_1;
            node["id"] = node_id_global;
            node["color"] = 1;
            // Add Node
            d3Json_2.nodes.push(node);
            // Add Link
            addLink(node, sourceID_2, d3Json_2, node["type"]);
            node_id_global++;
          }
  
  
        }      
      }
      // IF OBJECT IS AN ARRAY
      else {

        // Loop through Array Objects
        for (let v = 0; v < o_1.length; v++){
          // OBJECT IN ARRAY
          const o_1_1 = o_1[v];
          
          // Search Object for Keys (Level-2)
          for (let j = 0; j < x[1][i].length; j++) {
            // OBJECT[KEY][KEY]
            const o_2 = o_1_1[x[1][i][j]];           
            if (o_2 != undefined) {
              
              // Search Object for Keys (Level-3)
              for (let k = 0; k < x[2][i][j].length; k++) {  
                // OBJECT[KEY][KEY][KEY]              
                let o_3 = o_2[x[2][i][j][k]];  
                if (o_3 != undefined) {

                  // IF OBJECT-VALUE === STRING
                  // PUSH NODE -- LEVEL-3
                  if(typeof o_3 === 'string'){

                    // ADD NODE:
                    let node = {};
                    node["type"] = x[0][i];
                    node["label"] = o_3;
                    node["id"] = node_id_global;
                    node["color"] = 3;
                    // Add Node
                    d3Json_2.nodes.push(node);
                    // Add Link
                    addLink(node, sourceID_2, d3Json_2, node["type"]);
                    node_id_global++;
                  }
                }
              }

              // IF OBJECT-VALUE === STRING
              // PUSH NODE -- LEVEL-3
              if(typeof o_2 === 'string'){

                // ADD NODE:
                let node = {};
                node["type"] = x[0][i];
                node["label"] = o_2;
                node["id"] = node_id_global;
                node["color"] = 2;
                // Add Node
                d3Json_2.nodes.push(node);
                // Add Link
                addLink(node, sourceID_2, d3Json_2, x[0][i]);
                node_id_global++;
              }              
            }
          }
        }
      }
    }
  });
  return d3Json_2;
}

// --------------------------------------------------------------------------------------------
function addLink(node, sourceID, d3Json, key) {

  let typeID = key;

  if (typeID != "$") {

    let targetID;
    targetID = node["id"];
    const link = {};
    link["source"] = sourceID;
    link["target"] = targetID;
    link["type"] = typeID;
    d3Json.links.push(link);
  }
}