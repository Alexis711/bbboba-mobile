import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Usuarios } from '../models/usuarios.model';
import { UsuariosService } from '../services/usuarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

type ModoModal = 'ver' | 'editar';

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
  passwordActual = '';
  
  roles = [
    { label: 'SuperAdmin', value: 0 },
    { label: 'Administrador', value: 1 },
    { label: 'Empleado', value: 2 },
  ];

  estatus = [
    { label: 'Activado', value: 1 },
    { label: 'Desactivado', value: 0 },
  ];

  modalAbierto = false;
  modoModal: ModoModal = 'ver';
  formUsuario!: FormGroup;
  ocultarPass = true;
  usuarioSeleccionado: Partial<Usuarios> | null = null;


  constructor(
    private usuarioServ: UsuariosService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm();
    this.onListUser();
  }
  
  onTipoRol = (tipo: number | string): string =>
  this.roles.find(r => String(r.value) === String(tipo))?.label ?? String(tipo);

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
        console.log('DATA', this.dataUser);

      },
      error: (err: any) => {
        this.dataUser = [];
        console.log('Error', err);

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

  private initForm() {
    this.formUsuario = this.fb.group({
      usu_nom_usu:   ['', [Validators.required, Validators.minLength(3)]],
      usu_nombres: ['', [Validators.required, Validators.minLength(2)]],
      usu_apellidos: ['', [Validators.required, Validators.minLength(2)]],
      usu_clave: ['', [Validators.minLength(6)]], // opcional
      usu_rol: ['', [Validators.required]],   // guarda '0' | '1' | '2'
      usu_status: ['', [Validators.required]],    // guarda '1' | '0'
    });
  }

  get f() { return this.formUsuario.controls; }

  abrirModal(user: Usuarios, modo: ModoModal = 'ver') {
    this.usuarioSeleccionado = user ?? null;
    this.modoModal = modo;

    // normaliza estatus a '1'/'0'
    this.formUsuario.reset({
      usu_nom_usu:   user?.usu_nom_usu ?? '',
      usu_nombres: user?.usu_nombres ?? '',
      usu_apellidos: user?.usu_apellidos ?? '',
      use_clave: '',
      usu_rol: user?.usu_rol ?? null,
      usu_status: user?.usu_estatus ?? '',
    });
    
    this.passwordActual = user?.usu_clave ?? '';

    if (modo === 'ver') this.formUsuario.disable();
    else this.formUsuario.enable();

    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.usuarioSeleccionado = null;
    this.formUsuario.enable();
  }

  habilitarEdicion() {
    this.modoModal = 'editar';
    this.formUsuario.enable();
  }

  guardarModal() {
    if (this.formUsuario.invalid) {
      this.formUsuario.markAllAsTouched();
      return;
    }

    const { password, ...rest } = this.formUsuario.value;
    const payload: any = {
      ...this.usuarioSeleccionado, // conserva ids/llaves que necesites
      ...rest,
      // si tu API requiere textos:
      // usu_status: rest.usu_status === '1' ? 'ACTIVO' : 'INACTIVO',
    };
    if (password && password.trim().length > 0) {
      payload.password = password.trim();
    }

    // ===== Llama a tu backend aquí =====
    // this.usuarioServ.updateUser(payload).subscribe({
    //   next: () => {
    //     this.cerrarModal();
    //     this.onListUser();
    //   },
    //   error: () => { /* mostrar error */ }
    // });

    // temporal (UI): cerrar y refrescar
    this.cerrarModal();
    this.onListUser();
  }
}
