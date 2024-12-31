import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ChartDataService } from '../services/chart-data.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  displayAddEditModal = false;
  selectedProduct: any = null;
  subscriptions: Subscription[] = [];
  pdtSubscription: Subscription = new Subscription();
  dltSubscription: Subscription = new Subscription();

  // Chart-related data and configurations
  chartData: { name: string; value: number }[] = [];
  view: [number, number] = [700, 400];
  showLegend = true;
  showXAxis = true;
  showYAxis = true;
  xAxisLabel = 'Categories';
  yAxisLabel = 'Product Count';

  constructor(
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private chartDataService: ChartDataService
  ) {}

  ngOnInit(): void {
    this.getProductList();
  }

  // Fetch the list of products from the server
  getProductList(category?: string) {
    this.pdtSubscription = this.productService
      .getProducts(category || '')
      .subscribe((response) => {
        this.products = response;
        this.updateChartData(); // Update chart data whenever products are loaded
      });
    this.subscriptions.push(this.pdtSubscription);
  }

  // Transform product data to chart-compatible format
  updateChartData() {
    this.chartData = this.chartDataService.transformToChartData(this.products);
  }

  // Show the Add Product modal
  showAddModal() {
    this.displayAddEditModal = true;
    this.selectedProduct = null;
  }

  // Hide the Add/Edit Product modal
  hideAddModal(isClosed: boolean) {
    this.displayAddEditModal = !isClosed;
  }

  // Save or update the product list after adding/editing a product
  saveorUpdateProductList(newData: any) {
    if (this.selectedProduct && newData.id === this.selectedProduct.id) {
      const productIndex = this.products.findIndex(
        (data) => data.id === newData.id
      );
      this.products[productIndex] = newData;
    } else {
      this.products.unshift(newData);
    }
    this.updateChartData(); // Update chart data after adding/editing
    // this.getProductList();
  }

  // Show the Edit Product modal with the selected product details
  showEditModal(product: Product) {
    this.displayAddEditModal = true;
    this.selectedProduct = product;
  }

  // Delete a product from the list after user confirmation
  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this product?',
      accept: () => {
        this.dltSubscription = this.productService
          .deleteProduct(product.id)
          .subscribe(
            (response) => {
              this.products = this.products.filter(
                (data) => data.id !== product.id
              );
              this.updateChartData(); // Update chart data after deletion
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Deleted Successfully',
              });
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error,
              });
            }
          );
      },
    });
    this.subscriptions.push(this.dltSubscription);
  }

  // Filter products based on the selected category
  getProductsByCategory(category: string) {
    this.getProductList(category);
  }

  // Lifecycle hook: Cleanup subscriptions to prevent memory leaks
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
