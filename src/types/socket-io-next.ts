import { ExtendedError } from 'socket.io/dist/namespace';

export default interface SocketIoNextFunction {
  (err?: ExtendedError | undefined): void;
}
