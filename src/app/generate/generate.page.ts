import { Component, OnInit } from '@angular/core';
import {CommonModule, PlatformLocation} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule, Platform} from '@ionic/angular';
import { QRCodeModule } from 'angularx-qrcode';
import { Clipboard } from '@capacitor/clipboard';
import {
  IonAlert,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonModal,
  IonTextarea
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-generate',
  templateUrl: './generate.page.html',
  styleUrls: ['./generate.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, QRCodeModule, IonButton, IonList, IonItem, IonInput, IonModal, IonTextarea, IonLabel, IonLoading, IonAlert]
})
export class GeneratePage implements OnInit {
  protected firstName: string | null = 'John'; // = null
  protected lastName: string | null = 'Doe'; // = null
  protected email: string | null = 'john@example.com'; // = null
  protected telephone: string | null = '+123 123 123 123'; // = null
  protected link: string | null = null
  protected supportsCopy: boolean = false
  protected supportsNfc: boolean = false
  protected writingNfc: boolean = false
  protected nfcAlertMessage: string | null = null
  protected clipboardAlertMessage: string | null = null

  constructor(private platformLocation: PlatformLocation,
              private platform: Platform) { }

  ngOnInit() {
    this.supportsCopy = !!(typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) || this.platform.is('capacitor');
    this.supportsNfc = 'NDEFReader' in window;
  }

  generateLink() {
    let link = this.platformLocation.protocol+'//'+this.platformLocation.hostname;
    if(this.platformLocation.port)
      link += ':'+this.platformLocation.port;
    link += '/card#';

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
      this.clipboardAlertMessage = 'Copied to clipboard!';
    }catch (e) {
      console.error(e);
      // @ts-ignore
      this.clipboardAlertMessage = e.message;
    }
  }

  async writeNfc() {
    const abortController = new AbortController();
    abortController.signal.onabort = event => {
      this.writingNfc = false;
    };

    this.writingNfc = true;
    let t = setTimeout(() => {
      if(this.writingNfc) {
        abortController.abort();
        this.nfcAlertMessage = "No tag found to write!";
        abortController.abort();
      }
    }, 5000);
    try {
      // @ts-ignore
      const ndef = new NDEFReader();
      await ndef.write({
        records: [{recordType: "url", data: this.link!}]
      }, { signal: abortController.signal });
      this.writingNfc = false;
      this.nfcAlertMessage = "Tag written!";
    } catch(e) {
      if(this.writingNfc) {
        // @ts-ignore
        this.nfcAlertMessage = e.message;
      }

      this.writingNfc = false;
      console.error(e);
    }
    clearTimeout(t);
    this.writingNfc = false;
  }
}
