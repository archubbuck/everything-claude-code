import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
