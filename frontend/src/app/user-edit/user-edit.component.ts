import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService, UserDetails } from '../services/auth.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  submitted = false;
  editForm?: FormGroup;
  userData?: UserDetails[];

  constructor(public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.updateUser();
    let id = this.actRoute.snapshot.paramMap.get('id');
    if(!id){
      alert("Invalid action.")
      this.router.navigate(['info']);
      return;
    }
    //this.getUser(id);
    this.editForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      age: ['', [Validators.required]],
      family: ['', [Validators.required]],
      race: ['', [Validators.required]],
      food: ['', [Validators.required]],
    })
  }

  /*getUser(id) {
    this.authService.getUserDetails(id).subscribe(data => {
      this.editForm?.setValue({
        firstName: data['firstName'],
        lastName: data['lastName'],
        age: data['age'],
        family: data['family'],
        race: data['race'],
        food: data['food']
      });
    });
  }*/

  updateUser() {
    this.editForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      age: ['', [Validators.required]],
      family: ['', [Validators.required]],
      race: ['', [Validators.required]],
      food: ['', [Validators.required]],
    })
  }

  onSubmit() {
    this.submitted = true;
    if (!this.editForm?.valid) {
      return false;
    } else {
      if (window.confirm('Are you sure?')) {
        let id = this.actRoute.snapshot.paramMap.get('id');
        this.authService.update(this.editForm.value)
          .subscribe(res => {
            this.router.navigateByUrl('info');
            console.log('Content updated successfully!')
          }, (error) => {
            console.log(error)
          });
          /*this.authService.getUserById(id?)
            .subscribe(data => {
              this.editForm?.setValue(data);
            })*/
      }
    }
  }
}
