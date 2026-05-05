import { ICommand } from '../../../../../../shared/application/command.interface';

export class UpdateOrderStatusCommand implements ICommand {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
    public readonly newStatus: string,
  ) {}
}
