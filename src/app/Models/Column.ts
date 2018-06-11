import {Container} from './Container';

export class Column {

  public containers: Container[] = [];

  /**
   * returns the total mass of a column
   * @returns {number}
   */
  get weight(): number {
    return this.containers.reduce((a, b) => a + b.weight, 0);
  }

  /**
   * return the amount of containers that are in this column
   * @returns {number}
   */
  get count(): number {
    return this.containers.length;
  }

  constructor() {
  }

  /**
   * Looks at the total weight
   * @param {Container} container
   * @returns {boolean}
   */
  public place(container: Container): boolean {
    if (this.weight <= 120000) {
      this.containers.push(container);
      return true;
    }
    return false;
  }

    public placeValuable(container: Container, frontContainer: Column, backContainer: Column): boolean {
      if(this.containers.some(a => a.valuable)){ return false; }

      const index = this.containers.length;
      let front = frontContainer ? frontContainer.containers[index] : undefined;
      let frontCount = frontContainer ? frontContainer.containers.length : 0;
      let back = backContainer ? backContainer.containers[index] : undefined;
      let backCount = backContainer ? backContainer.containers.length : 0;

      if (
          this.weight <= 120000 &&
          (
              (front == undefined && back == undefined) ||
              ((front == undefined && frontCount > 0) || (back == undefined && backCount > 0))
          )
      ) {
          this.containers.push(container);
          return true;
      }

      return false;
    }
}
