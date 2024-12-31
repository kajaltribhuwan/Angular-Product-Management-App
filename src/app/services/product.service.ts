import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, saveProduct } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  // Fetches a list of products, optionally filtered by category.

  getProducts(category: string): Observable<Product[]> {
    const categoryUrl = category ? `/category/${category}` : '';
    return this.http.get<Product[]>(
      `https://fakestoreapi.com/products${categoryUrl}?sort=desc`
    );
  }

  //Adds or updates a product based on whether an existing product is selected.
  addEditProduct(postData: any, selectedPdt: any) {
    if (!selectedPdt) {
      return this.http.post<any>('https://fakestoreapi.com/products', postData);
    } else {
      return this.http.put(
        `https://fakestoreapi.com/products/${selectedPdt.id}`,
        postData
      );
    }
  }
  //* Deletes a product by its ID.
  deleteProduct(productId: number) {
    return this.http.delete(`https://fakestoreapi.com/products/${productId}`);
  }

  //Fetches the list of product categories.
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(
      'https://fakestoreapi.com/products/categories'
    );
  }
}
