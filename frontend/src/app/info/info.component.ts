import { Component, OnInit } from '@angular/core';
import { AuthService, UserDetails } from '../services/auth.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  details?: UserDetails;
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.info().subscribe(user => {
      this.details = user;
    }, (err) => {
      console.error(err);
    });
  }

}
