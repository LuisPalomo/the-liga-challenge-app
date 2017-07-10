import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";

import { Player } from './player';

import 'rxjs/add/operator/toPromise';

/**
 * API url
 */
const apiUrl = 'http://api.football-data.org/v1/soccerseasons/399/teams';
const authToken = 'f7f2051260a8417b8eae9fb4de617af3';

@Injectable()
export class PlayerService {

  constructor(
    private http: Http
  ) { }

  getPlayers(): Promise<Player[]> {
    // Request options with the auth token
    let headers = new Headers({ 'X-Auth-Token': authToken });
    let options = new RequestOptions({ headers: headers });
    // Promise with the list of players
    let promise: Promise<Player[]> = new Promise((resolve, reject) => {
      this.http.get(apiUrl, options)
      .toPromise()
      .then((response) => {
        // We retrieve the list of all teams, now we need to retrieve the players of each team
        let playerList: Player[] = [];
        let promiseList = [];
        for(let team of response.json().teams) {

        }
      }).catch(() => console.log('Error retrieving players!'));
    });

    return promise;
  }

}
