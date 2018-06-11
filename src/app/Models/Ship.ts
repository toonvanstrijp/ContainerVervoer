import {Row} from './Row';
import {Container} from './Container';

export class Ship {

  private maxRows: number;
  private maxColumns: number;
  private _rows: Row[] = [];

  get rows(): Row[] {
    return this._rows;
  }

  get size(): number {
    return this.rows.reduce((a, b) => a + b.weight, 0);
  }

  get maxLevel(): number {
    return this.rows.reduce((a, b) => a = b.maxLevel > a ? b.maxLevel : a, 0);
  }

  get getRightSideWeight(): number {
    return this.rows.reduce((a, b) => a + b.weightRight, 0);
  }

  get getLeftSideWeight(): number {
    return this.rows.reduce((a, b) => a + b.weightLeft, 0);
  }

  get leftPercentage(): number {
    const percent = (this.getRightSideWeight + this.getLeftSideWeight) / 100;
    const leftPercentage = (this.getLeftSideWeight / percent) || 0;
    return leftPercentage;
  }

  get rightPercentage(): number {
    const percent = (this.getRightSideWeight + this.getLeftSideWeight) / 100;
    const rightPercentage = (this.getRightSideWeight / percent) || 0;
    return rightPercentage;
  }

  get differencePercentage(): number {
    return Math.abs(this.leftPercentage - this.rightPercentage);
  }

  constructor(rows: number, columns: number) {
    this.maxRows = rows;
    this.maxColumns = columns;

    for (let i = 0; i < rows; i++) {
      this.rows.push(new Row(this.maxColumns));
    }
  }

  public place(container: Container): boolean {

    //checks if cooled container fits on the first row
    if (container.cooled) {
      return this.placeCooled(container);
    }else if(container.valuable){
      return this.placeValuable(container);
    }else{
      return this.placeContainer(container);
    }
  }

  private placeCooled(container: Container): boolean{
      if (this.leftPercentage > 50) {
          if (this.rows[0].placeRight(container)) {
              return true;
          }else if (this.rows[0].placeLeft(container)) {
              return true;
          }
      } else {
          if (this.rows[0].placeLeft(container)) {
              return true;
          }else if(this.rows[0].placeRight(container)) {
              return true;
          }
      }
      return false;
  }

  private placeValuable(container: Container): boolean{
      for (const row of this.rows) {
          const index = this.rows.indexOf(row);
          const previousRow = this.rows[index-1];
          const nextRow = this.rows[index+1];
          if (this.leftPercentage > 50) {
              if (row.placeValuableRight(container, previousRow, nextRow)) {
                  return true;
              }else if (row.placeValuableLeft(container, previousRow, nextRow)) {
                  return true;
              }
          }else{
              if (row.placeValuableLeft(container, previousRow, nextRow)) {
                  return true;
              }
              else if(row.placeValuableRight(container, previousRow, nextRow)){
                  return true;
              }
          }
      }
      return false;
  }

  private placeContainer(container: Container): boolean{
      for (const row of this.rows) {
          if (this.leftPercentage > 50) {
              if (row.placeRight(container)) {
                  return true;
              }else if (row.placeLeft(container)) {
                  return true;
              }
          } else {
              if (row.placeLeft(container)) {
                  return true;
              }else if(row.placeRight(container)){
                  return true;
              }
          }
      }
      return false;
  }
}
