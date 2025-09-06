import { UniqueEntityId } from './unique-entity-id';

export abstract class Entity<Props> {
  protected readonly _id: UniqueEntityId;
  protected props: Props;

  constructor(props: Props, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId();
    this.props = props;
  }

  get id(): UniqueEntityId {
    return this._id;
  }

  equals(entity: Entity<Props>): boolean {
    return this._id.equals(entity._id);
  }
}
