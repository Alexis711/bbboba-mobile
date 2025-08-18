import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuariosService } from '../services/usuarios.service';
import { Usuarios } from '../models/usuarios.model';
import { TablasComponent } from '../component/tablas/tablas.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  @ViewChild('tablaUsuarios', { static: false }) tablaDatos!: TablasComponent
  data: Usuarios[] = [];
  columnas = [
    { header: 'Id', field: 'usu_id', width: '7rem' },
    { header: 'Usuario', field: 'usu_nom_usu',  direccion: 'desc', width: '7rem' },
    { header: 'Nombre(s)', field: 'usu_nombres', width: '10rem' },
    { header: 'Apellidos', field: 'usu_apellidos', width: '10rem' },
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
          isAdmin: true,
        },
        {
          iconName: 'pencil',
          background: 'var(--light-neutral)',
          color: 'var(--warning-color)',
          clickButton: (item: any) => this.onVerUsuario(item),
        },
        {
          iconName: 'trash',
          background: 'var(--light-neutral)',
          color: 'var(--danger-color)',
          clickButton: (item: any) => this.onVerUsuario(item),
        }
      ]
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
        if (resp.status) {
          this.data = resp.response;
        }
      },
      error: (err: any) => {
        this.data = [];
        console.log('Error',err);
        
      },
      
    });
  }

  abrirPopoverLimite(ev: Event) {
    this.eventoPopoverLimite = ev;
    this.isPopoverLimiteAbierto = true;
  }

  cambiarPagina(incremento: number) {
    const nuevaPagina = this.currentPage + incremento;
    if (nuevaPagina < 1) return;
    this.currentPage = nuevaPagina;
    this.onListUser();
  }

  irAPagina(pagina: number) {
    if (pagina < 1) return;
    this.currentPage = pagina;
    this.onListUser();
  }

  onInputChange() {
    this.irAPagina(this.currentPage);
  }

  setItemsPerPage(value: number) {
    this.itemsPerPage = value;
    this.onListUser();
  }

  onSearch() {
    this.onListUser();
  }

  exportToExcel() {
    this.tablaDatos.exportToExcel();
  }

  exportToPDF() {
    this.tablaDatos.exportToPDF();
  }

  onExportExcel(data: any[]) {
    console.log('Excel exportado:', data);
  }

  onExportPDF(data: any[]) {
    console.log('PDF exportado:', data);
  }

  onVerUsuario(item: any) {

  }

  onEditarUsuario(item: any) {

  }

  onEliminarUsuario(item: any) {

  }
}
