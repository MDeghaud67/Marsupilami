import { Component, OnInit } from '@angular/core';
import { AuthService, UserDetails } from '../services/auth.service';

//import { User } from '../../../srv/models/User';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  details?: UserDetails;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.home().subscribe(user => {
      this.details = user;
    }, (err) => {
      console.error(err);
    });
  }

}
