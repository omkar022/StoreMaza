import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Product } from './_model/product.model';
import { Observable, of } from 'rxjs';
import { ProductService } from './_services/product.service';
import { map } from 'rxjs/operators';
import { ImageProcessingService } from './image-processing.service';

@Injectable({
  providedIn: 'root'
})
export class ProductResolveService implements Resolve<Product>{

  constructor(private imageProcesssingService: ImageProcessingService, private productService: ProductService) { }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> {
    const id = route.paramMap.get("productId");
    if (id) {
      return this.productService.getProductDetailsById(id)
        .pipe(
          map(p => this.imageProcesssingService.createImages(p))
        );
    } else {
      return of(this.getProductDetails());
    }

  }
  getProductDetails() {
    return {
      productId: null,
      productName: "",
      productDescription: "",
      productDiscountedPrice: 0,
      productActualPrice: 0,
      productImages: []

    }
  }
}
