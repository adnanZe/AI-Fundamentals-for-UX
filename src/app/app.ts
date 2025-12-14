import { Component } from '@angular/core';
import { WrongExampleComponent } from './components/wrong-example/wrong-example';
import { RightExampleComponent } from './components/right-example/right-example';

@Component({
  selector: 'app-root',
  imports: [WrongExampleComponent, RightExampleComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
