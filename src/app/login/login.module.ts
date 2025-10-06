import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { HomePageModule } from '../home/home.module';
import { HttpClientModule } from '@angular/common/http';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { RegisterUserComponent } from './register-user/register-user.component';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginRoutingModule,
    HomePageModule,
    ReactiveFormsModule,
    HttpClientModule
   ],
  declarations: [LoginComponent,PasswordChangeComponent,RegisterUserComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginModule {}
