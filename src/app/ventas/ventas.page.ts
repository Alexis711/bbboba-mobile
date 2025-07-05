import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import DataTable from 'datatables.net-dt';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage implements OnInit {
  @ViewChild('tablaVentas', { static: false }) tablaDatos!: ElementRef
  
  data = [
    {
      folio: 'F 1',
      fecha: '04/07/2025',
      tipo: 'Aqui',
      envio: 0.00,
      nombreUsuario: 'Alexis Mendez',
      precio: '550.50',
    },
    {
      folio: 'F 2',
      fecha: '03/07/2025',
      tipo: 'Domicilio',
      envio: 25.00,
      nombreUsuario: 'Aimee Arriaga',
      precio: '230.00',
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
      this.onTablaVentas();
    }, 0);
  }

  private onTablaVentas() {
    new DataTable('#tablaVentas', {
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
