import type { AxiosRequestConfig } from 'axios';

import type { RequestClient } from '../request-client';
import type { RequestResponse } from '../types';

import { downloadByData } from '@vben/utils';

class FileDownloader {
  private client: RequestClient;

  constructor(client: RequestClient) {
    this.client = client;
  }

  public async download(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<RequestResponse<Blob>> {
    const finalConfig: AxiosRequestConfig = {
      ...config,
      responseType: 'blob',
    };

    return await this.client.request<RequestResponse<Blob>>(url, finalConfig);
  }
  public async downloadFile(
    url: string,
    fileName: string,
    config?: AxiosRequestConfig,
  ): Promise<void> {
    const finalConfig: AxiosRequestConfig = {
      ...config,
      responseType: 'blob',
    };

    await this.client
      .request<RequestResponse<Blob>>(url, finalConfig)
      .then((ret) => {
        downloadByData(ret, fileName);
      });
  }
}

export { FileDownloader };
