import { Component, signal } from '@angular/core';
import { WrongExampleComponent } from './components/wrong-example/wrong-example';
import { RightExampleComponent } from './components/right-example/right-example';
import { RecruitmentWrongComponent } from './components/recruitment-wrong/recruitment-wrong';
import { RecruitmentRightComponent } from './components/recruitment-right/recruitment-right';
import { SupportWrongComponent } from './components/support-wrong/support-wrong';
import { SupportRightComponent } from './components/support-right/support-right';

@Component({
  selector: 'app-root',
  imports: [
    WrongExampleComponent,
    RightExampleComponent,
    RecruitmentWrongComponent,
    RecruitmentRightComponent,
    SupportWrongComponent,
    SupportRightComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly selectedExample = signal<'mindset' | 'recruitment' | 'support'>('mindset');

  protected selectExample(example: 'mindset' | 'recruitment' | 'support'): void {
    this.selectedExample.set(example);
  }
}
