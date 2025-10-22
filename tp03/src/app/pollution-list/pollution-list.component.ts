import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { PollutionServiceService } from '../pollution-service.service';
import { Pollution } from '../models/pollution';
import { PollutionDetailsComponent } from '../pollution-details/pollution-details.component';

@Component({
  selector: 'app-pollution-list',
  imports: [CommonModule, RouterModule, FormsModule, PollutionDetailsComponent],
  templateUrl: './pollution-list.component.html',
  styleUrl: './pollution-list.component.css', 
  providers: [PollutionServiceService]
})  
export class PollutionListComponent implements OnInit {
  pollutions$: Observable<Pollution[]>;
  selectedPollutionId: number | null = null;
  titleSearch: string = '';
  typeSearch: string = '';
  availableTypes: string[] = ['Air', 'Eau', 'Chimique', 'Autre'];

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

  TitleSearch(): void {
    if (this.titleSearch.trim() === '') {      
      this.pollutions$ = this.pollutionService.getPollutions();
    } else {      
      this.pollutions$ = this.pollutionService.getPollutionsBy('', this.titleSearch);
      console.log(this.pollutions$);
    }
  }

  filterPollutions(): void {
    if (this.titleSearch.trim() === '' && this.typeSearch === '') {
      this.pollutions$ = this.pollutionService.getPollutions();
    } else {
      this.pollutions$ = this.pollutionService.getPollutionsBy(this.typeSearch, this.titleSearch);
    }
  }

  clearFilters(): void {
    this.titleSearch = '';
    this.typeSearch = '';
    this.pollutions$ = this.pollutionService.getPollutions();
  }  
}

