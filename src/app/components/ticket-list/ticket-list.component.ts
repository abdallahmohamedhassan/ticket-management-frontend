import { Component, OnInit, OnDestroy } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { interval, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css'],
})
export class TicketListComponent implements OnInit, OnDestroy {
  tickets: Ticket[] = [];
  private counterSubscription!: Subscription;

  constructor(private ticketService: TicketService, private toastr: ToastrService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTickets();

    this.counterSubscription = interval(60 * 1000).subscribe(() => {
      this.updateTicketColors();
    });
  }

  loadTickets(): void {
    this.ticketService.getTickets().subscribe({
      next: (res) => {
        this.tickets = res;
        this.updateTicketColors();
      },
      error: () => {
        this.toastr.error('Failed to fetch data', 'Error');
      },
    });
  }

  updateTicketColors(): void {
    const now = Date.now();
    
    this.tickets = this.tickets.map((ticket) => {
      const elapsed = now - new Date(ticket.creationDate).getTime();
  let color;
  if(ticket.status=="Handled")
  {color = 'white';

  }else if (elapsed <= 15 * 60 * 1000) {
        color = 'yellow';
      } else if (elapsed <= 30 * 60 * 1000) {
        color = 'green';
      } else if (elapsed <= 45 * 60 * 1000) {
        color = 'blue';
      }
      else {
        color = 'red';
      }
  
      return { ...ticket, color }; 
    });
  
    this.cdr.detectChanges(); 


  }
  onRowPrepared(e: any): void {
    if (e.rowType === 'data') {
      e.rowElement.style.backgroundColor = e.data.color;

    }
  }
  
  handleTicket(id: string): void {
    this.ticketService.handleTicket(id).subscribe({
      next: (res) => {
        this.loadTickets();
        this.updateTicketColors();
        this.toastr.success('Handle Success', 'Success');

      },
      error: () => {
        this.toastr.error('Failed to handle the ticket', 'Error');
      },
    });
  
  }

  ngOnDestroy(): void {
    if (this.counterSubscription) {
      this.counterSubscription.unsubscribe();
    }
  }
  onCellPrepared(e: any): void {
    // Only modify data rows and specifically the "Actions" column
    if (e.rowType === 'data' && e.column.caption === 'Actions') {
      // Clear the cell element content if needed
      e.cellElement.innerHTML = '';
  
      // Check your condition: show button only if status is 'Pending'
      if (e.data.status === 'Pending') {
        const button = document.createElement('button');
        button.textContent = 'Handle';
        button.classList.add('btn', 'btn-primary', 'button-36');
        // Attach click event
        button.addEventListener('click', () => {
          this.handleTicket(e.data.id);
        });
  
        // Append the button to the cell
        e.cellElement.appendChild(button);
      }
    }
  }
}
