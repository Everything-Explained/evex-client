import { MsgPriorityText as MsgPriorityText } from './components/message/_message';

export interface SockClient {
  alias: string;
  id: string;
  avatar: string;
}

export enum ClientEvent {
  AUTHFAIL    = 'auth-fail',
  AUTHSUCCESS = 'auth-success',
  PING        = 'clt-ping',
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
  PONG = 'srv-pong',
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




  constructor(private url: string, private rid: string) {
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
      forceNew: true, reconnection: false, query: { test: 'O2OP4C4HSK' }}
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
      .on(ClientEvent.AUTHFAIL, msg => this.authFailed(msg))
      .on(ClientEvent.AUTHSUCCESS, user => this.authSuccess(user))
    ;
  }


  disconnect() {
    this.forceClosed = true;
    this.sock.close();
  }




  private onRoomSetup(name: string, tag: string, clients: any) {
    this.emit(ClientEvent.ROOMSETUP, name, tag, clients);
  }


  private onConnection() {
    this.sock.emit(ServerEvent.SHAKE, this.rid)
    this.sendServerMsg(
      'Connected Successfully',
      MsgPriorityText.LOW
    );
  }


  private onDisconnect() {
    if (this.forceClosed) {
      this.forceClosed = false;
      return this.sendClientMsg('Closed Connection');
    }

    return this.sendServerMsg(
      'Closed Connection',
      MsgPriorityText.HIGH
    );
  }


  private onError(error: Error) {
    if (~error.message.indexOf('xhr poll error')) {
      return this.sendClientMsg(
        'Cannot Connect to Server',
        MsgPriorityText.HIGH
      )
    }
    this.sendServerMsg(error.message, MsgPriorityText.HIGH);
  }


  private authSuccess(user: SockClient) {
    this.emit(ClientEvent.AUTHSUCCESS, user);
  }


  private authFailed(content: string) {
    this.sendServerMsg(content, MsgPriorityText.HIGH);
  }


  private sendServerMsg(content: string, priority: MsgPriorityText) {
    this.emit(
      ClientEvent.SERVERMSG,
      content,
      priority
    )
  }


  private sendClientMsg(content: string, priority = MsgPriorityText.LOW) {
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