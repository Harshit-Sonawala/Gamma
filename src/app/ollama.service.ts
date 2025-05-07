import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OllamaService {
  constructor(private http: HttpClient) {}

  generateResponse(
    prompt: string,
    model: string = 'gemma3:1b'
  ): Observable<any> {
    const body = {
      model: model,
      prompt: prompt,
      stream: false,
    };
    return this.http.post(`/api/generate`, body);
  }
}
