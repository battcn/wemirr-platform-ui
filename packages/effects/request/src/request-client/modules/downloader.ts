import type { AxiosRequestConfig } from 'axios';

import type { RequestClient } from '../request-client';

import { downloadFileFromBlob } from '@vben/utils';

class FileDownloader {
  private client: RequestClient;

  constructor(client: RequestClient) {
    this.client = client;
  }

  public async download(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<Blob> {
    const finalConfig: AxiosRequestConfig = {
      ...config,
      responseType: 'blob',
    };

    return await this.client.request<Blob>(url, {
      ...finalConfig,
      fetchOptions: { mode: 'full' },
    });
  }
  public async downloadFile(
    url: string,
    fileName: string,
    config?: AxiosRequestConfig,
  ): Promise<void> {
    await this.download(url, config).then((blob) =>
      downloadFileFromBlob({ fileName, source: blob }),
    );
  }
}

export { FileDownloader };
