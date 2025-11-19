import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface SearchData {
  product: string;
  quantity: number;
  unit: string;
  clientDate: string;
}

export interface SearchResult {
  product: string;
  store: string;
  price: number;
  unitPrice: number | null;
  currency: "COP";
  url: string | null;
  date: string;
  confidence: number;
  isOffer?: boolean;
}

@Injectable({
  providedIn: 'root'

})

export class SearchService {
  private apiUrl = 'http://192.168.4.217:3000/api/search';

  constructor(private http: HttpClient) {
  }

  //Llama al endpoint POST /api/search del backend
  // El interceptor se encargará de añadir el token.
  search(data: SearchData): Observable<{ results: SearchResult[] }> {
    return this.http.post<{ results: SearchResult[] }>(this.apiUrl, data);
  }
}
