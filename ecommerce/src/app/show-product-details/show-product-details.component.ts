import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';

import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '../_model/product.model';
import { MatDialog } from '@angular/material/dialog';
import { ShowProductImgesDialogComponent } from '../show-product-imges-dialog/show-product-imges-dialog.component';
import { ImageProcessingService } from '../image-processing.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-product-details',
  templateUrl: './show-product-details.component.html',
  styleUrls: ['./show-product-details.component.css']
})
export class ShowProductDetailsComponent implements OnInit {
  showTable = false;
  showLoadMoreProductButton = true;
  pageNumber: number = 0;
  ProductDetails: Product[] = [];
  displayedColumns: string[] = ['Id', 'Product Name', 'description', 'Product Discounted Price', 'Product Actual Price', 'Actions'];
  constructor(private productService: ProductService, public imagesDialog: MatDialog, private imageProcessingService: ImageProcessingService, private router: Router) { }

  ngOnInit(): void {
    this.getAllProducts();
  }
  public getAllProducts(searchKey: string = "") {
    this.showTable = false;
    this.productService.getAllProducts(this.pageNumber, searchKey)
      .pipe(
        map((x: Product[], i) => x.map((product: Product) => this.imageProcessingService.createImages(product)))
      )
      .subscribe(
        (resp: Product[]) => {
          // console.log(resp);
          // this.ProductDetails = resp;
          resp.forEach(product => this.ProductDetails.push(product));
          console.log('msg', this.ProductDetails);
          this.showTable = true;
          if (resp.length == 12) {
            this.showLoadMoreProductButton = true;
          } else {
            this.showLoadMoreProductButton = false;
          }
        }, (error: HttpErrorResponse) => {
          console.log(error);
        }
      );
  }
  deleteProduct(productId) {
    this.productService.deleteProduct(productId).subscribe(
      (resp) => {
        this.getAllProducts();

      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );

  }
  showImages(product: Product) {
    console.log(product);

    this.imagesDialog.open(ShowProductImgesDialogComponent, {

      data: {
        images: product.productImages
      },
      height: '500px',
      width: '800px'
    });


  }
  editProductDetails(productId) {
    this.router.navigate(['/addNewProduct', { productId: productId }]);
  }
  loadMoreProduct() {
    this.pageNumber = this.pageNumber + 1;
    this.getAllProducts();
  }
  searchByKeyword(searchKeyword) {
    console.log(searchKeyword);
    this.pageNumber = 0;
    this.ProductDetails = [];
    this.getAllProducts(searchKeyword);
  }
}
