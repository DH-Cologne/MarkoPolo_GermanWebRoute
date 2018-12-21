import { Component, OnInit } from '@angular/core';


// import { DataService } from "./services/data/data.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

// export class AppComponent implements OnInit {
export class AppComponent{

  pdfSrc: string = '../assets/MarkoPolo/252/cgm252.pdf';

  constructor() {
  }

}

