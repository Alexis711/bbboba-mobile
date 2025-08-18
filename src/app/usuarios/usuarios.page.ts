import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import DataTable from 'datatables.net-dt';
import { Usuarios } from '../models/usuarios.model';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  @ViewChild('tablaUsuarios', { static: false }) tablaDatos!: ElementRef
  data: Usuarios[] = [];

  /*columnas = [
    { header: 'Id', field: 'usu_id', width: '7rem' },
    { header: 'Usuario', field: 'usu_nom_usu',  direccion: 'desc', width: '7rem' },
    { header: 'Nombre(s)', field: 'usu_nombres', width: '10rem' },
    { header: 'Apellidos', field: 'usu_apellidos', width: '10rem' },
    { header: 'Estatus', field: 'usu_estatus', width: '6rem' },
    { header: 'Correo', field: 'usu_correo', width: '12rem' },
    { header: 'Teléfono', field: 'usu_telefono', width: '5rem' },
    { header: 'Rol', field: 'usu_rol', width: '6rem' },
    {
      header: 'Acciones',
      field: 'acciones',
      width: '10rem',
      showButton: true,
      showButtons: [
        {
          iconName: 'eye',
          background: 'var(--light-neutral)',
          color: 'var(--primary-color)',
          clickButton: (item: any) => this.onVerUsuario(item),
          access: 'auth/recharge',
          accessType: 'write',
          //isAdmin: true,
        },
        {
          iconName: 'pencil',
          background: 'var(--light-neutral)',
          color: 'var(--warning-color)',
          clickButton: (item: any) => this.onVerUsuario(item),
          access: 'auth/recharge',
          accessType: 'write',
        },
        {
          iconName: 'trash',
          background: 'var(--light-neutral)',
          color: 'var(--danger-color)',
          clickButton: (item: any) => this.onVerUsuario(item),
          access: 'auth/recharge',
          accessType: 'write',
        }
      ]
    }
  ];*/

  isLoading: boolean = false;
  searchTerm: string = '';
  itemsPerPage: number = 10;
  showSelector: boolean = false;
  currentPage: number = 1;
  totalRegistros: number = 100;
  isPopoverLimiteAbierto = false;
  eventoPopoverLimite: Event | null = null;

  constructor(
    private usuarioServ: UsuariosService
  ) { }

  ngOnInit() {
    this.onListUser();
  }

  onListUser() {
    const payload = { limit: this.itemsPerPage.toString(), page: this.currentPage.toString() };
    this.usuarioServ.getUsers(payload).subscribe({
      next: (resp: any) => {
        console.log(resp);
        
        if (resp.status) {
          this.data = resp.response;
        }
        console.log('DATA',this.data);
        
      },
      error: (err: any) => {
        this.data = [];
        console.log('Error',err);
        
      },
      
    });
  }

  
  ngAfterViewInit() {
    setTimeout(() => {
      this.onTablaUsuarios();
    }, 0);
  }

  private onTablaUsuarios() {
    new DataTable('#tablaUsuarios', {
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
