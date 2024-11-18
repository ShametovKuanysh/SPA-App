import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((isAuthenticated:boolean) => {
      this.isAuthenticated = isAuthenticated
    });
  }
}
