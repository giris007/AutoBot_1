import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tutorials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutorials.component.html',
  styleUrl: './tutorials.component.css'
})
export class TutorialsComponent {
  // Tutorial data could be expanded or fetched from a service
  tutorials = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of using our platform',
      url: '/tutorial/getting-started'
    },
    {
      title: 'Advanced Features',
      description: 'Explore advanced capabilities and configurations',
      url: '/tutorial/advanced'
    },
    {
      title: 'Best Practices',
      description: 'Tips and tricks for optimal usage',
      url: '/tutorial/best-practices'
    }
  ];
}