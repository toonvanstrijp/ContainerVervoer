import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Ship} from './Models/Ship';
import {FormControl} from '@angular/forms';
import {MatSelect, MatSlider} from '@angular/material';
import {Container} from './Models/Container';
import * as _ from 'lodash';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  @ViewChild('ton')
  private tonControl: MatSlider;

  @ViewChild('containerOptions')
  private containerOptions: MatSelect;

  @ViewChild('z')
  private rotateControl: MatSlider;

    @ViewChild('x')
    private controlX: MatSlider;

  @ViewChild('shipContainer')
  private shipContainer;

  public columnsControl: FormControl;
  public rowsControl: FormControl;

  public view3d = false;

  public columns = 0;
  public rows = 0;
  public level = 1;

  public pendingContainers: Container[] = [];

  public ship: Ship;

  get maxWeight(): number{
      return (this.rows * this.columns) * 150000;
  }

  get currentWeight(): number{
    return this.pendingContainers.reduce((a, b) => a+b.weight, 0);
  }

  get currentUsedPercentage(): number {
    const percent = this.maxWeight/100;
    return (this.currentWeight/percent);
  }

  constructor(private cf: ChangeDetectorRef) {
    this.columnsControl = new FormControl(10);
    this.rowsControl = new FormControl(20);

    this.columnsControl.valueChanges.subscribe(a => {
      this.columns = a;
      this.reset();
      this.cf.detectChanges();
    });

    this.rowsControl.valueChanges.subscribe(a => {
      this.rows = a;
      this.reset();
      this.cf.detectChanges();
    });
  }

  public addContainer() {
    const options = (this.containerOptions.value || []);
    const valuable = options.indexOf('valuable') != -1;
    const cooled = options.indexOf('cooled') != -1;
    const latest = this.pendingContainers.sort((a, b) => b.id - a.id)[0] || { id: 0};
    this.pendingContainers.push(new Container(latest.id + 1, this.tonControl.value * 1000, cooled, valuable));

    this.pendingContainers = this.pendingContainers.sort((a, b) => a.id - b.id);

    this.containerOptions.writeValue(null);
    this.containerOptions.value = null;
    this.tonControl.writeValue(4);
    this.tonControl.value = 4;
  }

  public random() {
    this.pendingContainers = [];
    while (this.currentUsedPercentage < 50){
        const latest = this.pendingContainers.sort((a, b) => b.id - a.id)[0] || { id: 0};
        const cooled = Math.random() >= 0.9;
        const valuable = cooled ? false : Math.random() >= 0.8;
        this.pendingContainers.push(new Container(latest.id + 1, (Math.floor(Math.random() * 10000) + 4000), cooled, valuable));
    }
    this.pendingContainers = this.pendingContainers.sort((a, b) => a.id - b.id);
  }

  public intToArray(number: number) {
    return new Array(number);
  }

  public ShipView(index: number) {
    return {
      'opacity': this.level-1 == index ? '0.7' : '0.2',
      'z-index': this.level-1 == index ? 9999999 : index,
      'transform': `perspective(800px) translateY(-${10*index}px) rotateX(${this.controlX.value}deg) rotateY(-${!this.ship && this.currentUsedPercentage < 50 ? '300deg' : '360deg'}) rotateZ(${this.rotateControl.value}deg)`
    };
  }

  public calculate() {
    this.level = 1;
    this.ship = new Ship(this.rows, this.columns);
    this.pendingContainers = _(this.pendingContainers).sortBy(a => !a.cooled, a => a.valuable, a => -a.weight).value()
      .filter(container => {
      return !this.ship.place(container);
    });
  }

  public reset(){
      this.pendingContainers = [];
      this.ship = null;
      this.level = 1;
      this.containerOptions.writeValue(null);
      this.containerOptions.value = null;
      this.tonControl.writeValue(4);
      this.tonControl.value = 4;
  }

  public getContainer(row: number, column: number, level: number): any {
    if (this.ship != null) {
      if (this.ship.rows[row].columns[column].containers.length > 0) {
        return this.ship.rows[row].columns[column].containers[level];
      }
      return null;
    }

    return null;
  }

  ngOnInit(): void {
    this.columns = 10;
    this.rows = 20;
    this.cf.detectChanges();
  }

  levelDown() {
    if (this.level > 1) {
      this.level--;
    }
  }

  levelUp() {
    if (this.level < this.ship.maxLevel) {
      this.level++;
    }
  }
}
