import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';

import { NewsService } from '../../services/news.service';
import { Article } from '../../interfaces/index';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  @ViewChild(IonInfiniteScroll, {static:true}) IonInfiniteScroll: IonInfiniteScroll;

  public article: Article[] = [];

  constructor(
    private newsService: NewsService
  ){}

  ngOnInit(){
    this.obtenerArticulos();
  }

  obtenerArticulos(){
    this.newsService.getTopHeadlines().subscribe(articles => {
      this.article = articles;
    });
  }

  loadData() {
    this.newsService.getTopHeadLinesCategory( 'business', true )
      .subscribe( articles => {
        
          if ( articles.length === this.article.length ) {
            this.IonInfiniteScroll.disabled = true;
            // event.target.disabled = true;
            return;
          }


          this.article = articles;
          this.IonInfiniteScroll.complete();
          // event.target.complete();    
         

        })

    }

}
