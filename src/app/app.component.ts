import { Component, OnInit } from '@angular/core';

// import { DataService } from "./services/data/data.service";
import { JsonToD3Service } from "./services/jsonToD3/json-to-d3.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

// export class AppComponent implements OnInit {
export class AppComponent{


  constructor(private jsonToD3Service: JsonToD3Service) {
  }

  // ngOnInit() {

  //   this.jsonToD3Service.myD3PromiseObject.then(function(value) {

  //     console.log(value);
  //   });
  // }
}

