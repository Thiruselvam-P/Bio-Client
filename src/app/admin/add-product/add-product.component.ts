import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  standalone: false,
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  loading = false;
  isEdit = false;
  productId?: string;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      category: ['Kitchenware', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      availability: [true]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.productId = id;
      this.productService.getProduct(id).subscribe(data => {
        this.productForm.patchValue(data);
        if (data.imageUrl) {
          this.imagePreview = `https://bio-backend.onrender.com/uploads/${data.imageUrl}`;
        }
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.productForm.invalid) return;
    this.loading = true;

    const formData = new FormData();
    formData.append('productName', this.productForm.get('productName')?.value);
    formData.append('category', this.productForm.get('category')?.value);
    formData.append('description', this.productForm.get('description')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('availability', this.productForm.get('availability')?.value);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const request = this.isEdit
      ? this.productService.updateProduct(this.productId!, formData)
      : this.productService.createProduct(formData);

    request.subscribe({
      next: () => this.router.navigate(['/admin/products']),
      error: () => this.loading = false
    });
  }
}
