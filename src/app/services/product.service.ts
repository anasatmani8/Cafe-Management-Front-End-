import { Product } from './../shared/product';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) {}

  add(data: any) {
    return this.httpClient.post(this.url + '/product/add', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  update(data: any) {
    return this.httpClient.post(this.url + '/product/update', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  getProducts():Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.url + '/product/get');
  }

  getProductIds(): Observable<number[] | any> {
    return this.getProducts().pipe(map(dishes => dishes.map(dish => dish.id)))
      .pipe(catchError(error => error));
  }

  getProductByCategory(id: any) {
    return this.httpClient.get(this.url + '/product/getByCategory/' + id);
  }

  getProductById(id: any) {
    return this.httpClient.get(this.url + '/product/getById/' + id);
  }

  updateStatus(data: any) {
    return this.httpClient.post(this.url + '/product/updateStatus', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  delete(id: any) {
    console.log('start deleting' + id + '=>id');
    return this.httpClient.get(this.url + '/product/delete/' + id);
  }
}
