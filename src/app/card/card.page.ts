import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {  ActivatedRoute, Router } from '@angular/router';
import {IonButton, IonCard, IonCardContent, IonInput, IonItem, IonList, IonModal} from "@ionic/angular/standalone";

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, IonCardContent, IonCard, IonButton, IonModal, IonList, IonItem, IonInput]
})
export class CardPage implements OnInit {
  protected encodedBusinessCard: string | null = null
  protected businessCard: null | { f:string, l:string, e:string, t:string } = null
  protected isModalOpen = false;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.encodedBusinessCard = this.route.snapshot.fragment;

    if(this.encodedBusinessCard != null){
      try {
        this.businessCard = JSON.parse(atob(this.encodedBusinessCard));
      } catch (e) {
        console.error(e);
        this.businessCard = null;
      }
    }

    if(this.businessCard != undefined) {
      this.isModalOpen = true;
    }
  }

  async canDismiss(data?: any, role?: string) {
    return role === undefined;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  onDismiss() {
    this.isModalOpen = false;
  }

  addToContacts() {
    let card = "BEGIN:VCARD\n";
    card += "VERSION:4.0\n";
    card += "FN:"+this.businessCard?.f+" "+this.businessCard?.l+"\n";
    card += "N:"+this.businessCard?.l+";"+this.businessCard?.f+";;;\n";
    if(this.businessCard?.e != undefined)
      card += "EMAIL:"+this.businessCard?.e+"\n";
    if(this.businessCard?.t != undefined)
      card += "TEL:"+this.businessCard?.t+"\n";
    card += "END:VCARD";

    // @ts-ignore
    window.location = "data:text/vcard;base64,"+btoa(card);
  }
}
