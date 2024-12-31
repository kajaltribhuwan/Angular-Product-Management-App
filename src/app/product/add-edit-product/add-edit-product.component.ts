import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css'],
})
export class AddEditProductComponent implements OnChanges {
  @Input() displayAddEditModal: boolean = true;
  @Input() selectedProduct: any = null;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAddEdit: EventEmitter<any> = new EventEmitter<any>();
  modalType = 'Add';

  // Reactive form for product details
  productForm = this.fb.group({
    title: ['', Validators.required],
    price: [0, Validators.required],
    description: [''],
    category: ['', Validators.required],
    image: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private messageService: MessageService
  ) {}

  /**
   * Lifecycle hook called whenever input properties change.
   * Updates the form and modal type based on the selectedProduct input.
   */
  ngOnChanges(): void {
    if (this.selectedProduct) {
      this.modalType = 'Edit';
      this.productForm.patchValue(this.selectedProduct);
    } else {
      this.productForm.reset();
      this.modalType = 'Add';
    }
  }

  /**
   * Closes the modal, resets the form, and emits a close event to the parent component.
   */
  closeModal() {
    this.productForm.reset();
    this.clickClose.emit(true);
  }

  /**
   * Handles adding or editing a product.
   * Sends form data to the ProductService and notifies the parent component of the changes.
   */
  addEditProduct() {
    // console.log(this.productForm.value);
    this.productService
      .addEditProduct(this.productForm.value, this.selectedProduct)
      .subscribe(
        (response) => {
          this.clickAddEdit.emit(response);
          this.closeModal();
          const msg =
            this.modalType === 'Add' ? 'Product added' : 'Product updated';
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: msg,
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error Occured',
          });
          console.log('Error occured');
        }
      );
  }
}
