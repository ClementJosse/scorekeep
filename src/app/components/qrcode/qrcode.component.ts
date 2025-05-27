import { Component } from '@angular/core';
import { QrCodeComponent } from 'ng-qrcode';

@Component({
  selector: 'app-qrcode',
  standalone: true,
  imports: [QrCodeComponent],
  templateUrl: './qrcode.component.html',
  styleUrl: './qrcode.component.css'
})
export class QrcodeComponent {

}
