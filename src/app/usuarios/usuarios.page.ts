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
  dataUser: Usuarios[] = [];
  isLoading: boolean = false;
  searchTerm: string = '';
  itemsPerPage: number = 10;
  showSelector: boolean = false;
  currentPage: number = 1;
  totalPaginas: number = 1;
  totalRegistros: number = 1;
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
          this.dataUser = resp.response;
          this.totalRegistros = resp.pagination.total;
          this.totalPaginas = resp.pagination.totalPages;
        }
        console.log('DATA',this.dataUser);
        
      },
      error: (err: any) => {
        this.dataUser = [];
        console.log('Error',err);
        
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
    this.onListUser()
  }

  onInputChange() {
    this.irAPagina(this.currentPage);
  }

  abrirPopoverLimite(ev: Event) {
    this.eventoPopoverLimite = ev;
    this.isPopoverLimiteAbierto = true;
  }

}
