import { Component, Input, OnInit } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx'
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

import { ActionSheetButton, ActionSheetController, Platform } from '@ionic/angular';

import { Article } from '../../interfaces/index';
import { StorageService } from '../../services/storage.service';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {

  @Input() public article: Article;
  @Input() public index: number;

  constructor(
    private iab: InAppBrowser,
    private plaform: Platform,
    private actionSheetController: ActionSheetController,
    private socialSharing: SocialSharing,
    private storageService: StorageService
  ) { }

  ngOnInit() {}

  openArticle(){

    if(this.plaform.is('ios') || this.plaform.is('android')){
      const browser = this.iab.create(this.article.url);
      browser.show();
      return;
    } else {
      window.open(this.article.url, '_blank');
    }

  }

  async onOpenMenu(){

    const articleInFavorite = this.storageService.articleInFavorite(this.article);

    const normalBtn: ActionSheetButton[] = [
      {
        text: articleInFavorite ? 'Remover Favorito' : 'Favorito',
        icon: articleInFavorite ? 'heart' : 'heart-outline',
        handler: () => this.onToggleFavorite()
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel'
      }
    ]

    const shareBtn: ActionSheetButton = {
      text: 'Compartir',
      icon: 'share',
      handler: () => this.shareArticle()
    };

    if(this.plaform.is('capacitor')) {
        normalBtn.unshift(shareBtn);
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: normalBtn
    });


    await actionSheet.present();

  }

  shareArticle(){

    const {  title, source, url } = this.article;

    console.log('Compartiendo');
    this.socialSharing.share(
      title,
      source.name,
      null,
      url
    );
  }

  onToggleFavorite(){
    console.log('agregando a favorito');
    this.storageService.saveRemoveArticle(this.article);
  }

}
