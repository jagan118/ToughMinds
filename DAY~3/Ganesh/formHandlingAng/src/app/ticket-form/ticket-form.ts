import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-form',
  imports: [ReactiveFormsModule],
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.css',
})
export class TicketForm {
  supportTicketForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email:new FormControl('', [Validators.required, Validators.email]),
    department: new FormControl('', Validators.required),
    message : new FormControl('',[Validators.required, Validators.minLength(6)])
  });
  onSubmit(){
    if(this.supportTicketForm.valid){
      console.log(this.supportTicketForm.value);
    }
  }
}
