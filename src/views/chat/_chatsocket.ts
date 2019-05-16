import { MsgPriorityText as MsgPriorityText } from './components/message/_message';
import { Timer } from '@/libs/timer';

export interface SockClient {
  alias: string;
  id: string;
  avatar: string;
}

export enum ClientEvent {
  AUTHFAIL    = 'auth-fail',
  AUTHSUCCESS = 'auth-success',
  PONG        = 'clt-pong',
  SERVERMSG   = 'srv-message',
  CLIENTMSG   = 'clt-message',
  ROOMSETUP   = 'setup-room',
}

export enum RoomEvent {
  MESSAGE = '-rm-message',
  EMOTE   = '-rm-emote',
  NOTICE  = '-rm-notice',
  TYPING  = '-rm-typing',
  LEAVE   = '-rm-leave',
  JOINED  = '-rm-joined'
}

export enum ServerEvent {
  SHAKE = 'hand-shake',
  PING = 'srv-ping',
  IDLE = 'state-idle',
  ACTIVE = 'state-active'
}


interface SockEvent {
  ev: string;
  exec: ((...args: any[]) => void)[];
}

export interface RoomSock {
  tag: string;
  on: (event: RoomEvent, func: (...args: any[]) => void) => RoomSock;
  emit: (event: RoomEvent, ...args: any[]) => void;
}


export default class ChatSocket {

  private sock!: SocketIOClient.Socket;
  private events: SockEvent[] = [];

  private forceClosed = false;
  private pingStart = 0;

  private _latencies: number[] = [];

  get latency() {
    const ltcyArr = this._latencies;
    const latencyAvg =
      ltcyArr.reduce((a, v) => a + v, 0) / ltcyArr.length;
    ;
    return Math.round(latencyAvg);
  }




  constructor(
    private url: string,
    private rid: string,
    private timer: Timer
  ) {
    this.connect();
  }




  createRoomHandle(tag: string): RoomSock {
    const obj = {
      tag,

      on: (
        event: RoomEvent,
        func: (...args: any[]) => void
      ) => {
        this.sock.on(`${tag + event}`, (...subargs: any[]) => func(...subargs))
        return obj;
      },

      emit: (
        event: RoomEvent,
        ...args: any[]
      ) => {
        this.sock.emit(`${tag + event}`, ...args);
      }
    }
    return obj;
  }


  on(name: ClientEvent, func: (...args: any[]) => void) {
    const event = this.events.find(v => v.ev == name);

    if (event) {
      event.exec.push(func);
    }
    else {
      this.events.push({
        ev: name,
        exec: [func]
      });
    }
    return this;
  }


  connect() {
    this.sock = io(this.url, {
      forceNew: true, reconnection: false, query: { test: 'SZ6W9GRQMI' }}
    );

    this.sock
      .on('connect', () => this.onConnection())
      .on('disconnect', () => this.onDisconnect())
      .on('connect_error', err => this.onError(err))
      .on('connect_timeout', err => this.onError(err))
      .on(
        ClientEvent.ROOMSETUP,
        (name, tag, clients) => this.onRoomSetup(name, tag, clients)
      )
      .on(ClientEvent.SERVERMSG, msg => this.emit(ClientEvent.SERVERMSG, msg))
      .on(ClientEvent.AUTHFAIL, msg => this.authFailed(msg))
      .on(ClientEvent.AUTHSUCCESS, user => this.authSuccess(user))
      .on(ClientEvent.PONG, () => this.onPong())
    ;
  }


  disconnect() {
    this.forceClosed = true;
    this.sock.close();
  }




  private onRoomSetup(name: string, tag: string, clients: any) {
    this.emit(ClientEvent.ROOMSETUP, name, tag, clients);
  }


  private onPong() {
    if (this._latencies.length >= 30) {
      this._latencies.shift();
    }
    this._latencies.push(Date.now() - this.pingStart);
    console.debug('latencies', this._latencies);
  }


  private onConnection() {
    this.sock.emit(ServerEvent.SHAKE, this.rid)
  }


  private onDisconnect() {
    if (this.forceClosed) {
      this.forceClosed = false;
      return this.emitClientMsg('Closed Connection');
    }

    return this.emitServerMsg(
      'Closed Connection',
      MsgPriorityText.HIGH
    );
  }


  private onError(error: Error) {
    if (~error.message.indexOf('xhr poll error')) {
      return this.emitClientMsg(
        'Cannot Connect to Server',
        MsgPriorityText.HIGH
      )
    }
    this.emitServerMsg(error.message, MsgPriorityText.HIGH);
  }


  private authSuccess(user: SockClient) {
    this.emit(ClientEvent.AUTHSUCCESS, user);
    this.setupPingTimer();
    this.timer.start();
  }


  private setupPingTimer() {
    this.timer.add({
      name: 'ping',
      time: 3,
      interval: true,
      exec: () => {
        this.pingStart = Date.now();
        this.sock.emit(ServerEvent.PING, this.latency)
      }
    })
    this.pingStart = Date.now();
    this.sock.emit(ServerEvent.PING, 0);
  }


  private authFailed(content: string) {
    this.emitServerMsg(content, MsgPriorityText.HIGH);
  }


  private emitServerMsg(content: string, priority: MsgPriorityText) {
    this.emit(
      ClientEvent.SERVERMSG,
      content,
      priority
    )
  }


  private emitClientMsg(content: string, priority = MsgPriorityText.LOW) {
    this.emit(
      ClientEvent.CLIENTMSG,
      content,
      priority
    )
  }


  private emit(name: ClientEvent, ...args: any[]) {
    const event = this.events.find(v => v.ev == name);

    if (event) {
      event.exec.forEach(f => f(...args))
    }
  }



}