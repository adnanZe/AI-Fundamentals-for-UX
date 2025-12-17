import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'ai-form-completion',
    loadChildren: () =>
      import('./features/ai-form-completion/ai-form-completion.routes').then(
        (m) => m.AI_FORM_COMPLETION_ROUTES
      ),
  },
  {
    path: 'ai-loading-states',
    loadChildren: () =>
      import('./features/ai-loading-states/ai-loading-states.routes').then(
        (m) => m.AI_LOADING_STATES_ROUTES
      ),
  },
];
