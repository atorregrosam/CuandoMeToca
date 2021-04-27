import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appPassword]'
})
export class AppPasswordDirective implements OnInit {
  @Input() showPassword: any;
  private shown = false;
  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    if (this.showPassword === true) {
      this.setup();
    }
  }

  toggle(span: HTMLElement): void {
    this.shown = !this.shown;
    if (this.shown) {
      this.el.nativeElement.setAttribute('type', 'text');
      span.innerHTML = `<i class="fa fa-eye-slash" aria-hidden="true"></i>`;
    } else {
      this.el.nativeElement.setAttribute('type', 'password');
      span.innerHTML = `<i class="fa fa-eye" aria-hidden="true"></i>`;
    }
  }

  public setup(): void {
    const parent = this.el.nativeElement.parentNode;
    const span = document.createElement('span');
    span.style.position = 'absolute';
    span.style.right = '10px';
    span.style.top = '39px';
    span.style.width = '30px';
    span.style.height = '30px';
    span.style.color = '#1B365D';
    span.innerHTML = `<i class="fa fa-eye" aria-hidden="true"></i>`;
    span.addEventListener('click', (event) => {
      this.toggle(span);
    });
    parent.appendChild(span);
  }
}
