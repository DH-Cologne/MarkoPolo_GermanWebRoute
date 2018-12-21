import{ Component, ViewEncapsulation } from '@angular/core';

import { DataTableService } from "../../services/dataTable/data-table.service";
import { D3SimulationService } from "../../services/d3Simulation/d3-simulation.service";

@Component({
  selector: 'app-graphview',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './graphview.component.html',
  styleUrls: ['./graphview.component.css']
})
export class GraphviewComponent {

  constructor(private d3SimulationService: D3SimulationService, private completeDataTableService: DataTableService) {
  }
  
  ngOnInit() {
    
    // D3-Simulation 
    // -------------
    this.d3SimulationService.prepareSimulation();

  } 

}