import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url =  environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  signup(data:any){
    return this.httpClient.post(this.url+
      "/user/signup", data, {
        headers: new HttpHeaders().set("Content-Type", "application/json")
      })

  }
}

