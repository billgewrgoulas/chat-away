import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { SocketioService } from './services/socketio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Angular';
  private authService: AuthService;
  private authObserver: Observable<any> | undefined;

  constructor(a: AuthService, private router: Router) {
    this.authService = a;
  }

  ngOnInit() {
    this.authObserver = new Observable((observer) => {
      setInterval(() => {
        if (!this.navBar) {
          observer.next(true);
        }
      }, 300);
    });
    this.authObserver.subscribe((val) => {
      this.authService.logout('logout');
      this.router.navigateByUrl('login');
    });
  }

  public get navBar() {
    return this.authService.isAuthenticated();
  }
}
