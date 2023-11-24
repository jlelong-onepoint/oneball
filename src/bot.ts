import {Queue} from "./queue";
import {Player} from "./player";
import {Game} from "./game";
import {Geometry, Vector} from "./geometry";

let id = 1;
const MAX_MOVE_CHANGE_PERCENT = 0.05;

export class Bot {
  id = id++;
  key = `key-bot-${this.id}`;
  name = `Bot ${this.id}`;
  player?: Player;
  previousInput = 0.5;

  constructor(queue: Queue) {
    setTimeout(() => {
      queue.processMsg({type: 'joined', name: this.name, key: this.key}, undefined);
    }, 100);
    setTimeout(() => {
      this.queue(queue);
    }, 1000);
  }

  link(player: Player) {
    this.player = player;
  }

  queue(queue: Queue) {
    queue.processMsg({type: 'queue', key: this.key}, undefined);
  }

  newInput(game: Game, queue: Queue) {
    const line = this.player!.defenseLine;
    const ballsSortedByDistance = game.balls
      .map(ball => {
        const ap = [ball.position[0] - line[0][0], ball.position[1] - line[0][1]] as Vector;
        const ab = [line[1][0] - line[0][0], line[0][0] - line[0][1]] as Vector;
        let t = Geometry.dot(ap, ab) / Math.pow(Geometry.vectorNorm(ab), 2);
        t = Math.min(Math.max(0, t), 1);
        const projected = [line[0][0] + t * ab[0], line[0][1] + t * ab[1]] as Vector;
        const pprojected = [projected[0] - ball.position[0], projected[1] - ball.position[1]] as Vector;
        return {
          //ball,
          distance: Geometry.vectorNorm(pprojected),
          intersection: Geometry.getIntersection(this.player!.defenseLine, ball.trajectory(1000)),
          defenseLine: this.player!.defenseLine,
          trajectory: ball.trajectory(1000)
        };
      });
    ballsSortedByDistance.sort((a, b) => a.distance - b.distance);

    const chasingBall = ballsSortedByDistance[0];

    if (chasingBall) {
      const intersection = chasingBall.intersection;
      if (intersection) {
        const coordToUse = intersection[0] === this.player!.defenseLine[0][0] ? 1 : 0;
        const targetPosition = (intersection[coordToUse] - this.player!.defenseLine[0][coordToUse]) / (this.player!.defenseLine[1][coordToUse] - this.player!.defenseLine[0][coordToUse]);

        const targetInput = (this.player!.reverseInput ? 1 - targetPosition : targetPosition);

        const move = this.previousInput > targetInput ?
          this.previousInput - Math.min(MAX_MOVE_CHANGE_PERCENT, this.previousInput - targetInput) :
          this.previousInput + Math.min(MAX_MOVE_CHANGE_PERCENT, targetInput - this.previousInput);

        this.previousInput = move;

        queue.processMsg({type: 'input', key: this.key, input: `${move}`}, undefined);
      }
    }
  }
}