import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../services/bedrock.service';
import { ChatbotAIService } from '../services/chatbot-ai.service';
import { DealerService } from '../services/dealer.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent implements OnInit {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private chatbotAIService: ChatbotAIService,
    private dealerService: DealerService
  ) {}

  ngOnInit(): void {
    // Initialize with a welcome message
    this.messages.push({
      role: 'assistant',
      content: 'Hello! I can help you with information about automotive dealers and OEMs. Try asking about specific OEMs, dealers, regions, or contract statuses.'
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: this.newMessage
    };
    this.messages.push(userMessage);
    this.isLoading = true;

    // Clear input field
    const userInput = this.newMessage;
    this.newMessage = '';

    // Process the query
    this.chatbotAIService.processQuery(userInput).subscribe({
      next: (response) => {
        this.messages.push(response);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error processing query:', error);
        this.messages.push({
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again later.'
        });
        this.isLoading = false;
      }
    });
  }
}