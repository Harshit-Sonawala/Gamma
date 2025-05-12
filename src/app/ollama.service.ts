import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OllamaService {
  // constructor(private http: HttpClient) {}

  // generateResponse(
  //   prompt: string,
  //   model: string = 'gemma3:1b'
  // ): Observable<any> {
  //   const body = {
  //     model: model,
  //     prompt: prompt,
  //     stream: false,
  //   };
  //   return this.http.post(`/api/generate`, body);
  // }

  streamResponse(
    prompt: string,
    model: string = 'gemma3:1b'
  ): Observable<string> {
    return new Observable((observer) => {
      fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: model, prompt: prompt, stream: true }),
      })
        .then(async (response) => {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) {
            observer.error('No reader');
            return;
          }

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });

            const lines = chunk.split('\n').filter((line) => line.trim());
            for (const line of lines) {
              const data = JSON.parse(line);
              if (data.done) {
                observer.complete();
                return;
              }
              observer.next(data.response || '');
            }
          }
        })
        .catch((err) => observer.error(err));
    });
  }
}
