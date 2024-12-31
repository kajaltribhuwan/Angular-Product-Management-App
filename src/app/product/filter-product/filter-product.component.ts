import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-filter-product',
  templateUrl: './filter-product.component.html',
  styleUrls: ['./filter-product.component.css'],
})
export class FilterProductComponent implements OnInit {
  selectedCategory: string = '';
  categories: string[] = [];
  @Output() selectCategory: EventEmitter<string> = new EventEmitter<string>();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  /**
   * Fetches the list of categories from the ProductService.
   * Subscribes to the service's observable and assigns the response to `categories`.
   */
  getCategories() {
    this.productService.getCategories().subscribe((response) => {
      this.categories = response;
      // console.log(response);
    });
  }

  /**
   * Event handler for category selection changes.
   * Emits the selected category to parent components.
   * @param $event - The event object containing the selected category.
   */
  onChangeCategory($event: any) {
    this.selectCategory.emit($event.value);
    // console.log($event.value);
  }
}
