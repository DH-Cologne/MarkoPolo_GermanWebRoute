import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Parser} from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  dataUpdated = new EventEmitter();

  public textFile: string;

  constructor(private http: HttpClient) {
  }

  public getTextFileContent(): string {
    return this.textFile;
  }

  public loadTextFile(url: string): Promise<any> {

    return new Promise<string>((resolve, reject) => {

      this.http.get(url, {responseType: 'text'}).subscribe(data => {

        this.textFile = data;
        this.dataUpdated.emit(data);
        resolve(data);
      }, error => {
        
        reject(error);
      });
    });
  }

  public xmlToJSON(xmlUrl: string): Promise<any> {

    return new Promise<any>((resolve, reject) => {

      this.loadTextFile(xmlUrl).then(function (data) {

        let parser = new Parser({explicitArray: false});

        parser.parseString(data, function (err, result) {

          if (err) {
            console.log(err);
            reject(err);
          }

          resolve(result);
        });
      }, function (error) {
        reject(error);
      });
    });
  }
}
