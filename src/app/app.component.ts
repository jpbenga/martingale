import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MartingaleComponent } from './martingale/martingale.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MartingaleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'martingale-roulette';
}
