import { Component, Injector, NgZone, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OrderDetails } from '../_model/order-details.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';
// import * as Razorpay from 'razorpay';

declare var Razorpay: any;
@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrls: ['./buy-product.component.css']
})
export class BuyProductComponent implements OnInit {

  isSingleProductCheckout: string = '';
  productDetails: Product[] = [];

  orderDetails: OrderDetails = {
    fullName: '',
    fullAddress: '',
    contactNumber: '',
    alternateContactNumber: '',
    transactionId: '',
    orderProductQuantityList: []
  }
  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService, private router: Router, private injector: Injector) { }

  ngOnInit(): void {
    this.productDetails = this.activatedRoute.snapshot.data['productDetails'];

    this.isSingleProductCheckout = this.activatedRoute.snapshot.paramMap.get("isSingleProductCheckout");

    this.productDetails.forEach(
      x => this.orderDetails.orderProductQuantityList.push(
        { productId: x.productId, quantity: 1 }
      )
    );

    console.log(this.productDetails)
    console.log(this.orderDetails);
  }
  public placeOrder(orderForm: NgForm) {
    this.productService.placeOrder(this.orderDetails, this.isSingleProductCheckout).subscribe(
      (resp) => {
        console.log(resp);
        orderForm.reset();
        const ngZone = this.injector.get(NgZone);
        ngZone.run(

          () => {
            this.router.navigate(['/orderConfirm'])
          }
        );


      },
      (err) => {
        console.log(err);
      }
    )
  }
  getQuantityForProduct(productId) {
    const filteredProduct = this.orderDetails.orderProductQuantityList.filter(
      (productQuantity) => productQuantity.productId === productId

    );
    return filteredProduct[0].quantity;
  }
  onQuantityChanged(quantity, productId) {
    this.orderDetails.orderProductQuantityList.filter((orderProduct) => orderProduct.productId === productId)[0].quantity = quantity;
  }
  getCalculatedTotal(productId, productDiscountedPrice) {
    const total = this.getQuantityForProduct(productId);
    return total * productDiscountedPrice;
  }
  getCalculatedGrandTotal() {
    let grandtotal = 0;
    this.orderDetails.orderProductQuantityList.forEach(
      (productQuantity) => {
        const price = this.productDetails.filter(product => product.productId === productQuantity.productId)[0].productDiscountedPrice;
        grandtotal = grandtotal + (price * productQuantity.quantity);
      }
    );
    return grandtotal;
  }
  createTransactionAndPlaceOrder(orderForm: NgForm) {
    let amount = this.getCalculatedGrandTotal();
    this.productService.createTransaction(amount).subscribe(
      (response) => {
        console.log(response);
        this.openTransactionModal(response, orderForm);
      },
      (error) => {
        console.log(error);
      }
    );

  }

  openTransactionModal(response: any, orderForm: NgForm) {
    var options = {
      order_id: response.orderId,
      key: response.key,
      amount: response.amount,
      currency: response.currency,
      name: 'StoreMaza',
      description: 'Payment of online shopping',
      image: 'https://img.freepik.com/free-vector/digital-currency-indian-rupee-symbol-golden-coin_1017-42459.jpg?w=740&t=st=1682248867~exp=1682249467~hmac=063ddd760ffbb18539e3fcb728496468213d21f73be05f1455a7aca868b62f22',
      handler: (response: any) => {
        if (response != null && response.razorpay_payment_id != null) {
          this.processResponse(response, orderForm);
        } else {
          alert("Payment failed..")
        }

      },
      prefill: {
        name: 'STOREMAZA',
        email: 'STOREMAZA@GMAIL.COM',
        contact: '2222222222'
      },
      notes: {
        address: 'Online Shopping'
      },
      theme: {
        color: '#F37254'
      }
    };

    var razorPayObject = new Razorpay(options);
    razorPayObject.open();
  }

  processResponse(resp: any, orderForm: NgForm) {
    this.orderDetails.transactionId = resp.razorpay_payment_id;
    this.placeOrder(orderForm);
  }
}
