import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { ExpenseComponent } from './expense/expense.component';
import { AboutComponent } from './about/about.component';

// Route Configuration
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashBoardComponent },
  { path: 'expense', component: ExpenseComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: 'home' }
];

export const routing: ModuleWithProviders<any> = RouterModule.forRoot(routes);