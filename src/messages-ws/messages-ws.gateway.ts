import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dtos/new-messages.dto';
import { JwtPayload } from '../auth';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) { }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    // console.log({ payload });
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedCLients());

  };

  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado', client.id);
    this.messagesWsService.removeClient(client.id);

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedCLients());
  };

  @SubscribeMessage('message-form-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {

    // ! Emite unicamente al cliente que lo realiza
    // client.emit('message-form-server', {
    //   fullName: 'Soy YO!!',
    //   message: payload.message || 'no-message'
    // });

    // ! Emite al resto de Clientes, pero excluye al que lo realza
    // client.broadcast.emit('message-form-server', {
    //   fullName: this.messagesWsService.getUserFullName(client.id),
    //   message: payload.message || 'no-message'
    // });

    //!Emite a TODOS los usuarios 
    this.wss.emit('message-form-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message'
    });
  };

};
