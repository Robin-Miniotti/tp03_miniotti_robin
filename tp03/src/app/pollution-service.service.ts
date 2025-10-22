import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, BehaviorSubject, of } from 'rxjs';
import { Pollution } from './models/pollution';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class PollutionServiceService {
  private pollutionsSubject = new BehaviorSubject<Pollution[]>([]);
  private pollutions$ = this.pollutionsSubject.asObservable();
  private isDataLoaded = false;

  constructor(private http: HttpClient) { 
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.http.get<Pollution[]>(environment.apiUrl).subscribe(pollutions => {
      this.pollutionsSubject.next(pollutions);
      this.isDataLoaded = true;
    });
  }

  getPollutions(): Observable<Pollution[]> {
    if (environment.apiUrl.includes('.json')) {
      return this.pollutions$;
    }
    return this.http.get<Pollution[]>(environment.apiUrl);
  }
 
  getPollutionById(id: number): Observable<Pollution> {
    // En mode développement avec le fichier JSON, on récupère depuis le BehaviorSubject
    if (environment.apiUrl.includes('.json')) {
      return this.pollutions$.pipe(
        map(pollutions => {
          const pollution = pollutions.find(p => p.id === id);
          if (!pollution) {
            throw new Error(`Pollution with id ${id} not found`);
          }
          return pollution;
        })
      );
    }
    // En mode production avec une vraie API
    return this.http.get<Pollution>(`${environment.apiUrl}/${id}`);
  }

  addPollution(pollution: Omit<Pollution, 'id'>): Observable<Pollution> {
    if (environment.apiUrl.includes('.json')) {
      // Simulation de l'ajout côté client
      const currentPollutions = this.pollutionsSubject.value;
      const newId = Math.max(...currentPollutions.map(p => p.id), 0) + 1;
      const newPollution = { ...pollution, id: newId } as Pollution;
      this.pollutionsSubject.next([...currentPollutions, newPollution]);
      return of(newPollution);
    }
    return this.http.post<Pollution>(environment.apiUrl, pollution);
  }

  updatePollution(id: number, pollution: Partial<Pollution>): Observable<Pollution> {
    if (environment.apiUrl.includes('.json')) {
      // Simulation de la mise à jour côté client
      const currentPollutions = this.pollutionsSubject.value;
      const index = currentPollutions.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error(`Pollution with id ${id} not found`);
      }
      const updatedPollution = { ...currentPollutions[index], ...pollution };
      const updatedPollutions = [...currentPollutions];
      updatedPollutions[index] = updatedPollution;
      this.pollutionsSubject.next(updatedPollutions);
      return of(updatedPollution);
    }
    return this.http.put<Pollution>(`${environment.apiUrl}/${id}`, pollution);
  }

  deletePollution(id: number): Observable<void> {
    console.log(`Deleting pollution with id: ${id}`);
    if (environment.apiUrl.includes('.json')) {
      // Simulation de la suppression côté client
      const currentPollutions = this.pollutionsSubject.value;
      const filteredPollutions = currentPollutions.filter(p => p.id !== id);
      this.pollutionsSubject.next(filteredPollutions);
      return of(void 0);
    }
    return this.http.delete<void>(`${environment.apiUrl}/${id}`);
  }
}
