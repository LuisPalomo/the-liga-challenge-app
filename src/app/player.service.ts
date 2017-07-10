import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Player } from './player';

import 'rxjs/add/operator/toPromise';

/**
 * API constants
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
    const headers = new Headers({ 'X-Auth-Token': authToken });
    const options = new RequestOptions({ headers: headers });
    // Main promise that will retrieve the list of players
    const mainPromise: Promise<Player[]> = new Promise((resolve, reject) => {
      // Request of the list of teams
      this.http.get(apiUrl, options)
      .toPromise()
      .then((response) => {
        // We retrieve the list of all teams, now we need to retrieve the players from each team
        const playerList: Player[] = [];
        const promiseList: Promise<any>[] = [];
        let playersPromise: Promise<any>;
        for (const team of response.json().teams) {
          if (team._links && team._links.players) {
            // Request of the players from this team
            playersPromise = this.http.get(team._links.players.href, options).toPromise();
            playersPromise.then((playersResponse) => {
              for (const player of playersResponse.json().players) {
                // Add each player of the team to the list of players
                playerList.push({
                  club: team.name,
                  clubSymbol: team.crestUrl,
                  jerseyNumber: player.jerseyNumber,
                  name: player.name,
                  nationality: player.nationality,
                  position: player.position
                });
              }
            });
            promiseList.push(playersPromise);
          }
        }
        // When all player promises are resolved, resolve the main promise with the player list;
        // if any of them fails, reject the main promise
        Promise.all(promiseList).then(
          () => resolve(playerList),
          () => reject('Some player request failed')
        );
      }).catch(() => console.log('Error retrieving players!'));
    });

    return mainPromise;
  }

}
