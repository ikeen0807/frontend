import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SchoolClassListComponent } from './school-class-list/school-class-list.component';
import { StudentListComponent } from './student-list/student-list.component';

export const routes: Routes = [
  {
    path:'', component: LoginComponent,
  },
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'classList', component: SchoolClassListComponent
  },
  {
    path: 'studentList', component: StudentListComponent
  }
];
