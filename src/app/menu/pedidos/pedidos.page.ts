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
  name!: string;
  tipoSeleccionado = '';
  saboresFiltrados: Producto[] = [];
  saborSeleccionado = '';
  detalleSeleccionado = '';
  extrasFiltrados: Extras[] = [];
  extrasSeleccionados: string[] = [];
  cantidadProducto = 1;
  costoEnvio = 0;
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

  onControlesCantidad(funcion: string) {
    if (funcion === 'sumar') {
      this.cantidadProducto += 1;
    } else {
      if(this.cantidadProducto > 1){
        this.cantidadProducto -= 1;
      } 
    }
  }

  onActualizarCostoEnvio(event: any) {
    const nuevoValor = parseFloat(event.target.value);
    
    if (!isNaN(nuevoValor)) {
      this.costoEnvio = nuevoValor;
    } else {
      this.costoEnvio = 0; // Valor por defecto si no es un número
    }
  }

  cerrarModal(modal: IonModal, datos?: any, rol: 'cancel' | 'confirm' = 'cancel') {
    modal.dismiss(datos, rol);
  }

  onCancelar(modal: IonModal) {
    this.cerrarModal(modal);
  }

  onGuardar(modal: IonModal) {
    const datos = { /* Tus datos aquí */ };
    this.cerrarModal(modal, datos, 'confirm');
  }

  onEditarProducto() {
    console.log('Que onda');
    
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
