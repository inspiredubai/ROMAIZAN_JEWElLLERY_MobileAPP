import { Component, OnInit } from '@angular/core';
import { NativeBiometric, BiometryType } from 'capacitor-native-biometric';
 
@Component({
  selector: 'app-facid',
  templateUrl: './facid.component.html',
  styleUrls: ['./facid.component.scss'],  
  standalone: false,

})
export class FacidComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  async checkBiometric() {
    const result = await NativeBiometric.isAvailable();

    if (!result.isAvailable) {
      console.log("❌ Biometric authentication not available");
      return;
    }

    if (result.biometryType === BiometryType.FACE_ID) {
      console.log("✅ Face ID is available");
    } else {
      console.log("Available biometrics:", result.biometryType);
    }
  }

  async authenticateWithFaceID() {
    try {
      await NativeBiometric.verifyIdentity({
        reason: "Log in with Face ID",
        title: "Face ID Authentication",
        subtitle: "Secure Login",
        description: "Use Face ID to quickly log in",
      });

      console.log("🎉 Authenticated with Face ID!");
    } catch (error) {
      console.log("❌ Face ID failed:", error);
    }
  }
}
