import { Component, OnInit, ViewChild } from '@angular/core';
import { MdSort } from '@angular/material';

import { PlayerService } from 'app/player.service';
import { PlayerDatabase } from 'app/player.database';
import { PlayerDataSource } from 'app/player.datasource';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  /** Columns that will be displayed in the table. */
  displayedColumns: string[];
  /** Player database that the data source uses to retrieve data for the table. */
  playerDatabase: PlayerDatabase;
  dataSource: PlayerDataSource | null;

  @ViewChild(MdSort) sort: MdSort;

  constructor(
    private playerService: PlayerService
  ) {
    this.displayedColumns = ['clubSymbol', 'name', 'nationality', 'position', 'jerseyNumber', 'club'];
    this.playerDatabase = new PlayerDatabase(playerService);
  }

  ngOnInit() {
    this.dataSource = new PlayerDataSource(this.playerDatabase, this.sort);
  }

}


