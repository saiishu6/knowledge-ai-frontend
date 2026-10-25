
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatResponse {
  answer: string;
  sources: string[];
}

@Injectable({
  providedIn: 'root'
})
export class Chat {
  private readonly http = inject(HttpClient);

  // Angular proxy forwards /api to the Spring Boot backend
  private readonly apiUrl = '/api/chat';

  askQuestion(message: string): Observable<ChatResponse> {
    const params = new HttpParams().set('message', message);

    return this.http.get<ChatResponse>(this.apiUrl, { params });
  }
}
