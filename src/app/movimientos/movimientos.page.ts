import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import DataTable from 'datatables.net-dt';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.page.html',
  styleUrls: ['./movimientos.page.scss'],
})
export class MovimientosPage implements OnInit {
  @ViewChild('tablaMovimientos', { static: false }) tablaDatos!: ElementRef
  data = [
    {
      fecha: '2025-07-15',
      hora: '08:30:00',
      usuario: 'Alexis Mendez',
      actividad: 'Añadio un frappe de moka',
    },
    {
      fecha: '2025-07-15',
      hora: '08:35:00',
      usuario: 'Alexis Mendez',
      actividad: 'Modifico una marquesita clasica a tropical',
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
      this.onTablaUsuarios();
    }, 0);
  }

  private onTablaUsuarios() {
    new DataTable('#tablaMovimientos', {
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
        'zeroRecords': 'Sin registros encontrados',
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
