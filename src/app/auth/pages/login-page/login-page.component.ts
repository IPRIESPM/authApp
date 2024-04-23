import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  myForm:FormGroup = this.fb.group({
    email: ['isaac@isaac.com', [Validators.required, Validators.email]],
    password: ['123456789', [Validators.required, Validators.minLength(6)]]
  });


  login() {
    const { email, password } = this.myForm.value;

    this.authService.login( email, password)
    .subscribe({
      next:() => this.router.navigateByUrl("/dashboard"),
      error: (err) => {
        Swal.fire('Error', err, 'error');
      }
    });
  }
}
