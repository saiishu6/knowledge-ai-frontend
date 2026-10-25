
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chat } from './services/chat';
import { Document } from './services/document';

type Page = 'chat' | 'documents' | 'upload';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  sources?: string[];
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private chatService = inject(Chat);
  private documentService = inject(Document);

  activePage = signal<Page>('chat');

  // Chat
  question = '';
  loading = signal(false);
  messages = signal<ChatMessage[]>([]);

  // Upload
  selectedFile: File | null = null;
  uploading = signal(false);
  uploadMessage = signal('');

  // Documents
  documents = signal<string[]>([]);
  documentsLoading = signal(false);
  documentsError = signal('');
  deletingDocument = signal<string | null>(null);
  documentMessage = signal('');

  navigate(page: Page) {
    this.activePage.set(page);

    if (page === 'documents') {
      this.loadDocuments();
    }
  }

  // ---------------- CHAT ----------------

  sendMessage() {
    const text = this.question.trim();
    if (!text || this.loading()) return;

    this.messages.update(messages => [
      ...messages,
      { role: 'user', text }
    ]);

    this.question = '';
    this.loading.set(true);

    this.chatService.askQuestion(text).subscribe({
      next: response => {
        this.messages.update(messages => [
          ...messages,
          {
            role: 'assistant',
            text: response.answer,
            sources: response.sources
          }
        ]);
        this.loading.set(false);
      },
      error: error => {
        console.error('Chat API error:', error);
        this.messages.update(messages => [
          ...messages,
          {
            role: 'assistant',
            text: 'Sorry, something went wrong. Please try again.'
          }
        ]);
        this.loading.set(false);
      }
    });
  }

  // ---------------- UPLOAD ----------------

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
    this.uploadMessage.set('');
  }

  uploadDocument(fileInput: HTMLInputElement) {
    if (!this.selectedFile || this.uploading()) return;

    this.uploading.set(true);
    this.uploadMessage.set('');

    this.documentService.upload(this.selectedFile).subscribe({
      next: response => {
        this.uploadMessage.set(response);
        this.selectedFile = null;
        fileInput.value = '';
        this.uploading.set(false);
      },
      error: error => {
        console.error('Upload failed:', error);
        this.uploadMessage.set(
          typeof error.error === 'string'
            ? error.error
            : error.error?.message || 'Document upload failed.'
        );
        this.uploading.set(false);
      }
    });
  }

  // ---------------- DOCUMENTS ----------------

  loadDocuments() {
    this.documentsLoading.set(true);
    this.documentsError.set('');
    this.documentMessage.set('');

    this.documentService.getDocuments().subscribe({
      next: response => {
        this.documents.set(response.documents ?? []);
        this.documentsLoading.set(false);
      },
      error: error => {
        console.error('Failed to load documents:', error);
        this.documentsError.set(
          'Unable to load documents. Please try again.'
        );
        this.documentsLoading.set(false);
      }
    });
  }

  deleteDocument(filename: string) {
    if (this.deletingDocument()) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${filename}"?\n\n` +
      'All indexed chunks of this document will be removed.'
    );

    if (!confirmed) return;

    this.deletingDocument.set(filename);
    this.documentsError.set('');
    this.documentMessage.set('');

    this.documentService.deleteDocument(filename).subscribe({
      next: () => {
        this.deletingDocument.set(null);
        this.loadDocuments();
      },
      error: error => {
        console.error('Document deletion failed:', error);
        this.documentsError.set(
          'Failed to delete "' + filename + '". Please try again.'
        );
        this.deletingDocument.set(null);
      }
    });
  }
}
