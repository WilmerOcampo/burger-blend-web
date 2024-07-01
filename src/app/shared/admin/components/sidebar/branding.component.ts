import { Component } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <div class="branding">
      <a href="/" class="d-flex justify-content-start">
        <img
          src="./assets/images/logos/burger-blend2.svg"
          class="align-middle m-5"
          alt="logo"
        />
        <img
          src="./assets/images/logos/burger-blend-text.svg"
          class="align-middle m-l-10"
          alt="logo"
        />
      </a>
    </div>
  `,
  standalone: true
})
export class BrandingComponent {
  constructor() {}
}
