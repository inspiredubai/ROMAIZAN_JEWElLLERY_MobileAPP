import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { RegisterUserComponent } from './register-user/register-user.component';

 
const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
   {
      path: 'passwordchange',
      component: PasswordChangeComponent
    },
    {
      path: 'registeruser',
      component:  RegisterUserComponent
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
