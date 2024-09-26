import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { interval, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports:[]
})
export class AppComponent implements OnInit {

  count = signal<number>(0);

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

    // this.destroyRef.onDestroy(() => {
    //   subscription.unsubscribe();
    // }) 
  }

  onClick() {
    this.count.update((prevVal) => prevVal + 1);
  }
}
