import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { PollutionServiceService } from '../pollution-service.service';
import { Pollution } from '../models/pollution';
import { PollutionDetailsComponent } from '../pollution-details/pollution-details.component';

@Component({
  selector: 'app-pollution-list',
  imports: [CommonModule, RouterModule, PollutionDetailsComponent],
  templateUrl: './pollution-list.component.html',
  styleUrl: './pollution-list.component.css', 
  providers: [PollutionServiceService]
})  
export class PollutionListComponent implements OnInit {
  pollutions$: Observable<Pollution[]>;
  selectedPollutionId: number | null = null;

  constructor(private pollutionService: PollutionServiceService) {}

  ngOnInit(): void {
    this.pollutions$ = this.pollutionService.getPollutions();
  }

  deletePollution(id: number): void {
    this.pollutionService.deletePollution(id);
    this.pollutions$ = this.pollutionService.getPollutions();
    if (this.selectedPollutionId === id) {
      this.selectedPollutionId = null;
    }
  }

  showDetails(pollutionId: number): void {
    this.selectedPollutionId = pollutionId;
  }

  hideDetails(): void {
    this.selectedPollutionId = null;
  }
}

