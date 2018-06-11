import {Column} from './Column';
import {Container} from './Container';
import {st} from '@angular/core/src/render3';
import index from "@angular/cli/lib/cli";

export class Row {

  private _colomns: Column[] = [];

  get columns(): Column[] {
    return this._colomns;
  }

  get weight(): number {
    return this.columns.reduce((a, b) => a + b.weight, 0);
  }

  get weightRight(): number {
    const start = Math.ceil(this.columns.length / 2);
    return this.columns.slice(start).reduce((a, b) => a + b.weight, 0);
  }

  get weightLeft(): number {
    const end = Math.floor(this.columns.length / 2);
    return this.columns.slice(0, end).reduce((a, b) => a + b.weight, 0);
  }

  get maxLevel(): number {
    return this.columns.slice(0).sort((a, b) => b.count - a.count)[0].count;
  }

  constructor(columns: number) {
    for (let i = 0; i < columns; i++) {
      this.columns.push(new Column());
    }
  }

  public placeRight(container: Container): boolean {
    const start = Math.floor(this.columns.length / 2);
    for (const column of this.columns.slice(Math.max(this.columns.length - start, 1))) {
      if (column.place(container)) {
        return true;
      }
    }
    return false;
  }

  public placeLeft(container: Container): boolean {
    const end = Math.ceil(this.columns.length / 2);
    for (const column of this.columns.slice(0, end).reverse()) {
      if (column.place(container)) {
        return true;
      }
    }
    return false;
  }

  public placeValuableRight(container: Container, previousRow: Row, nextRow: Row): boolean {
      const start = Math.floor(this.columns.length / 2);
      for (const column of this.columns.slice(Math.max(this.columns.length - start, 1))) {
          const index = this.columns.indexOf(column);
          let frontColumn;
          let backColumn;

          if(previousRow){
            frontColumn = previousRow.columns[index];
          }
          if(nextRow){
            backColumn = nextRow.columns[index];
          }

          if (column.placeValuable(container, frontColumn, backColumn)) {
              return true;
          }
      }
      return false;
  }

  public placeValuableLeft(container: Container, previousRow: Row, nextRow: Row): boolean {
      const end = Math.ceil(this.columns.length / 2);
      for (const column of this.columns.slice(0, end).reverse()) {
          const index = this.columns.indexOf(column);
          let frontColumn = previousRow ? previousRow.columns[index] : undefined;
          let backColumn = nextRow ? nextRow.columns[index] : undefined;

          if (column.placeValuable(container, frontColumn, backColumn)) {
              return true;
          }
      }
      return false;
  }
}
