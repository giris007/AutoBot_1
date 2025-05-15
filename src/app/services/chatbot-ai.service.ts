import { Injectable } from '@angular/core';
import { DealerService } from './dealer.service';
import { BedrockService, ChatMessage } from './bedrock.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatbotAIService {
  constructor(
    private dealerService: DealerService,
    private bedrockService: BedrockService
  ) {}

  processQuery(query: string): Observable<ChatMessage> {
    // First try to handle the query locally with our data
    const response = this.handleLocalQuery(query);
    
    if (response) {
      // If we can handle it locally, return the response
      return of({
        role: 'assistant' as const,
        content: response
      });
    } else {
      // If we can't handle it locally, send to Bedrock AI
      const userMessage: ChatMessage = {
        role: 'user',
        content: query
      };
      
      return this.bedrockService.sendMessage([userMessage])
        .pipe(
          map(response => response.message),
          catchError(error => {
            console.error('Error calling Bedrock:', error);
            return of({
              role: 'assistant' as const,
              content: 'Sorry, I encountered an error processing your request. Please try again later.'
            });
          })
        );
    }
  }

  private handleLocalQuery(query: string): string | null {
    query = query.toLowerCase();
    
    // Check for OEM related queries
    if (query.includes('oem')) {
      const oemMatches = /oem\s+([a-z])/i.exec(query);
      if (oemMatches && oemMatches[1]) {
        const oemName = oemMatches[1].toUpperCase();
        const oemInfo = this.dealerService.getOEMInfo(`OEM ${oemName}`);
        
        if (oemInfo.length > 0) {
          return this.formatDealerResponse(oemInfo, `Information about OEM ${oemName}`);
        }
      } else {
        // General OEM query
        const allOEMs = this.dealerService.getDealersData()
          .map(dealer => dealer['OEM NAME'])
          .filter((value, index, self) => self.indexOf(value) === index); // Get unique OEMs
          
        if (allOEMs.length > 0) {
          return `Here are all the OEMs in our database: ${allOEMs.join(', ')}`;
        }
      }
    }
    
    // Check for dealer ID queries
    if (query.includes('dealer') && query.includes('id')) {
      const idMatches = /dealer.*id.*([d][0-9]{3})/i.exec(query) || 
                       /id.*([d][0-9]{3})/i.exec(query);
      
      if (idMatches && idMatches[1]) {
        const dealerId = idMatches[1].toUpperCase();
        const dealer = this.dealerService.getDealerById(dealerId);
        
        if (dealer) {
          return this.formatDealerResponse([dealer], `Information about Dealer ${dealerId}`);
        }
      }
    }
    
    // Check for region queries
    if (query.includes('region')) {
      const regionMatches = /region\s+([a-z])/i.exec(query);
      if (regionMatches && regionMatches[1]) {
        const regionName = regionMatches[1].toUpperCase();
        const regionDealers = this.dealerService.getDealersByRegion(`Region ${regionName}`);
        
        if (regionDealers.length > 0) {
          return this.formatDealerResponse(regionDealers, `Dealers in Region ${regionName}`);
        }
      }
    }
    
    // Check for active contract queries
    if (query.includes('active') && query.includes('contract')) {
      const activeContracts = this.dealerService.getActiveContracts();
      
      if (activeContracts.length > 0) {
        return this.formatDealerResponse(activeContracts, 'Dealers with Active Contracts');
      }
    }
    
    // General search
    if (query.length > 3) {
      const searchResults = this.dealerService.searchDealerInfo(query);
      
      if (searchResults.length > 0) {
        return this.formatDealerResponse(searchResults, 'Search Results');
      }
    }
    
    // If we couldn't handle the query locally
    return null;
  }
  
  private formatDealerResponse(dealers: any[], title: string): string {
    let response = `## ${title}\n\n`;
    
    dealers.forEach((dealer, index) => {
      response += `### ${dealer['Dealer name'] || dealer['OEM NAME'] || 'Entry ' + (index + 1)}\n`;
      
      Object.entries(dealer).forEach(([key, value]) => {
        response += `- **${key}**: ${value}\n`;
      });
      
      response += '\n';
    });
    
    
    return response;
  }
}
