import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private apiUrl = 'http://localhost:8080/api/upload';

  constructor(private http: HttpClient) { }

  // uploads image file to the backend
  uploadImage(imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageFile, imageFile.name);
    
    // add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const url = `${this.apiUrl}?t=${timestamp}`;
    // POST request to upload the image
    return this.http.post<any>(url, formData).pipe(
      tap(
        response => console.log('Upload successful', response),
        error => console.error('Upload error', error)
      )
    );
  }
}