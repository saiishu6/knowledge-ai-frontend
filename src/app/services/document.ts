
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface DocumentsResponse {
  documents: string[];
}

@Injectable({
  providedIn: 'root'
})
export class Document {
  private http = inject(HttpClient);

  upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post('/api/documents/upload', formData, {
      responseType: 'text'
    });
  }

  getDocuments() {
    return this.http.get<DocumentsResponse>('/api/documents');
  }

  deleteDocument(filename: string) {
    return this.http.delete(
      `/api/documents/${encodeURIComponent(filename)}`,
      { responseType: 'text' }
    );
  }
}
