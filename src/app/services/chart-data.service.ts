import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ChartDataService {
  // Transform products to chart format: { name: category, value: product count }
  transformToChartData(products: Product[]): { name: string; value: number }[] {
    const categoryCount = products.reduce((acc, product) => {
      const category = product.category || 'Unknown';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.keys(categoryCount).map((category) => ({
      name: category,
      value: categoryCount[category],
    }));
  }
}
