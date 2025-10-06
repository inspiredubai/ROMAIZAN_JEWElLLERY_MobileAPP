import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { LoginService } from '../services/login.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { NativeBiometric } from 'capacitor-native-biometric';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
 
})
export class LoginComponent implements OnInit {
  loginForm: any;
  isLoading = false;
   status: string = '';
  constructor(private router: Router, private toastController: ToastController, private navCtrl: NavController,   
    private apiLogin: LoginService,
    private fb: UntypedFormBuilder,
    private toastService: ToastService
  )
     { }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      Username: [null, [Validators.required]],
      Password: [null, [Validators.required]],
      companyId: [-1, [Validators.required]],
      Rememberme: [false, [Validators.required]],
    });
  }
  goToChangePassword() {
    this.router.navigate(['/login/passwordchange']);
  }
  onLogin(){
    this.isLoading = true;
    this.apiLogin.loginRequest(this.loginForm.value).subscribe((k: any) => {
      this.isLoading = false;
        if (k.valid) {
          this.router.navigate(['/home']);
          this.toastService.presentToast(k.message);

        }else{
          this.toastService.presentToastErrror(k.message);
        }
      });
  }
    async authenticateWithBiometric() {
    try {
      await NativeBiometric.verifyIdentity({
        reason: 'For quick and secure login',
        title: 'Biometric Authentication',
      });

      // If it doesn’t throw → authentication was successful
      this.status = '✅ Authenticated successfully!';
    } catch (err) {
      this.status = '❌ Authentication failed: ' + err;
    }
  }
  registeruseromponent(){
    // debugger
     this.router.navigate(['/login/registeruser']);
  }
}
