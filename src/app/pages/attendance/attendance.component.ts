import { Component, OnInit, OnDestroy } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
  standalone: false,
})
export class AttendanceComponent implements OnInit {
  geofenceStatus: string = 'Unknown';
  watching: boolean = false;
  intervalId: any = null;
  lastStatus: 'inside' | 'outside' | null = null;

  map: any;
  geofenceMarker: any;
  geofenceCircle: any;
  userMarker: any;

  geofence = {
    // lat: 32.868968,
    // lng: 74.244743,
    lat: 30.51,

    lng: 72.47,
    radius: 200,
  };

  constructor(private alertCtrl: AlertController) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.loadMap();
    this.showWelcomePopup(); // show popup when admin opens map
  }

  async showWelcomePopup() {
    const alert = await this.alertCtrl.create({
      header: 'Geofence Map',
      message:
        'This map shows your shop geofence. You can monitor entry and exit here.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  loadMap() {
    const mapEl = document.getElementById('map') as HTMLElement;
    this.map = new google.maps.Map(mapEl, {
      center: { lat: this.geofence.lat, lng: this.geofence.lng },
      zoom: 16,
    });
    // 🔹 Shop marker
    this.geofenceMarker = new google.maps.Marker({
      position: { lat: this.geofence.lat, lng: this.geofence.lng },
      map: this.map,
      title: 'Romaizan Jewellery',
    });

    this.geofenceCircle = new google.maps.Circle({
      map: this.map,
      center: { lat: this.geofence.lat, lng: this.geofence.lng },
      radius: this.geofence.radius,
      strokeColor: '#007bff',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#007bff',
      fillOpacity: 0.2,
    });
  }

  async startGeofencing() {
    this.watching = true;
    await LocalNotifications.requestPermissions();

    this.intervalId = setInterval(async () => {
      try {
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
        });

        const { latitude, longitude } = position.coords;
        const distance = this.getDistanceFromLatLonInM(
          latitude,
          longitude,
          this.geofence.lat,
          this.geofence.lng
        );

        const isInside = distance <= this.geofence.radius;
        this.geofenceStatus = isInside
          ? '✅ Inside Geofence'
          : '❌ Outside Geofence';
        // 🔹 Trigger notification when status changes
        if (isInside && this.lastStatus !== 'inside') {
          await LocalNotifications.schedule({
            notifications: [
              {
                id: 1,
                title: 'Welcome to Romaizan Jewellery ✨',
                body: 'Discover today’s special offers inside!',
                schedule: { at: new Date(Date.now() + 1000) },
              },
            ],
          });
        } else if (!isInside && this.lastStatus === 'inside') {
          await LocalNotifications.schedule({
            notifications: [
              {
                id: 2,
                title: 'Thanks for visiting 💍',
                body: 'Come back soon for exclusive designs!',
                schedule: { at: new Date(Date.now() + 1000) },
              },
            ],
          });
        }

        this.lastStatus = isInside ? 'inside' : 'outside';

        if (this.userMarker) {
          this.userMarker.setMap(null);
        }
        this.userMarker = new google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: this.map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: '#ff0000',
            fillOpacity: 1,
            strokeWeight: 1,
          },
          title: 'You',
        });
      } catch (err) {
        console.error('Geolocation error:', err);
      }
    }, 5000);
  }

  stopGeofencing() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.watching = false;
    this.geofenceStatus = 'Stopped';
    this.lastStatus = null;
  }

  private getDistanceFromLatLonInM(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // meters
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  ngOnDestroy() {
    this.stopGeofencing();
  }
}
