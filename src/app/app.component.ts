import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: []
})
export class AppComponent implements OnInit {

  count = signal<number>(0);
  clickCount$ = toObservable(this.count);
  interval$ = interval(1000);
  interval = toSignal(this.interval$, { initialValue: 0 })

  customInterval$ = new Observable((subscriber) => {
    let counter = 0;
    const customSetInterval = setInterval(() => {
      if (counter > 3) {
        clearInterval(customSetInterval);
        subscriber.complete();
        return;
      }
      console.log("Emitting New Values...")
      subscriber.next({ message: 'NEW VALUE!' });
      counter++
    }, 2000);
  })

  constructor() {
    effect(() => {
      console.log(`Clicked Button ${this.count()} times.`);
    })
  }

  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // const subscription = interval(1000).pipe(
    //   map((data) => {
    //     return data * 2;
    //   })
    // ).subscribe({
    //   next: (val) => {
    //     console.log(val);
    //   },
    // });

    const subscription = this.clickCount$.subscribe({
      next: (val) => {
        console.log(val);
      },
      error: (err) => {
        throw (err);
      },
      complete: () => {
        console.log("COMPLETED")
      },
    })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })

    this.customInterval$.subscribe({
      next: (val) => {
        console.log(val);
      },
      error: (err) => {
        throw(err)
      },
      complete: () => {
        console.log("COMPLETED");
      }
    });
  }

  onClick() {
    this.count.update((prevVal) => prevVal + 1);
  }
}
