import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';

import { SearchConfig } from '../../models/search-config';
import { SearchQuery } from '../../models/search-query';
import { StoreFinderService } from '../../services/store-finder.service';

import * as fromStore from '../../store';
import { filter, map } from 'rxjs/operators';
import { LongitudeLatitude } from '../../models/longitude-latitude';

@Component({
  selector: 'cx-store-finder-search-result',
  templateUrl: './store-finder-search-result.component.html',
  styleUrls: ['./store-finder-search-result.component.scss']
})
export class StoreFinderSearchResultComponent implements OnInit {
  locations: any;
  searchQuery: SearchQuery;
  locations$: Observable<any>;
  isLoading$: Observable<any>;
  geolocation: LongitudeLatitude;
  searchConfig: SearchConfig = {
    currentPage: 0
  };

  constructor(
    private store: Store<fromStore.StoresState>,
    private storeFinderService: StoreFinderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => this.initialize(params));
  }

  viewPage(pageNumber: number) {
    this.searchConfig = { ...this.searchConfig, currentPage: pageNumber };
    this.store.dispatch(
      new fromStore.FindStores({
        queryText: this.searchQuery.queryText,
        longitudeLatitude: this.geolocation,
        searchConfig: this.searchConfig
      })
    );
  }

  private initialize(params: Params) {
    this.searchQuery = this.parseParameters(params);
    this.storeFinderService.findStores(
      this.searchQuery.queryText,
      this.geolocation,
      this.searchQuery.useMyLocation
    );

    this.isLoading$ = this.store.pipe(select(fromStore.getStoresLoading));
    this.locations$ = this.store.pipe(select(fromStore.getFindStoresEntities));
    this.locations$.pipe(map(data => data.geolocation),
      filter(geoData => geoData != null)).subscribe(geoData => this.geolocation = {
        longitude: geoData.coords.longitude,
        latitude: geoData.coords.latitude
      });
  }

  private parseParameters(queryParams: { [key: string]: any }): SearchQuery {
    let searchQuery: SearchQuery;

    if (queryParams.query) {
      searchQuery = { queryText: queryParams.query };
    } else {
      searchQuery = { queryText: '' };
    }

    if (queryParams.latitude && queryParams.longitude) {
      searchQuery.longitudeLatitude = {
        latitude: queryParams.latitude,
        longitude: queryParams.longitude
      };
    }

    searchQuery.useMyLocation = queryParams.useMyLocation === '1';

    return searchQuery;
  }
}
