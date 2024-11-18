import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})

export class ProfileComponent {
  user!: User;
  constructor(private authService: AuthService, private router: Router){}

  onLogout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}


interface User {
  email: string;
}
