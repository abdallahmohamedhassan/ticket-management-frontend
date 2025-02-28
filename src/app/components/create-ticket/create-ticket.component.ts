import { Component } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css']
})
export class CreateTicketComponent {
  ticketForm: FormGroup;

  constructor(private fb: FormBuilder, private ticketService: TicketService, private toster: ToastrService) {

    this.ticketForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]], 
      governorate: ['', [Validators.required, Validators.pattern('^[A-Za-z\s]+$')]],
      city: ['', [Validators.required, Validators.pattern('^[A-Za-z\s]+$')]],
      district: ['', [Validators.required, Validators.pattern('^[A-Za-z\s]+$')]]
    });
  }

  submitTicket(): void {
    if (this.ticketForm.valid) {
      this.ticketService.createTicket(this.ticketForm.value)
      .subscribe({
        next: (res) => {
          this.ticketForm.reset();
          this.toster.success('Added Success!' , 'Success')
        },
        error: () => {
          this.toster.error('Failed to Create', 'Error');
        }
      });
      
    }else
    {
      this.ticketForm.markAllAsTouched(); 
      this.toster.error('Fields are required' , 'error')

    }
  }
}
