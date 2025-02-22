import {Geometry, Segment, Vector} from "./geometry";
import {Player} from "./player";
import {CONFIG} from "../browser/common/config";


export class Ball {
  color = '#00FFFF';
  key: string;
  position: Vector = [CONFIG.GLOBAL_WIDTH / 2, CONFIG.GLOBAL_HEIGHT / 2]
  lastBouncePlayer?: Player;
  direction: Vector;
  size: number;

  constructor({key, color}: { key: string, color: string }) {
    this.color = color;
    this.key = key;
    this.size = 3;
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 2;
    this.direction = [speed * Math.cos(angle), speed * Math.sin(angle)];
  }

  randomVelocity() {
    return (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random());
  }

  trajectory(distance = 1): Segment {
    return [this.position, [this.position[0] + this.direction[0] * distance, this.position[1] + this.direction[1] * distance]];
  }

  bounce(player: Player, intersection: Vector, playerBlock: Segment) {
    this.lastBouncePlayer = player;
    this.position = intersection;

    // Determine new velocity
    const previousVelocity = Geometry.vectorNorm(this.direction);
    const coordToUse = intersection[0] === playerBlock[0][0] ? 1 : 0;
    const intersectPercent = (intersection[coordToUse] - playerBlock[0][coordToUse]) / (playerBlock[1][coordToUse] - playerBlock[0][coordToUse]) * 0.9 + 0.05;
    const blockVector = [playerBlock[1][0] - playerBlock[0][0], playerBlock[1][1] - playerBlock[0][1]] as Vector;
    const blockAngle = -1 * ((Math.acos(Geometry.dot([0, 1], blockVector) / (Geometry.vectorNorm([0, 1]) * Geometry.vectorNorm(blockVector))) * (blockVector[0] < 0 ? -1 : 1)) - Math.PI / 2);
    const reboundAngle = Math.PI * (1 - intersectPercent);
    const angle = reboundAngle + blockAngle;
    const newVelocity = previousVelocity * CONFIG.ACCELERATION_FACTOR;
    const dx = Math.cos(angle) * newVelocity;
    const dy = Math.sin(angle) * newVelocity;
    this.direction = Geometry.limitToMax([dx, dy], CONFIG.MAX_SPEED);
    this.move(0.001);
  }

  move(percent = 1) {
    this.position[0] += this.direction[0] * percent;
    this.position[1] += this.direction[1] * percent;
  }

  state() {
    return {
      position: this.position,
      color: this.color,
      size: this.size
    };
  }

  checkOutsideBounds() {
    return this.position[0] < 0 || this.position[1] < 0 || this.position[0] > CONFIG.GLOBAL_WIDTH || this.position[1] > CONFIG.GLOBAL_HEIGHT;
  }
}