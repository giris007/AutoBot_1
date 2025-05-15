import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DealerService {
  private dealersData: any[] = [];
  private dataLoaded = false;

  constructor(private http: HttpClient) {
    this.loadDealersData();
  }

  private loadDealersData(): void {
    this.http.get<any[]>('assets/data/dealers.json')
      .subscribe({
        next: (data) => {
          this.dealersData = data;
          this.dataLoaded = true;
          console.log('Dealers data loaded successfully');
        },
        error: (error) => {
          console.error('Error loading dealers data:', error);
        }
      });
  }

  getDealersData(): any[] {
    return this.dealersData;
  }

  searchDealerInfo(query: string): any[] {
    if (!this.dataLoaded || !query) {
      return [];
    }
    
    query = query.toLowerCase();
    
    return this.dealersData.filter(dealer => {
      // Search through all properties of the dealer object
      return Object.entries(dealer).some(([key, value]) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query);
        } else if (typeof value === 'number') {
          return value.toString().includes(query);
        }
        return false;
      });
    });
  }

  getOEMInfo(oemName: string): any[] {
    if (!this.dataLoaded) {
      return [];
    }
    
    oemName = oemName.toLowerCase();
    
    return this.dealersData.filter(dealer => 
      dealer['OEM NAME'].toLowerCase().includes(oemName)
    );
  }

  getDealersByRegion(region: string): any[] {
    if (!this.dataLoaded) {
      return [];
    }
    
    region = region.toLowerCase();
    
    return this.dealersData.filter(dealer => 
      dealer['Region'].toLowerCase().includes(region)
    );
  }

  getActiveContracts(): any[] {
    if (!this.dataLoaded) {
      return [];
    }
    
    return this.dealersData.filter(dealer => 
      dealer['Contract Status'] === 'Active'
    );
  }

  getDealerById(dealerId: string): any {
    if (!this.dataLoaded) {
      return null;
    }
    
    return this.dealersData.find(dealer => 
      dealer['Dealer Id'] === dealerId
    );
  }
}