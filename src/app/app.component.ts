import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MdSort, MdPaginator } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';

import { PlayerService } from 'app/player.service';
import { PlayerDatabase } from 'app/player.database';
import { PlayerDataSource } from 'app/player.datasource';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  /** Columns that will be displayed in the table. */
  displayedColumns: string[];
  /** Player database that the data source uses to retrieve data for the table. */
  playerDatabase: PlayerDatabase;
  dataSource: PlayerDataSource | null;
  /** List with the filters subscriptions, needed to unsuscribe at component onDestroy. */
  private subscriptions: Subscription[];

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild('filterName') filterName: ElementRef;
  @ViewChild('filterNationality') filterNationality: ElementRef;
  @ViewChild('filterPosition') filterPosition: ElementRef;
  @ViewChild('filterNumber') filterNumber: ElementRef;
  @ViewChild('filterClub') filterClub: ElementRef;

  constructor(
    private playerService: PlayerService
  ) {
    this.displayedColumns = ['clubSymbol', 'name', 'nationality', 'position', 'jerseyNumber', 'club'];
    this.playerDatabase = new PlayerDatabase(playerService);
    this.subscriptions = [];
  }

  ngOnInit() {
    this.dataSource = new PlayerDataSource(this.playerDatabase, this.sort, this.paginator);
    // Observables that handle filters changes
    this.subscriptions.push(Observable.fromEvent(this.filterName.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) { return; }
        this.dataSource.filterName = this.filterName.nativeElement.value;
      }));
    this.subscriptions.push(Observable.fromEvent(this.filterNationality.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) { return; }
        this.dataSource.filterNationality = this.filterNationality.nativeElement.value;
      }));
    this.subscriptions.push(Observable.fromEvent(this.filterPosition.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) { return; }
      this.dataSource.filterPosition = this.filterPosition.nativeElement.value;
    }));
    this.subscriptions.push(Observable.fromEvent(this.filterNumber.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) { return; }
      this.dataSource.filterNumber = this.filterNumber.nativeElement.value;
    }));
    this.subscriptions.push(Observable.fromEvent(this.filterClub.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) { return; }
      this.dataSource.filterClub = this.filterClub.nativeElement.value;
    }));
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions to free browser memory
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
