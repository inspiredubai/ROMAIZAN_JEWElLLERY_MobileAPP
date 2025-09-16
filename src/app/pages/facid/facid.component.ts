import { Component, OnInit } from '@angular/core';
// import { NativeBiometric, BiometryType } from 'capacitor-native-biometric';
  // import { registerPlugin } from '@capacitor/core';
import { NativeBiometric } from 'capacitor-native-biometric';

// const BiometricAuth = registerPlugin('BiometricAuth') as any;
 
@Component({
  selector: 'app-facid',
  templateUrl: './facid.component.html',
  styleUrls: ['./facid.component.scss'],  
  standalone: false,

})
export class FacidComponent  implements OnInit {
  // status: anyl;

  constructor() { }

  ngOnInit() {}
   status: string = '';
 
  // async checkBiometric() {
  //   try {
  //     const result = await NativeBiometric.isAvailable();

  //     if (!result.isAvailable) {
  //       this.status = '❌ Biometrics not available';
  //       return;
  //     }

  //     this.status = `✅ Biometrics available: ${result.biometryType}`;
  //   } catch (err) {
  //     this.status = '❌ Error checking biometrics: ' + err;
  //   }
  // }

  // 🔹 renamed to match your HTML button
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
//   async checkBiometric() {
//     const result = await NativeBiometric.isAvailable();

//     if (!result.isAvailable) {
//       console.log("❌ Biometric authentication not available");
//       return;
//     }

//     switch (result.biometryType) {
//       case BiometryType.FACE_ID:
//         console.log("✅ iOS Face ID available");
//         break;
//       case BiometryType.FINGERPRINT:
//         console.log("✅ Fingerprint available (Android/iOS)");
//         break;
//       case BiometryType.FACE_AUTHENTICATION:
//         console.log("✅ Android Face Authentication available");
//         break;
//       default:
//         console.log("ℹ️ Other biometric:", result.biometryType);
//     }
//   }

//   async authenticateWithBiometric() {
//     try {
//       await NativeBiometric.verifyIdentity({
//         reason: "Log in securely",
//         title: "Biometric Authentication",
//         subtitle: "Secure Login",
//         description: "Use biometrics to log in",
//       });

//       console.log("🎉 Authenticated with biometrics!");
// this.status ="Authenticated with biometrics"
//     } catch (error) {
//       console.log("❌ Authentication failed:", error);
//       this.status =" Authentication failed"

//     }
//   }

}

