import { ICommand } from './command.interface';

export abstract class CommandHandlerBase<TCommand extends ICommand, TResponse> {
  abstract handle(command: TCommand): Promise<TResponse>;
}
