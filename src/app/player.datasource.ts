import { DataSource } from '@angular/cdk';
import { MdSort, MdPaginator } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
  _filterChange = new BehaviorSubject<PlayerFilter>({club: '', jerseyNumber: '', name: '', nationality: '', position: ''});
  get filterName(): string { return this._filterChange.value.name; }
  set filterName(filter: string) {
    this._filterChange.value.name = filter;
    this._filterChange.next(this._filterChange.value);
  }
  get filterNationality(): string { return this._filterChange.value.nationality; }
  set filterNationality(filter: string) {
    this._filterChange.value.nationality = filter;
    this._filterChange.next(this._filterChange.value);
  }
  get filterPosition(): string { return this._filterChange.value.position; }
  set filterPosition(filter: string) {
    this._filterChange.value.position = filter;
    this._filterChange.next(this._filterChange.value);
  }
  get filterNumber(): string { return this._filterChange.value.jerseyNumber; }
  set filterNumber(filter: string) {
    this._filterChange.value.jerseyNumber = filter;
    this._filterChange.next(this._filterChange.value);
  }
  get filterClub(): string { return this._filterChange.value.club; }
  set filterClub(filter: string) {
    this._filterChange.value.club = filter;
    this._filterChange.next(this._filterChange.value);
  }

  actualDataLength = 0;

  constructor(private playerDatabase: PlayerDatabase, private sort: MdSort, private paginator: MdPaginator) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Player[]> {
    const displayDataChanges = [
      this.playerDatabase.dataChange,
      this.sort.mdSortChange,
      this.paginator.page,
      this._filterChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      // Obtain the sorted data
      const sortedData = this.getSortedData();
      // Apply each filter to the data
      const filteredData = sortedData.filter((player: Player) => {
        const nameBool: boolean = player.name.toLowerCase().indexOf(this.filterName.toLowerCase()) !== -1,
              nationalityBool: boolean = player.nationality.toLowerCase().indexOf(this.filterNationality.toLowerCase()) !== -1,
              positionBool: boolean = player.position.toLowerCase().indexOf(this.filterPosition.toLowerCase()) !== -1,
              numberBool: boolean = Number(this.filterNumber) ? player.jerseyNumber === Number(this.filterNumber) : true,
              clubBool: boolean = player.club.toLowerCase().indexOf(this.filterClub.toLowerCase()) !== -1;
        return nameBool && nationalityBool && positionBool && numberBool && clubBool;
      });
      this.actualDataLength = filteredData.length;
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return filteredData
        // Grab the paginated slice of data
        .splice(startIndex, this.paginator.pageSize);
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

class PlayerFilter {
  name: string;
  nationality: string;
  position: string;
  jerseyNumber: string;
  club: string;
}
