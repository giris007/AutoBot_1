import { Routes } from '@angular/router';
import { TutorialsComponent } from './tutorials/tutorials.component';
import { ChatbotComponent } from './chatbot/chatbot.component';

export const routes: Routes = [
  { path: '', redirectTo: 'chatbot', pathMatch: 'full' },
  { path: 'tutorials', component: TutorialsComponent },
  { path: 'chatbot', component: ChatbotComponent }
];