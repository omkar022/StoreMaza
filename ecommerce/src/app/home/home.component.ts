import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { map } from 'rxjs/operators';
import { Product } from '../_model/product.model';
import { ImageProcessingService } from '../image-processing.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  pageNumber: number = 0;
  ProductDetails: Product[] = [];
  showLoadButton = false;
  constructor(private imageProcessingService: ImageProcessingService, private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.getAllProducts();
  }
  public getAllProducts(searchKey: string = "") {
    this.productService.getAllProducts(this.pageNumber, searchKey)
      .pipe(
        map((x: Product[], i) => x.map((product: Product) => this.imageProcessingService.createImages(product)))
      )
      .subscribe(
        (resp: Product[]) => {
          console.log(resp);
          if (resp.length == 12) { this.showLoadButton = true; } else { this.showLoadButton = false; }
          resp.forEach(p => this.ProductDetails.push(p));
          // this.ProductDetails = resp;
        }, (error: HttpErrorResponse) => {
          console.log(error);
        }
      );
  }
  showproductDetails(productId) {
    this.router.navigate(['/productViewDetails', { productId: productId }])

  }
  public loadMoreProduct() {
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
