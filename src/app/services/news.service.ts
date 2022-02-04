import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { Observable, of } from 'rxjs';

import { RespuestaTopHeadlines, Article, ArticleByCategoryAndPage } from '../interfaces/index';

import { map } from 'rxjs/operators';
import { storedArticlesByCategory } from '../data/mock-news';


const apiKey = environment.api_key;
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private ArticleByCategoryAndPage: ArticleByCategoryAndPage = storedArticlesByCategory;

  constructor(
    private http: HttpClient
  ){ }

  private executeQuery<T>( endpoint: string ) {
    console.log('Petición HTTP realizada');
    return this.http.get<T>(`${ apiUrl }${ endpoint }`, {
      params: { 
        apiKey: apiKey,
        country: 'co',
      }
    })
  }

  getTopHeadlines():Observable<Article[]> {

    return this.getTopHeadLinesCategory('business');
    // return this.executeQuery<NewsResponse>(`/top-headlines?category=business`)
    //   .pipe(
    //     map( ({ articles }) => articles )
    //   );

  }

  getTopHeadLinesCategory( category: string, loadMore: boolean = false ):Observable<Article[]> {

    return of(this.ArticleByCategoryAndPage[category].articles);

    if ( loadMore ) {
      return this.getArticlesByCategory( category );
    }

    if ( this.ArticleByCategoryAndPage[category] ) {
      return of(this.ArticleByCategoryAndPage[category].articles);
    }

    return this.getArticlesByCategory( category );
   
  }

  //metodo para evitar llamar la peticion cada ves que entramos a un tab, page que ya conoscamos
  private getArticlesByCategory( category: string ): Observable<Article[]> {

    if ( Object.keys( this.ArticleByCategoryAndPage ).includes(category) ) {
      // Ya existe
      // this.articlesByCategoryAndPage[category].page += 0;
    } else {
      // No existe
      this.ArticleByCategoryAndPage[category] = {
        page: 0,
        articles: []
      }
    }

    const page = this.ArticleByCategoryAndPage[category].page + 1;

    return this.executeQuery<RespuestaTopHeadlines>(`/top-headlines?category=${ category }&page=${ page }`)
    .pipe(
      map( ({ articles }) => {

        if ( articles.length === 0 ) return this.ArticleByCategoryAndPage[category].articles;

        this.ArticleByCategoryAndPage[category] = {
          page: page,
          articles: [ ...this.ArticleByCategoryAndPage[category].articles, ...articles ]
        }

        return this.ArticleByCategoryAndPage[category].articles;
      })
    );
  

  }
}
