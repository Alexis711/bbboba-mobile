import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import DataTable from 'datatables.net-dt';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  @ViewChild('tablaProductos', { static: false }) tablaDatos!: ElementRef;

  data = [
    {
      nombre: 'Frappe de Rompope',
      tipo: 'Frappe',
      estatus: 'Activo',
      precio: 75,
      temperatura: 'Frío',
      color: '#F9E0A5',
    },
    {
      nombre: 'Frappe de Taro',
      tipo: 'Frappe',
      estatus: 'Inactivo',
      precio: 70,
      temperatura: 'Frío',
      color: '#C89FCF',
    }
  ];

  isLoading: boolean = false;
  searchTerm: string = '';
  itemsPerPage: number = 10;
  showSelector: boolean = false;
  currentPage: number = 1;
  totalRegistros: number = 100;
  isPopoverLimiteAbierto = false;
  eventoPopoverLimite: Event | null = null;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.onTablaProductos();
    }, 0);
  }

  private onTablaProductos() {
    new DataTable('#tablaProductos', {
      paging: false,
      searching: false,
      info: false,
      autoWidth: false,
      language: {
        'emptyTable': 'No hay información',
        'info': 'Mostrando _START_ a _END_ de _TOTAL_ Entradas',
        'lengthMenu': 'Mostrar _MENU_ Entradas',
        'loadingRecords': 'Cargando...',
        'processing': 'Procesando...',
        'zeroRecords': 'Sin resultados encontrados',
      },
    });
  }

  onSearch() {
    setTimeout(() => {
      //onListDatos
    }, 1500)
  }

  setItemsPerPage(value: number) {
    this.itemsPerPage = value;
    this.showSelector = false;
    //this.onListAsignaciones('', '');
  }

  cambiarPagina(incremento: number) {
    const nuevaPagina = this.currentPage + incremento;
    if (nuevaPagina < 1) return;

    this.irAPagina(nuevaPagina);
  }

  irAPagina(pagina: number) {
    this.currentPage = pagina;
    //this.onListAsignaciones('', '');
  }

  onInputChange() {
    this.irAPagina(this.currentPage);
  }

  abrirPopoverLimite(ev: Event) {
    this.eventoPopoverLimite = ev;
    this.isPopoverLimiteAbierto = true;
  }
}
