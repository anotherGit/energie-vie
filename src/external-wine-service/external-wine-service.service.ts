import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

export class ExternalWineBottle {
  id: string;
  name: string;
  type: string;
  price: number;
  year: number;
  grapeVarieties: string[];
}

@Injectable()
export class ExternalWineServiceService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getRecentlyAddedWineBottles(fromDate: Date) {
    const path = `${this.configService.getOrThrow('EXTERNAL_WINE_SERVICE_URL')}/recentlyAdded`;
    const query = `fromDate=${fromDate.getTime()}`;
    const url = `${path}?${query}`;

    return this.getWineBottles(url);
  }

  async getRecentlyUpdatedWineBottles(fromDate: Date) {
    const path = `${this.configService.getOrThrow('EXTERNAL_WINE_SERVICE_URL')}/recentlyUpdated`;
    const query = `fromDate=${fromDate.getTime()}`;
    const url = `${path}?${query}`;

    return this.getWineBottles(url);
  }

  async getWineBottles(url: string) {
    const headers = {
      apiKey: this.configService.getOrThrow('EXTERNAL_WINE_SERVICE_API_KEY'),
    };

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, { headers }),
      );

      if (response.status !== HttpStatus.OK) {
        throw new HttpException(
          `Unexpected response status: ${response.status}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (!Array.isArray(response.data)) {
        throw new HttpException(
          'Invalid response format',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return response.data.map((item: any) => {
        if (
          typeof item.id !== 'string' ||
          typeof item.name !== 'string' ||
          typeof item.type !== 'string' ||
          typeof item.price !== 'number' ||
          typeof item.year !== 'number' ||
          !Array.isArray(item.grapeVarieties) ||
          !item.grapeVarieties.every(
            (variety: any) => typeof variety === 'string',
          )
        ) {
          throw new HttpException(
            'Invalid item format in response data',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        return {
          id: item.id,
          name: item.name,
          type: item.type,
          price: item.price,
          year: item.year,
          grapeVarieties: item.grapeVarieties,
        } as ExternalWineBottle;
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch new wine bottles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
