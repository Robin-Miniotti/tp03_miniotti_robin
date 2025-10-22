import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Pollution } from '../models/pollution';
import { PollutionServiceService } from '../pollution-service.service';

@Component({
  selector: 'app-pollution-details',
  imports: [CommonModule],
  templateUrl: './pollution-details.component.html',
  styleUrl: './pollution-details.component.css'
})
export class PollutionDetailsComponent implements OnInit {
  @Input() pollutionId!: number;
  pollution$: Observable<Pollution>;

  constructor(private pollutionService: PollutionServiceService) {}

  ngOnInit(): void {
    this.pollution$ = this.pollutionService.getPollutionById(this.pollutionId);
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
