import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PlayerService } from 'app/player.service';
import { Player } from './player';

export class PlayerDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([]);
  get data(): Player[] { return this.dataChange.value; }

  constructor(
    private playerService: PlayerService
  ) {
    this.playerService.getPlayers().then(response => this.dataChange.next(response));
  }

}
