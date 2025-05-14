import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';

interface TipoProducto {
  nombre: string;
  icono: string;
}

interface Producto {
  tipo: string;
  nombre: string;
  icono: string;
}

interface Extras {
  tipo: string;
  nombre: string;
  icono: string;
  costo: number;
}


interface Detalles {
  nombre: string;
  icono: string;
  costo: number;
}

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})

export class PedidosPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;
  tipoSeleccionado = '';
  saboresFiltrados: Producto[] = [];
  saborSeleccionado = '';
  detalleSeleccionado = '';
  extrasFiltrados: Extras[] = [];
  extrasSeleccionados: string[] = [];
  /**
   * 
   * Agregar costos de envio a domicilio
   * 
   * 15
   * 20
   * 30
   */
  tipos: TipoProducto[] = [
    { nombre: 'Cafe', icono: 'cafe' },
    { nombre: 'Malteada', icono: 'ice-cream' },
    { nombre: 'Frappe', icono: 'snow' },
    { nombre: 'Desayuno', icono: 'fast-food' },
    { nombre: 'Marquesita', icono: 'pizza' },
  ];

  productos: Producto[] = [
    { tipo: 'Cafe', nombre: 'Americano', icono: 'cafe' },
    { tipo: 'Malteada', nombre: 'Fresa', icono: 'ice-cream' },
    { tipo: 'Malteada', nombre: 'Chocolate', icono: 'ice-cream' },
    { tipo: 'Malteada', nombre: 'Vainilla', icono: 'ice-cream' },
    { tipo: 'Frappe', nombre: 'Moka', icono: 'snow' },
    { tipo: 'Frappe', nombre: 'Hersheys', icono: 'snow' },
    { tipo: 'Frappe', nombre: 'Taro', icono: 'snow' },
    { tipo: 'Frappe', nombre: 'Chai', icono: 'snow' },
    { tipo: 'Frappe', nombre: 'Cookies', icono: 'snow' },
  ];

  extras: Extras[] = [
    { tipo: 'Frappe', nombre: 'Boba', icono: 'snow', costo: 5 },
    { tipo: 'Frappe', nombre: 'Crema', icono: 'snow', costo: 5 },
    { tipo: 'Frappe', nombre: 'Explosiva', icono: 'snow', costo: 5 },
    { tipo: 'Frappe', nombre: 'Deslactosada', icono: 'snow', costo: 5 },
    { tipo: 'Frappe', nombre: 'Light', icono: 'snow', costo: 5 },
  ];

  detalles: Detalles[] = [
    { nombre: 'Aqui', icono: 'home', costo: 0 },
    { nombre: 'Llevar', icono: 'fast-food', costo: 0 },
    { nombre: 'Domicilio', icono: 'rocket', costo: 15 },
  ];

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
  ) {}

  ngOnInit() {
    console.log(this.detalleSeleccionado);
    
  }

  onCancelar() {
    this.modal.dismiss(null, 'cancelar');
  }

  onGuardar() {
    this.modal.dismiss(this.name, 'guardar');
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'guardar') {
      console.log('Datos guardados');
    }
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

  seleccionarTipo(tipo: TipoProducto) {
    this.tipoSeleccionado = tipo.nombre;
    this.saboresFiltrados = this.productos.filter(p => p.tipo === tipo.nombre);
    this.extrasFiltrados = this.extras.filter(e => e.tipo === tipo.nombre);
    this.saborSeleccionado = '';
    if (tipo.nombre === 'Frappe') {
      const boba = this.extrasFiltrados.find(e => e.nombre.toLowerCase() === 'boba');
      if (boba) {
        this.extrasSeleccionados = [boba.nombre];
      }
    } else {
      this.extrasSeleccionados = [];
    }
  }

  seleccionarSabor(sabor: Producto) {
    this.saborSeleccionado = sabor.nombre;
  }

  seleccionarDetalle(detalle: Detalles) {
    this.detalleSeleccionado = detalle.nombre;
  }

  toggleExtra(extra: Extras) {
    const index = this.extrasSeleccionados.indexOf(extra.nombre);
    if (index === -1) {
      this.extrasSeleccionados.push(extra.nombre);
    } else {
      this.extrasSeleccionados.splice(index, 1);
    }
  }
}
