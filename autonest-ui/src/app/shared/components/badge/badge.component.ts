import { Component, computed, input } from '@angular/core';

export type BadgeVariant = 'available' | 'sold' | 'reserved' | 'negotiable' | 'info';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span
      class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
      [class]="classes()"
    >
      {{ label() }}
    </span>
  `
})
export class BadgeComponent {
  variant = input<BadgeVariant>('info');
  label = input.required<string>();

  classes = computed(() => {
    return (
      {
        available: 'bg-green-100 text-green-700',
        sold: 'bg-red-100 text-red-700',
        reserved: 'bg-yellow-100 text-yellow-700',
        negotiable: 'bg-blue-100 text-blue-700',
        info: 'bg-blue-100 text-blue-700'
      } satisfies Record<BadgeVariant, string>
    )[this.variant()];
  });
}

