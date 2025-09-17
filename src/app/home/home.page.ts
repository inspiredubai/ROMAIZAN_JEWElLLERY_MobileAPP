
// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { NavController, ToastController } from '@ionic/angular';
// import { UntypedFormBuilder, Validators } from '@angular/forms';
// import { DataService } from '../services/data.service';
// import { ToastService } from '../services/toast.service';
// import { Geolocation } from '@capacitor/geolocation';
// import { Capacitor } from '@capacitor/core';
// import { LocalNotifications } from '@capacitor/local-notifications';
// @Component({
//   selector: 'app-home',
//   templateUrl: 'home.page.html',
//   styleUrls: ['home.page.scss'],
//   standalone: false,
// })
// export class HomePage {
//   center!: google.maps.LatLngLiteral;
//   markerPosition!: google.maps.LatLngLiteral;
//   popoverOpen = false;
//   popoverEvent: any = null;
//   attendanceFromGroup: any;
//   userDetails: any;
//   receivedData: any;
//   isCheckedIn: boolean = false;
//  geofenceStatus: string = 'Unknown';
//   watching: boolean = false;
//   intervalId: any = null;
//   lastStatus: 'inside' | 'outside' | null = null;
//     geofence = {
//     lat: 32.868968,    
//     lng: 74.244743,    
//   //   lat: 30.51,

//   //  lng: 72.47,
//     radius: 200,   
//   };
//   isInside:any
//   constructor(
//     private router: Router,
//     private navCtrl: NavController,
//     private fb: UntypedFormBuilder,
//     private dataservice: DataService,
//     private toastService: ToastService
//   ) { }

//   async ngOnInit() {
//     this.userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
//     this.attendanceFromGroup = this.fb.group({
//       AttendanceID: [0, [Validators.required]],
//       AttendanceEmpID: [this.userDetails.userId],
//       ProjectID: [-1, [Validators.required]],
//       PunchDate: [new Date().toISOString().split('T')[0], [Validators.required]],
//       CheckOut: [null, [Validators.required]],
//       Latitude: [null, [Validators.required]],
//       Longitude: [null, [Validators.required]],
//       LocationName: [''],
//       ImageFile: [null],
//       Remarks: [null],
//       PunchMode: [false],
//       PunchTime: [null],
//       Active: [false],
//     });
// this.startGeofencing()
//     await this.requestLocationPermission(); // ✅ Request permission first

//     this.dataservice.data$.subscribe(data => {
//       this.receivedData = data;
//     });

//     if (this.receivedData == null) {
//       this.getCurrentLocation();
//     } else {
//       this.attendanceFromGroup.get('Latitude')?.setValue(this.receivedData.lat.toString());
//       this.attendanceFromGroup.get('Longitude')?.setValue(this.receivedData.lng.toString());
//     }
//   }

//   goToChangePassword() {
//     this.router.navigate(['/login/passwordchange']); // Adjust the route path accordingly
//   }

//   async requestLocationPermission() {
//     try {
//       const permission = await Geolocation.requestPermissions();
//       console.log('Permission status:', permission);
//     } catch (error) {
//       console.error('Permission request error:', error);
//     }
//   }

//   async getCurrentLocation() {
//     try {
//       const coordinates = await Geolocation.getCurrentPosition({
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0
//       });

//       const latitude = coordinates.coords.latitude;
//       const longitude = coordinates.coords.longitude;

//       console.log('Latitude:', latitude);
//       console.log('Longitude:', longitude);

//       this.attendanceFromGroup.get('Latitude')?.setValue(latitude.toString());
//       this.attendanceFromGroup.get('Longitude')?.setValue(longitude.toString());

//       this.center = { lat: latitude, lng: longitude };
//       this.markerPosition = { ...this.center };

//       this.saveLocation(latitude, longitude);
//     } catch (error) {
//       console.error('Error getting location:', JSON.stringify(error));
//       this.setDefaultLocation();
//     }
//   }

//   updateMarkerPosition(event: google.maps.MapMouseEvent) {
//     if (event.latLng) {
//       const newLat = event.latLng.lat();
//       const newLng = event.latLng.lng();

//       this.markerPosition = {
//         lat: newLat,
//         lng: newLng,
//       };

//       this.attendanceFromGroup.get('Latitude')?.setValue(newLat.toString());
//       this.attendanceFromGroup.get('Longitude')?.setValue(newLng.toString());

//       this.dataservice.sendData(this.markerPosition);

//       console.log('Updated Marker Position:', this.markerPosition);
//     }
//   }

//   setDefaultLocation() {
//     console.warn('Using default location');
//     this.center = { lat: 31.4933248, lng: 74.3079936 };
//     this.markerPosition = { ...this.center };

//     this.attendanceFromGroup.get('Latitude')?.setValue(this.center.lat.toString());
//     this.attendanceFromGroup.get('Longitude')?.setValue(this.center.lng.toString());
//   }

//   getCurrentTime() {
//     const currentTime = new Date();
//     const formattedTime = currentTime.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: false
//     });
//     this.attendanceFromGroup.get('PunchTime')?.setValue(formattedTime);
//   }

//   onCheckIn() {
//     this.getCurrentTime();
//     debugger
//     console.log('Check-In Data:', this.attendanceFromGroup.value);
// if(this.isInside){
//     this.dataservice.attendancedatalistpost(this.attendanceFromGroup.value).subscribe((res) => {
//       if (res) {
//         this.isCheckedIn = true;
//         this.toastService.presentToast('Check-In successfully');
//       } else {
//         this.toastService.presentToastErrror('Something went wrong');
//       }
//     });
//   }else{
//           this.toastService.presentToastErrror('You are outside the office area. Check-in is not allowed.');
//   }
//   }

//   onCheckOut() {
//     this.getCurrentTime();
//     this.attendanceFromGroup.controls.PunchMode.setValue(true);
//     console.log('Check-Out Data:', this.attendanceFromGroup.value);

//     this.dataservice.attendancedatalistpost(this.attendanceFromGroup.value).subscribe((res) => {
//       if (res) {
//         this.isCheckedIn = false;
//         this.toastService.presentToast('Check-Out successfully');
//       } else {
//         this.toastService.presentToastErrror('Something went wrong');
//       }
//     });
//   }

//   onsmartpunch() {
//     this.router.navigate(['/smartpunch']);
//   }

//   onattendancesummary() {
//     this.router.navigate(['/attendancesummary']);
//   }

//   onleaveEntry() {
//     this.router.navigate(['/leaveentry']);
//   }

//   saveLocation(lat: number, lng: number) {
//     const locationData = {
//       userId: this.userDetails?.userId || 0,
//       latitude: lat,
//       longitude: lng,
//       date: new Date().toISOString()
//     };
//   }


// get cardItems() {
//   return [
//     {
//       label: 'Check In',
//       icon: 'log-in-outline',
//       action: () => this.onCheckIn(),
//       disabled: this.isCheckedIn
//     },
//     {
//       label: 'Check Out',
//       icon: 'log-out-outline',
//       action: () => this.onCheckOut(),
//       disabled: !this.isCheckedIn
//     },
//     {
//       label: 'Attendance Summary',
//       icon: 'calendar-outline',
//       action: () => this.onattendancesummary(),
//       disabled: false
//     },
//     {
//       label: 'Leave Entry',
//       icon: 'document-text-outline',
//       action: () => this.onleaveEntry(),
//       disabled: false
//     },
//     {
//       label: 'SMART PUNCH - ONE TO ONE',
//       icon: 'finger-print-outline',
//       action: () => this.onsmartpunch(),
//       disabled: false
//     }
//   ];
// }

//   openPopover(event: Event) {
//     this.popoverEvent = event;
//     this.popoverOpen = true;
//   }

//   selectOption(option: string) {
//     this.popoverOpen = false; // Close the popover

//     if (option === 'logout') {
//       this.logout();
//     } else if (option === 'changePassword') {
//       this.goToChangePassword();
//     }
//   }


//   logout() {
//     localStorage.clear();
//     sessionStorage.clear();
//     this.router.navigate(['/login']);
//   }


// // geofencing


// watchId: any

// async startGeofencing() {
//   this.watching = true;
//   await LocalNotifications.requestPermissions();

//   // Start watching location changes
//   this.watchId = Geolocation.watchPosition(
//     { enableHighAccuracy: true },
//     async (position, err) => {
//       if (err) {
//         console.error('Geolocation error:', err);
//         return;
//       }
//       if (!position) return;

//       const { latitude, longitude } = position.coords;
//       const distance = this.getDistanceFromLatLonInM(
//         latitude,
//         longitude,
//         this.geofence.lat,
//         this.geofence.lng
//       );

//       this.isInside = distance <= this.geofence.radius;
//       this.geofenceStatus = this.isInside ? '✅ Inside Geofence' : '❌ Outside Geofence';

//       // 🔹 Trigger notification when status changes
//       if (this.isInside && this.lastStatus !== 'inside') {
//         await LocalNotifications.schedule({
//           notifications: [
//             {
//               id: 1,
//               title: 'Welcome to Romaizan Jewellery ✨',
//               body: 'Discover today’s special offers inside!',
//               schedule: { at: new Date(Date.now() + 1000) },
//             },
//           ],
//         });
//       } else if (!this.isInside && this.lastStatus === 'inside') {
//         await LocalNotifications.schedule({
//           notifications: [
//             {
//               id: 2,
//               title: 'Thanks for visiting 💍',
//               body: 'Come back soon for exclusive designs!',
//               schedule: { at: new Date(Date.now() + 1000) },
//             },
//           ],
//         });
//       }

//       this.lastStatus = this.isInside ? 'inside' : 'outside';
//     }
//   );
// }


//   stopGeofencing() {
//     if (this.intervalId) {
//       clearInterval(this.intervalId);
//       this.intervalId = null;
//     }
//     this.watching = false;
//     this.geofenceStatus = 'Stopped';
//     this.lastStatus = null;
//   }

//   private getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number): number {
//     const R = 6371e3; // meters
//     const dLat = this.deg2rad(lat2 - lat1);
//     const dLon = this.deg2rad(lon2 - lon1);
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(this.deg2rad(lat1)) *
//         Math.cos(this.deg2rad(lat2)) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c;
//   }

//   private deg2rad(deg: number) {
//     return deg * (Math.PI / 180);
//   }

//   ngOnDestroy() {
//     this.stopGeofencing();
//   }


// }


import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UntypedFormBuilder, Validators, FormGroup } from '@angular/forms';
import { DataService } from '../services/data.service';
import { ToastService } from '../services/toast.service';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  // 📍 Map
  center!: google.maps.LatLngLiteral;
  markerPosition!: google.maps.LatLngLiteral;

  // ⚙️ State
  popoverOpen = false;
  popoverEvent: any = null;
  attendanceFormGroup!: FormGroup;
  userDetails: any;
  receivedData: any;
  isCheckedIn = false;

  // 🛰 Geofencing
  geofenceStatus = 'Unknown';
  watching = false;
  watchId: any
  lastStatus: 'inside' | 'outside' | null = null;
  isInside = false;

  geofence = {
    lat: 25.2700291,   //romizan
    lng: 55.2983818,
    // lat: 29.9940807,
    // lng: 72.6794903,  afsar
    radius: 200, // meters
  };

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private fb: UntypedFormBuilder,
    private dataService: DataService,
    private toastService: ToastService
  ) {}

  // ✅ Init
  async ngOnInit() {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');

    this.attendanceFormGroup = this.fb.group({
      AttendanceID: [0, [Validators.required]],
      AttendanceEmpID: [this.userDetails.userId],
      ProjectID: [-1, [Validators.required]],
      PunchDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      CheckOut: [null],
      Latitude: [null],
      Longitude: [null],
      LocationName: [''],
      ImageFile: [null],
      Remarks: [null],
      PunchMode: [false],
      PunchTime: [null],
      Active: [false],
    });

    await this.requestLocationPermission();
    this.startGeofencing();
        this.getCurrentLocation();

    // Handle shared data
    this.dataService.data$.subscribe((data) => {
      this.receivedData = data;
      if (!data) {
        this.getCurrentLocation();
      } else {
        this.attendanceFormGroup.patchValue({
          Latitude: data.lat.toString(),
          Longitude: data.lng.toString(),
        });
      }
    });
  }

  ngOnDestroy() {
    this.stopGeofencing();
  }

  // 🔑 Authentication
  goToChangePassword() {
    this.router.navigate(['/login/passwordchange']);
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  // 📍 Location
  async requestLocationPermission() {
    try {
      await Geolocation.requestPermissions();
    } catch (error) {
      console.error('Permission request error:', error);
    }
  }

  async getCurrentLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });

      const { latitude, longitude } = coordinates.coords;

      this.attendanceFormGroup.patchValue({
        Latitude: latitude.toString(),
        Longitude: longitude.toString(),
      });
      this.center = { lat: latitude, lng: longitude };
      this.markerPosition = { ...this.center };
    } catch (error) {
      console.error('Error getting location:', error);
      this.setDefaultLocation();
    }
  }

  updateMarkerPosition(event: google.maps.MapMouseEvent) {
    if (!event.latLng) return;

    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();

    this.markerPosition = { lat: newLat, lng: newLng };
    this.attendanceFormGroup.patchValue({
      Latitude: newLat.toString(),
      Longitude: newLng.toString(),
    });

    this.dataService.sendData(this.markerPosition);
  }

  setDefaultLocation() {
    this.center = { lat: 31.4933248, lng: 74.3079936 };
    this.markerPosition = { ...this.center };
    this.attendanceFormGroup.patchValue({
      Latitude: this.center.lat.toString(),
      Longitude: this.center.lng.toString(),
    });
  }

  getCurrentTime() {
    const formattedTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    this.attendanceFormGroup.get('PunchTime')?.setValue(formattedTime);
  }

  // 🕒 Attendance
  onCheckIn() {
    this.getCurrentTime();
    if (this.isInside) {
      this.dataService.attendancedatalistpost(this.attendanceFormGroup.value).subscribe((res) => {
        if (res) {
          this.isCheckedIn = true;
          this.toastService.presentToast('Check-In successfully');
        } else {
          this.toastService.presentToastErrror('Something went wrong');
        }
      });
    } else {
      this.toastService.presentToastErrror('You are outside the office area. Check-in is not allowed.');
    }
  }

  onCheckOut() {
    this.getCurrentTime();
       if (this.isInside) {
    this.attendanceFormGroup.controls['PunchMode'].setValue(true);

    this.dataService.attendancedatalistpost(this.attendanceFormGroup.value).subscribe((res) => {
      if (res) {
        this.isCheckedIn = false;
        this.toastService.presentToast('Check-Out successfully');
      } else {
        this.toastService.presentToastErrror('Something went wrong');
      }
    });
    } else {
      this.toastService.presentToastErrror('You are outside the office area. Check-Out is not allowed.');
    }
  }

  // 📊 Navigation
  onSmartPunch() {
    this.router.navigate(['/smartpunch']);
  }

  onAttendanceSummary() {
    this.router.navigate(['/attendancesummary']);
  }

  onLeaveEntry() {
    this.router.navigate(['/leaveentry']);
  }
  onfaceid(){
       this.router.navigate(['/facid']);
  }

  get cardItems() {
    return [
      { label: 'Check In', icon: 'log-in-outline', action: () => this.onCheckIn(), disabled: this.isCheckedIn },
      { label: 'Check Out', icon: 'log-out-outline', action: () => this.onCheckOut(), disabled: !this.isCheckedIn },
      { label: 'Attendance Summary', icon: 'calendar-outline', action: () => this.onAttendanceSummary(), disabled: false },
      { label: 'Leave Entry', icon: 'document-text-outline', action: () => this.onLeaveEntry(), disabled: false },
      { label: 'SMART PUNCH - ONE TO ONE', icon: 'finger-print-outline', action: () => this.onSmartPunch(), disabled: false },
             {
      label: 'Face ID',
      icon: 'finger-print-outline',
      action: () => this.onfaceid(),
      disabled: false
    },
    ];
  }

  // ⚙️ Popover
  openPopover(event: Event) {
    this.popoverEvent = event;
    this.popoverOpen = true;
  }

  selectOption(option: string) {
    this.popoverOpen = false;
    if (option === 'logout') this.logout();
    else if (option === 'changePassword') this.goToChangePassword();
  }

  // 🛰 Geofencing
  async startGeofencing() {
    this.watching = true;
    await LocalNotifications.requestPermissions();

    this.watchId = Geolocation.watchPosition({ enableHighAccuracy: true }, async (position, err) => {
      if (err || !position) {
        console.error('Geolocation error:', err);
        return;
      }

      const { latitude, longitude } = position.coords;
      const distance = this.getDistanceFromLatLonInM(latitude, longitude, this.geofence.lat, this.geofence.lng);

      this.isInside = distance <= this.geofence.radius;
      console.log("inside",this.isInside)
      this.geofenceStatus = this.isInside ? '✅ Inside Geofence' : '❌ Outside Geofence';

      if (this.isInside && this.lastStatus !== 'inside') {
        await LocalNotifications.schedule({
          notifications: [{ id: 1, title: 'Welcome to Romaizan Jewellery ✨', body: 'Discover today’s special offers inside!' }],
        });
      } else if (!this.isInside && this.lastStatus === 'inside') {
        await LocalNotifications.schedule({
          notifications: [{ id: 2, title: 'Thanks for visiting 💍', body: 'Come back soon for exclusive designs!' }],
        });
      }

      this.lastStatus = this.isInside ? 'inside' : 'outside';
    });
  }

  stopGeofencing() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
    this.watching = false;
    this.geofenceStatus = 'Stopped';
    this.lastStatus = null;
  }

  private getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // meters
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }
}
