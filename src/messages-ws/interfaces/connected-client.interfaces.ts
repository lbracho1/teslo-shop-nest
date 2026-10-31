import { Socket } from "socket.io";
import { User } from "../../auth";

export interface ConnectedClient {
    [id: string]: {
        socket: Socket,
        user: User,
    }
};