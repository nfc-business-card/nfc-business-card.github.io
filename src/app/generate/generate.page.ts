import { Component, OnInit } from '@angular/core';
import {CommonModule, PlatformLocation} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {ActivatedRoute, Router} from "@angular/router";
import { QRCodeModule } from 'angularx-qrcode';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.page.html',
  styleUrls: ['./generate.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, QRCodeModule]
})
export class GeneratePage implements OnInit {
  protected firstName: string | null = 'John'; // = null
  protected lastName: string | null = 'Doe'; // = null
  protected email: string | null = 'john@example.com'; // = null
  protected telephone: string | null = '+123 123 123 123'; // = null
  protected link: string | null = null
  protected supportsCopy: boolean = false

  constructor(private router: Router,
              private route: ActivatedRoute,
              private platformLocation: PlatformLocation) { }

  ngOnInit() {
    this.supportsCopy = !!(typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText);
  }

  generateLink() {
    let link = this.platformLocation.protocol+'//'+this.platformLocation.hostname+':'+this.platformLocation.port+'/card#';

    link += btoa(JSON.stringify({
      f: this.firstName,
      l: this.lastName,
      e: this.email,
      t: this.telephone,
    }));

    this.link = link;
  }

  async copyToClipboard() {
    try{
      await Clipboard.write({
        string: this.link!
      });
      alert('Copied to clipboard!');
    }catch (e) {
      console.error(e);
      // @ts-ignore
      alert(e.message);
    }
  }
}
