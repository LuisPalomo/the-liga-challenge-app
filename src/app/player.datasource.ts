import { DataSource } from '@angular/cdk';
import { MdSort, MdPaginator } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { PlayerDatabase } from 'app/player.database';
import { Player } from './player';

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, PlayerDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class PlayerDataSource extends DataSource<any> {
  constructor(private playerDatabase: PlayerDatabase, private sort: MdSort, private paginator: MdPaginator) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Player[]> {
    const displayDataChanges = [
      this.playerDatabase.dataChange,
      this.sort.mdSortChange,
      this.paginator.page
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      // Grab the page's slice of data.
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return this.getSortedData().splice(startIndex, this.paginator.pageSize);
    });
  }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  getSortedData(): Player[] {
    const data = this.playerDatabase.data.slice();
    if (!this.sort.active || this.sort.direction === '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this.sort.active) {
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'nationality': [propertyA, propertyB] = [a.nationality, b.nationality]; break;
        case 'position': [propertyA, propertyB] = [a.position, b.position]; break;
        case 'jerseyNumber': [propertyA, propertyB] = [a.jerseyNumber, b.jerseyNumber]; break;
        case 'club': [propertyA, propertyB] = [a.club, b.club]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
