import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LoginService } from 'src/app/services/login.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
  standalone: false,
})
export class RegisterUserComponent implements OnInit {
  registerForm: any;
  photo: any;
  status: string = '';
  isLoading = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private apiLogin: LoginService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      Username: [null, [Validators.required]],
      Password: [null, [Validators.required]],
    });
  }

  // 📸 Capture face photo
  async loadPhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      // ✅ Remove the base64 prefix safely
      this.photo = image.dataUrl
        ? image.dataUrl.replace(/^data:image\/[a-z]+;base64,/, '')
        : null;

      this.status = 'Photo captured!';
      console.log('pic', this.photo);

      console.log('Photo captured successfully!');
    } catch (err) {
      console.error('Error loading photo:', err);
      this.status = 'Error loading photo';
      this.toastService.presentToastErrror('Failed to capture photo.');
    }
  }

  // 🚀 Submit user data + face photo to server
  submit() {
    if (!this.photo) {
      this.toastService.presentToastErrror('Please capture your face first!');
      return;
    }

    if (this.registerForm.invalid) {
      this.toastService.presentToastErrror(
        'Please fill in all required fields!'
      );
      return;
    }

    const formData = {
      Username: this.registerForm.value.Username,
      Passwd: this.registerForm.value.Password,
      FaceImage: this.photo, // base64 image string without prefix
    };

    console.log('Submitting data:', formData);
    this.isLoading = true;
    this.apiLogin.LoginUpdateWithImg(formData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.success) {
          this.toastService.presentToast(response.message);
          this.router.navigate(['/home']);
        } else {
          this.toastService.presentToastErrror(response.message);
        }
      },
      error: (error) => {
        console.error('Error while submitting:', error);
        this.toastService.presentToastErrror('Server error. Please try again.');
      },
    });
  }
}
