import { Component, OnInit } from '@angular/core';
 import { flyInOut, expand } from '../animations/animation';

@Component({
  selector: 'app-best-seller',
  templateUrl: './best-seller.component.html',
  styleUrls: ['./best-seller.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      expand()
    ]
})
export class BestSellerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
