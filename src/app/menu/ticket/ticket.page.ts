import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage implements OnInit {

  constructor(
      private renderer: Renderer2,
      private el: ElementRef
    ) { }

  ngOnInit() {
  }

  collapseDeplegable(id: any) {
    const element = this.el.nativeElement.querySelector('#desplegarPedido' + id);
    if (element) {
      if (element.style.display === 'none' || !element.style.display) {
        this.renderer.setStyle(element, 'display', 'block');
      } else {
        this.renderer.setStyle(element, 'display', 'none');
      }
    }
  }
}
