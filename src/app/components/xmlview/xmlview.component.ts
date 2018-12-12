import {Component, OnInit} from '@angular/core';
import {DataService} from "../../services/data/data.service";

@Component({
  selector: 'app-xmlview',
  templateUrl: './xmlview.component.html',
  styleUrls: ['./xmlview.component.css']
})
export class XmlviewComponent implements OnInit {

  public markup: string;

  constructor(public dataService: DataService) {
  }

  ngOnInit() {

    this.dataService.dataUpdated.subscribe(
      (lang) => {
        this.markup = this.dataService.getTextFileContent();
      }
    );

  }
}
