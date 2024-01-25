import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { RessourceService } from '../services/ressource.service';
import { MaterialModule } from '../material/material.module';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
@ViewChild('inputUser') inputUser?: ElementRef;
@ViewChild('submitLogin') submitLogin?: MatButton;

public loginForm: FormGroup;
public isLoggedIn: boolean = false;
public wrongUser: boolean;
public hidePassword = true;

constructor(
  private service: AuthService,
  private ressource: RessourceService ,
  private storage: StorageService,
   private router:Router
   ) {
  this.createForm();
  this.loginForm = new FormGroup(
    {
      username: new FormControl('', { validators: [Validators.required]}),
      password: new FormControl('', { validators: [Validators.required]})
    },
    {}
  );
  this.isLoggedIn = false;
  this.wrongUser = false;
}

get username(): string {
  return this.loginForm.get('username')!.value;
}

get password(): string {
  return this.loginForm.get('password')!.value;
}





ngOnInit(): void {
  if(this.storage.getSessionEntry('isLoggedIn') === true) {
    this.router.navigate(['home']);
  } else {
    this.router.navigate([''])
    setTimeout(() => this.inputUser!.nativeElement.focus());
  }
}

public logo(filename: string): string {
  return this.ressource.logo(filename);
}

public login(): void {
  this.service.login(this.loginForm.value).subscribe((data) => {
    if(data) {
      let user = { fullName: data.vorname + ' ' + data.nachname }
      this.isLoggedIn = true;
      this.storage.setSessionEntry('school_id', data.school_id);
      this.storage.setSessionEntry('teacher_id', data.ID);
      this.storage.setSessionEntry('isLoggedIn', this.isLoggedIn);
      this.storage.setSessionEntry('user', user)
      this.router.navigate(['home']);
      this.storage.setSessionEntry('is_admin', data.is_admin);
    } else {
      console.log(this.isLoggedIn);
      this.storage.setSessionEntry('isLoggedIn', false);
      this.wrongUser = true;
    }
  });
}

public userValid(): boolean {
  return this.loginForm.controls['username'].valid;
}

public passwordValid(): boolean {
  return this.loginForm.controls['password'].valid;
}


private createForm(): void {
  this.loginForm = new FormGroup(
    {
      username: new FormControl('', { validators: [Validators.required]}),
      password: new FormControl('', { validators: [Validators.required]})
    },
    {}
  );
}
}
