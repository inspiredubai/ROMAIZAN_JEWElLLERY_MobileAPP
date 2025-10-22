import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { LoginService } from '../services/login.service';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { NativeBiometric } from 'capacitor-native-biometric';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
  imageBase64: string | null = null;
  isLoad = false;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private navCtrl: NavController,
    private apiLogin: LoginService,
    private fb: UntypedFormBuilder,
    private toastService: ToastService
  ) {}
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
  onLogin() {
    this.isLoading = true;
    this.apiLogin.loginRequest(this.loginForm.value).subscribe((k: any) => {
      this.isLoading = false;
      if (k.valid) {
        this.router.navigate(['/home']);
        this.toastService.presentToast(k.message);
      } else {
        this.toastService.presentToastErrror(k.message);
      }
    });
  }
  //   async authenticateWithBiometric() {
  //   try {
  //     await NativeBiometric.verifyIdentity({
  //       reason: 'For quick and secure login',
  //       title: 'Biometric Authentication',
  //     });

  //     // If it doesn’t throw → authentication was successful
  //     this.status = '✅ Authenticated successfully!';
  //   } catch (err) {
  //     this.status = '❌ Authentication failed: ' + err;
  //   }
  // }
  authenticateWithBiometric() {
    // debugger
    this.router.navigate(['/login/registeruser']);
  }
  async loadPhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
      this.imageBase64 = image.dataUrl
        ? image.dataUrl.replace(/^data:image\/[a-z]+;base64,/, '')
        : null;
      this.status = 'Photo captured!';
      console.log('Photo captured successfully!');
      this.isLoad = true;

      this.apiLogin
        .loginRequestWithFaceImg({ imageBase64: this.imageBase64 })
        .subscribe((k: any) => {
          this.isLoad = false;
          if (k.success) {
            this.router.navigate(['/home']);
            this.toastService.presentToast(k.message);
          } else {
            this.toastService.presentToastErrror(k.message);
          }
        });
    } catch (err) {
      console.error('Error loading photo:', err);
      this.status = 'Error loading photo';
      this.toastService.presentToastErrror('Failed to capture photo.');
    }
  }
  registeruseromponent() {
    // debugger
    this.router.navigate(['/login/registeruser']);
  }
}
