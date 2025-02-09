export const CONFIG = {
  // TODO Allow this to be defined as variable environment
  PATH: '/tmp/oneball-save.json',
  MAX_MOVE_CHANGE_PERCENT: 0.01,
  VISION_DISTANCE: 400,
  GAME_LOOP_MS: 10,
  GLOBAL_HEIGHT: 2000,
  GLOBAL_WIDTH: 2000,
  ACCELERATION_FACTOR: 1.5,
  MAX_PLAYERS: 8,
  MIN_PLAYERS: 3,
  QUEUE_TIME: 2,
  RETRY_TIME: 10,
  BOTS: 0,
  SERVER_PORT: 8080,
  WSS_PORT: 8081,
  WSS_EXTERNAL_URL: 'ws://localhost:8081',
  AUTO_RECONNECT_DELAY: 100,
  ACTIVITY_TIMEOUT: 1000 * 60 * 5,
  MAX_SPEED: 35
};