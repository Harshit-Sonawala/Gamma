import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OllamaService } from './ollama.service';
import { RouterOutlet } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, RouterOutlet, MarkdownModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ConverseAI';

  messages: Message[] = [];
  userInput: string = '';
  isLoading: boolean = false;

  constructor(private ollamaService: OllamaService) {}

  sendMessage(): void {
    const currentInput = this.userInput.trim();

    if (!currentInput) return; // if empty do nothing

    const userMessage: Message = { sender: 'user', text: currentInput };
    this.messages.push(userMessage);
    this.isLoading = true; // start loading
    this.userInput = ''; // Clear user input

    // this.ollamaService.generateResponse(currentInput, 'gemma3:1b').subscribe({
    //   next: (response) => {
    //     console.log('AI Response:', response);
    //     console.log('Markdown Content:', response.response);

    //     const aiMessage: Message = { sender: 'ai', text: response.response };
    //     this.messages.push(aiMessage);
    //     this.isLoading = false; // stop loading
    //   },
    //   error: (err) => {
    //     console.error('Error generating response: ', err);
    //     const errorMessage: Message = {
    //       sender: 'ai',
    //       text: 'Error generating response. Please try again.',
    //     };
    //     this.messages.push(errorMessage);
    //     this.isLoading = false; // stop loading
    //   },
    // });

    let aiMessage: Message = { sender: 'ai', text: '' };
    this.messages.push(aiMessage);
    this.ollamaService.streamResponse(currentInput).subscribe({
      next: (chunk) => {
        aiMessage.text += chunk;
      },
      complete: () => {
        this.isLoading = false;
        console.log('Response: ', aiMessage.text);
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }
}
