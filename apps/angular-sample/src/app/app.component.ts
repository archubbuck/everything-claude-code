import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Root shell for the sample app; CommonModule enables structural directives like *ngFor.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  readonly title = 'Angular Sample (apps/)';
  readonly steps = [
    'Run `npm install` inside apps/angular-sample',
    'Start the dev server with `npm run start`',
    'Edit this component to start building your app'
  ];
}
