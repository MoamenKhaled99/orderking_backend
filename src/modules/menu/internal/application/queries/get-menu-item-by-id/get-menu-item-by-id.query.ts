import { IQuery } from '../../../../../../shared/application/query.interface';

export class GetMenuItemByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}
