import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolClassListComponent } from './school-class-list.component';

describe('SchoolClassListComponent', () => {
  let component: SchoolClassListComponent;
  let fixture: ComponentFixture<SchoolClassListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolClassListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchoolClassListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
