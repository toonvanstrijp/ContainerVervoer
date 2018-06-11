
export class Container {
  private _id = null;
  private _cooled = false;
  private _valuable = false;
  private _weight = 0;

  get id() {
    return this._id;
  }

  get cooled() {
    return this._cooled;
  }

  set cooled(value: boolean) {
    this._cooled = value;
  }

  get valuable() {
    return this._valuable;
  }

  set valuable(value: boolean) {
    this._valuable = value;
  }

  get weight() {
    return this._weight;
  }

  set weight(value: number) {
    this._weight = value;
  }

  constructor(id: number, weight: number, cooled: boolean = false, valuable: boolean = false) {
    this._id = id;
    this._weight = weight;
    this._cooled = cooled;
    this._valuable = valuable;
  }
}
