import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'romaizan-jeweillery',
  webDir: 'www',
  server:{
    androidScheme:'http',
    cleartext:true,
    allowNavigation:[
      'http://103.74.54.207:8291/api/*'
    ]
  }};

export default config;
