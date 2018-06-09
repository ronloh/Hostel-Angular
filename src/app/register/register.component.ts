import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { HostelService } from '../services/hostel.service';

export enum Gender {
	Female = 0,
	Male = 1
}

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})


export class RegisterComponent implements OnInit {
	// title = 'Hostel Management System';
	static errorMsg;
	userIdModel: string = '';
	passwordModel: string = '';
	cpasswordModel: string = '';
	matricNoModel: string = '';
	nameModel: string = '';
	contactModel: string = '';
	selectedGender: number = 0;
	genders = [Gender.Female, Gender.Male];
	genderString = ["Female", "Male"];

	get staticErrorMsg() {
		return RegisterComponent.errorMsg;
	}

	set staticErrorMsg(msg) {
		RegisterComponent.errorMsg = msg;
	}

	constructor(private router: Router, private hostelService: HostelService) {
		RegisterComponent.errorMsg = "";
	}

	ngOnInit() {
	}

	validate() {
		this.staticErrorMsg = "";
		var valid = true;

		if (
			this.contactModel.length == 0 ||
			this.passwordModel.length == 0 ||
			this.cpasswordModel.length == 0 ||
			this.matricNoModel.length == 0 ||
			this.nameModel.length == 0 ||
			this.contactModel.length == 0
		) {
			this.staticErrorMsg = "Please fill in all fields."
			valid = false
		}
		else if (this.passwordModel != this.cpasswordModel) {
			this.staticErrorMsg = "Password does not match";
			valid = false;
		}

		if (valid) {
			this.register();
		}
	}

	register() {
		let params = {
			username: this.userIdModel,
			password: this.passwordModel,
			matric_no: this.matricNoModel,
			gender: this.selectedGender,
			name: this.nameModel,
			contact: this.contactModel
		}

		this.hostelService.postData(params, "register").then((result) => {
			let response: any = result;

			if (response.status == "success") {
				let data = response.data;

				localStorage.setItem("token", data.token)
				localStorage.setItem("user_id", data.user_id)
				localStorage.setItem("user_type", data.user_type)

				let element: HTMLElement = document.getElementById('route');
				if (data.user_type == "0") {
					this.router.navigate(['/homeAdmin']);
				}
				else {
					this.router.navigate(['/home']);
				}
			}
			else {
				this.staticErrorMsg = response.message;
			}
		});
	}

	route(route: string) {
		this.router.navigate([route]);
	}

	onSelect(gender: number) {
		this.selectedGender = gender;
	}

}




