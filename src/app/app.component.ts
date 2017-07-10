import { Component, OnInit, ViewChild } from '@angular/core';
import { MdSort } from '@angular/material';

import { PlayerService } from "app/player.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  displayedColumns: string[];
  dataSource;

  @ViewChild(MdSort) sort: MdSort;

  constructor(
    private playerService: PlayerService
  ) {
    this.displayedColumns = ['clubSymbol', 'name', 'nationality', 'position', 'jerseyNumber', 'club'];
  }

  ngOnInit(): void {
    this.playerService.getPlayers();
  }
}
