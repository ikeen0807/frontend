import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private router: Router) {}
  redirectToClassList() {
    this.router.navigate(['/classList']);
  }

  redirectToStudentList() {
    this.router.navigate(['/studentList']);
  }
  redirectToExamList() {
    this.router.navigate(['/exams']);
  }
  redirectToScoreList() {
    this.router.navigate(['/scores']);
  }
}
