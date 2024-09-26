import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';

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
  }

  onClick() {
    this.count.update((prevVal) => prevVal + 1);
  }
}
