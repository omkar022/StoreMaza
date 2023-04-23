import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileHandle } from '../_model/file-handle.model';

@Component({
  selector: 'app-show-product-imges-dialog',
  templateUrl: './show-product-imges-dialog.component.html',
  styleUrls: ['./show-product-imges-dialog.component.css']
})
export class ShowProductImgesDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.receiveImages();
  }
  receiveImages() {
    console.log(this.data);
  }
}
