import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DataTableService {

  // public completeDataTableObject: Promise<any>;
  public dataTable: Array<any>;
  

  constructor() {

  }
  

  addDataTableObject(){      

  // Push DataTable-Object in Data_Table
            //                              GLOBAL-IDENTIFIER-TABLE
            //     ----------------------------------------------------------------------------------
            //     |   ID             ||  Name             || rdf:about         ||  s_id            |
            //     -------------------||-------------------||-------------------||-------------------
            //     |    0             ||  Jewellery        || http://pro..0     ||  s_id_0          |
            //     |    1             ||  Ancient-Iran     || http://pro..1     ||  s_id_1          |
            //     |    2             ||  Cale-Gar-Caves   || http://pro..2     ||  s_id_2          |
            //     |    3             ||  Sasanian-Period  || http://pro..3     ||  s_id_3          |
            //     |    4             ||  Organic-Material || http://pro..4     ||  s_id_4          |
  
    // ADD DATATABLE-OBJECT

  }

}