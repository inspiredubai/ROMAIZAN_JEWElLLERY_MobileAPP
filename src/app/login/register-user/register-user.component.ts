import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
    standalone: false,

})
export class RegisterUserComponent  implements OnInit {
 email: string = '';
  password: string = '';
  faceFound: boolean = false;
registerForm: any;
  photo: string | null = null;
  status: any;
  constructor(private router: Router, private fb: FormBuilder,
 
  )
     { }
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      Username: [null, [Validators.required]],
      Password: [null, [Validators.required]],

    });
  }

  captureFace() {
    // TODO: Replace with actual face detection logic
    this.faceFound = Math.random() > 0.5;
  }

  login() {
    if (this.faceFound) {
      console.log('Logging in with:', this.email, this.password);
    } else {
      console.log('Face not found');
    }
  }
   async loadPhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera  // can use CameraSource.Photos too
      });

      this.photo = image.dataUrl ?? null;
      console.log('Photo captured!');
      this.status= 'Photo captured!';
    } catch (err) {
      console.error('Error loading photo:', err);
            this.status= 'Error loading photo';

    }
  }

}

 
