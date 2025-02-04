import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // // getAllUsers(): Observable<any[]> {
  // //   return this.http.get<any[]>(`$(this.apiUrl)/users/findAll`);
  // // }

  // getRecipesOnHold(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/recipes/on-hold`);
  // }
}
