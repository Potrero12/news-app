import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';

import { NewsService } from '../../services/news.service';
import { Article } from '../../interfaces/index';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  @ViewChild(IonInfiniteScroll, {static:true}) IonInfiniteScroll: IonInfiniteScroll;

  public categories: string[] = ['business' ,'entertainment' ,'general' ,'health' ,'science' ,'sports' ,'technology'];
  public selectedCategory: string = this.categories[0];
  public article: Article[] = [];
  // public categoriStorage;

  constructor(
    private newsService: NewsService
  ) {}

  ngOnInit(): void {
    // this.categoriStorage  = localStorage.getItem('category');
    this.newsService.getTopHeadLinesCategory(this.selectedCategory).subscribe((articles) => {
      this.article = [...articles];
    })
  }

  segmentChanged(event: Event){

    this.selectedCategory = (event as CustomEvent).detail.value;
    this.newsService.getTopHeadLinesCategory(this.selectedCategory).subscribe((articles) => {
      this.article = [...articles];
    })
    // localStorage.setItem('category', event.detail.value);
  }

  loadData(){
    this.newsService.getTopHeadLinesCategory(this.selectedCategory, true).subscribe((articles) => {

      if(this.article.length === articles.length) {
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
