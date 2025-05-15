import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export interface ChatResponse {
  message: ChatMessage;
}

@Injectable({
  providedIn: 'root'
})
export class BedrockService {
  private apiUrl = `${environment.apiUrl}/chat`;

  constructor(private http: HttpClient) { }

  sendMessage(messages: ChatMessage[]): Observable<ChatResponse> {
    const request: ChatRequest = { messages };
    return this.http.post<ChatResponse>(this.apiUrl, request);
  }
}