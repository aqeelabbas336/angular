// #docplaster
// #docregion
import { AfterContentChecked, AfterContentInit, Component, ContentChild } from '@angular/core';

import { LoggerService } from './logger.service';

//////////////////
@Component({
  selector: 'app-child',
  template: '<input [(ngModel)]="hero">'
})
export class ChildComponent {
  hero = 'Magneta';
}

//////////////////////
@Component({
  selector: 'after-content',
// #docregion template
  template: `
    <div>-- projected content begins --</div>
      <ng-content></ng-content>
    <div>-- projected content ends --</div>`
// #enddocregion template
   + `
    <p *ngIf="comment" class="comment">
      {{comment}}
    </p>
  `
})
// #docregion hooks
export class AfterContentComponent implements AfterContentChecked, AfterContentInit {
  private prevHero = '';
  comment = '';

  // Query for a CONTENT child of type `ChildComponent`
  @ContentChild(ChildComponent) contentChild: ChildComponent;

// #enddocregion hooks
  constructor(private logger: LoggerService) {
    this.logIt('AfterContent constructor');
  }

// #docregion hooks
  ngAfterContentInit() {
    // contentChild is set after the content has been initialized
    this.logIt('AfterContentInit');
    this.doSomething();
  }

  ngAfterContentChecked() {
    // contentChild is updated after the content has been checked
    if (this.prevHero === this.contentChild.hero) {
      this.logIt('AfterContentChecked (no change)');
    } else {
      this.prevHero = this.contentChild.hero;
      this.logIt('AfterContentChecked');
      this.doSomething();
    }
  }
// #enddocregion hooks
// #docregion do-something

  // This surrogate for real business logic sets the `comment`
  private doSomething() {
    this.comment = this.contentChild.hero.length > 10 ? `That's a long name` : '';
  }

  private logIt(method: string) {
    const child = this.contentChild;
    const message = `${method}: ${child ? child.hero : 'no'} child content`;
    this.logger.log(message);
  }
// #docregion hooks
  // ...
}
// #enddocregion hooks

//////////////
@Component({
  selector: 'after-content-parent',
  template: `
  <div class="parent">
    <h2>AfterContent</h2>

    <div *ngIf="show">` +
// #docregion parent-template
     `<after-content>
        <app-child></app-child>
      </after-content>`
// #enddocregion parent-template
+ `</div>

    <h4>-- AfterContent Logs --</h4>
    <p><button (click)="reset()">Reset</button></p>
    <div *ngFor="let msg of logger.logs">{{msg}}</div>
  </div>
  `,
  styles: ['.parent {background: burlywood}'],
  providers: [LoggerService]
})
export class AfterContentParentComponent {
  show = true;

  constructor(public logger: LoggerService) {
  }

  reset() {
    this.logger.clear();
    // quickly remove and reload AfterContentComponent which recreates it
    this.show = false;
    this.logger.tick_then(() => this.show = true);
  }
}
