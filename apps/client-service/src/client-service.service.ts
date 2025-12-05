import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class ClientServiceService {
  private readonly apiGatewayUrl: string;

  constructor(private configService: ConfigService) {
    this.apiGatewayUrl = 
      this.configService.get<string>('API_GATEWAY_URL') || 
      'http://localhost:3000';
  }

  async getUser(id: number) {
    try {
      const response: AxiosResponse = await axios.get(
        `${this.apiGatewayUrl}/api/users/${id}`,
        {
          timeout: 5000,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to fetch user: ${error.message || 'Unknown error'}`
        );
      }
      throw new Error(`Failed to fetch user: ${String(error)}`);
    }
  }

  async getOrder(id: number) {
    try {
      const response: AxiosResponse = await axios.get(
        `${this.apiGatewayUrl}/api/orders/${id}`,
        {
          timeout: 5000,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to fetch order: ${error.message || 'Unknown error'}`
        );
      }
      throw new Error(`Failed to fetch order: ${String(error)}`);
    }
  }
}

