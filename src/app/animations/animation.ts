import { trigger, state, style, animate, transition } from '@angular/animations';

export function expand() {
  return trigger('expand', [
      state('*', style({ opacity: 1, transform: 'translateX(0)' })),
      transition(':enter', [
          style({ transform: 'translateY(-50%)', opacity:0 }),
          animate('1s ease-in', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
  ]);
}

export function flyInOut() {
  return trigger('flyInOut', [
      state('*', style({ opacity: 1, transform: 'translateX(0)'})),
      transition(':enter', [
          style({ transform: 'translateX(-100%)', opacity: 0 }),
          animate('500ms ease-in')
      ]),
      transition(':leave', [
          animate('200ms ease-out', style({ transform: 'translateX(100%)', opacity: 0}))
      ])
  ]);
}

