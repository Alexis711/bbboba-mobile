import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Usuarios } from '../models/usuarios.model';
import { UsuariosService } from '../services/usuarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertServiceService } from '../services/alert-service.service';

type ModoModal = 'crear' | 'ver' | 'editar';

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
  
  modalEliminarAbierto = false;
  isEliminando = false;
  modalAbierto = false;
  modoModal: ModoModal = 'ver';
  usuarioSeleccionado: Partial<Usuarios> | null = null;
  formUsuario!: FormGroup;
  ocultarPass = true;

  constructor(
    private usuarioServ: UsuariosService,
    private alertServ: AlertServiceService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm();
    this.onListUsers();
  }

  get f() { return this.formUsuario.controls; }

  onTipoRol = (tipo: number | string): string =>
    this.roles.find(r => String(r.value) === String(tipo))?.label ?? String(tipo);
  
  onListUsers() {
    const payload: any = { 
      limit: String(this.itemsPerPage), 
      page: String(this.currentPage) 
    };
    if ((this.searchTerm || '').trim().length > 0) {
      payload.search = this.searchTerm.trim();
    }

    this.isLoading = true;
    this.usuarioServ.getUsers(payload).subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        if (resp?.status) {
          this.dataUser = resp.response;
          this.totalRegistros = resp.pagination.total;
          this.totalPaginas = resp.pagination.totalPages;
        } else {
          this.dataUser = [];
          this.totalRegistros = 0;
          this.totalPaginas = 1;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.dataUser = [];
        console.error('Error', err);
      },
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.onListUsers();
  }

  setItemsPerPage(value: number) {
    this.itemsPerPage = value;
    this.currentPage = 1;
    this.isPopoverLimiteAbierto = false;
    this.onListUsers();
  }

  private clampPage(p: number): number {
    const total = Math.max(1, this.totalPaginas || 1);
    return Math.min(Math.max(1, p), total);
  }

  cambiarPagina(incremento: number) {
    const target = this.clampPage(this.currentPage + incremento);
    if (target === this.currentPage) return;
    this.currentPage = target;
    this.onListUsers();
  }

  irAPagina(pagina: number) {
    const target = this.clampPage(Number(pagina));
    if (target === this.currentPage) return;
    this.currentPage = target;
    this.onListUsers();
  }

  onInputChange() {
    this.currentPage = this.clampPage(this.currentPage);
    this.onListUsers();
  }

  abrirPopoverLimite(ev: Event) {
    this.eventoPopoverLimite = ev;
    this.isPopoverLimiteAbierto = true;
  }

  private initForm() {
    this.formUsuario = this.fb.group({
      usu_nom_usu: ['', [Validators.required, Validators.minLength(3)]],
      usu_nombres: ['', []],
      usu_apellidos: ['', []],
      usu_correo: ['', [Validators.email]],
      usu_telefono: ['', [Validators.required, Validators.minLength(7)]],
      usu_clave: ['', []],
      usu_rol: [null, [Validators.required]],
      usu_estatus: [1, [Validators.required]],
    });
  }

  abrirCrear() {
    this.modoModal = 'crear';
    this.usuarioSeleccionado = null;
    this.formUsuario.reset({
      usu_nom_usu: '',
      usu_nombres: '',
      usu_apellidos: '',
      usu_correo: '',
      usu_telefono: '',
      usu_clave: '',
      usu_rol: null,
      usu_estatus: 1,
    });
    this.formUsuario.enable();
    this.modalAbierto = true;
    this.sincronizarValidacionPassword();
  }

  abrirVer(user: any) {
    this.modoModal = 'ver';
    this.usuarioSeleccionado = user;
    this.llenarFormularioDesde(user);
    this.formUsuario.disable();
    this.modalAbierto = true;
    this.sincronizarValidacionPassword();
  }

  abrirEditar(user: any) {
    this.modoModal = 'editar';
    this.usuarioSeleccionado = user;
    this.llenarFormularioDesde(user);
    this.formUsuario.enable();
    this.formUsuario.get('usu_clave')?.setValue('');
    this.sincronizarValidacionPassword();
    this.modalAbierto = true;
  }

  private llenarFormularioDesde(user: Partial<Usuarios>) {
    this.formUsuario.reset({
      usu_nom_usu: user?.usu_nom_usu ?? '',
      usu_nombres: user?.usu_nombres ?? '',
      usu_apellidos: user?.usu_apellidos ?? '',
      usu_correo: user?.usu_correo ?? '',
      usu_telefono: user?.usu_telefono ?? '',
      usu_clave: '',
      usu_rol: user?.usu_rol ?? null,
      usu_estatus: user?.usu_estatus ?? 1,
    });
  }

  private sincronizarValidacionPassword() {
    if (this.modoModal === 'crear') {
      this.formUsuario.get('usu_clave')?.setValidators([Validators.required, Validators.minLength(6)]);
    } else {
      this.formUsuario.get('usu_clave')?.setValidators([Validators.minLength(6)]);
    }
    this.formUsuario.get('usu_clave')?.updateValueAndValidity({ emitEvent: false });
  }

  habilitarEdicion() {
    this.modoModal = 'editar';
    this.formUsuario.enable();
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.usuarioSeleccionado = null;
    this.formUsuario.enable();
  }

  guardarModal() {
    if (this.formUsuario.invalid) {
      this.formUsuario.markAllAsTouched();
      return;
    }

    const v = this.formUsuario.value as {
      usu_nom_usu: string;
      usu_nombres?: string;
      usu_apellidos?: string;
      usu_correo?: string;
      usu_telefono: string;
      usu_clave?: string;
      usu_rol: number | string;
      usu_estatus: number | string;
    };

    const nomUsu = (v.usu_nom_usu ?? '').trim();
    const nombres = (v.usu_nombres ?? '').trim();
    const apell = (v.usu_apellidos ?? '').trim();
    const correo = (v.usu_correo ?? '').trim();
    const tel = (v.usu_telefono ?? '').trim();
    const rolNum = Number(v.usu_rol);
    const claveRaw = (v.usu_clave ?? '').trim();

    if (this.modoModal === 'crear') {
      if (!nomUsu || !tel || isNaN(rolNum) || claveRaw.length < 6) {
        this.formUsuario.markAllAsTouched();
        return;
      }

      const payloadCrear = {
        usu_nom_usu: nomUsu,
        usu_nombres: nombres,    
        usu_apellidos: apell,
        usu_correo: correo,
        usu_telefono: tel,
        usu_clave: claveRaw,
        usu_rol: rolNum
      };

      // CREAR
      this.usuarioServ.createUser(payloadCrear).subscribe({
        next: (resp: any) => {
          if (resp?.status) {
            this.cerrarModal();
            this.irAPagina(1);
            this.alertServ.success(resp.response);
            this.onListUsers();
          } else {
            if (resp?.code === 409) {
              this.alertServ.warning(resp.response);
            } else {
              this.alertServ.warning(resp.response);
            }
          }
        },
        error: (err) => {
          this.alertServ.error(err);
        }
      });
    } else if (this.modoModal === 'editar') {

      if (!this.usuarioSeleccionado?.usu_id) return;

      const payloadEditar: any = {
        usu_id: this.usuarioSeleccionado.usu_id,
        usu_nom_usu: nomUsu,
        usu_nombres: nombres,
        usu_apellidos: apell,
        usu_correo: correo,
        usu_telefono: tel,
        usu_rol: rolNum,
        usu_estatus: Number(v.usu_estatus)
      };

      if (claveRaw.length >= 6) {
        payloadEditar.usu_clave = claveRaw;
      }
      
      // EDITAR
      this.usuarioServ.putUser(payloadEditar).subscribe({
        next: (resp: any) => {
          if (resp?.status) {
            this.cerrarModal();
            this.alertServ.success(resp.response);
            this.onListUsers();
          } else {
            if (resp.status) {
              this.alertServ.warning(resp.response);
            } else {
              this.alertServ.warning(resp.response);
            }
          }
        },
        error: (err) => {
          this.alertServ.error(err);
        }
      });
    }
  }

  abrirModalEliminar(user: Usuarios) {
    if (!user?.usu_id) { console.warn('Usuario sin usu_id'); return; }
    this.usuarioSeleccionado = user;
    this.modalEliminarAbierto = true;
  }

  cerrarModalEliminar() {
    this.modalEliminarAbierto = false;
    this.usuarioSeleccionado = null;
    this.isEliminando = false;
  }

  confirmarEliminar() {
    if (!this.usuarioSeleccionado?.usu_id) return;
    this.isEliminando = true;
    this.usuarioServ.deleteUser(this.usuarioSeleccionado).subscribe({
      next: (resp: any) => {
        if (resp.status) {
          this.alertServ.success(resp.response);
        } else {
          this.alertServ.warning(resp.response);
        }
        this.cerrarModalEliminar();
        const unicoEnPagina = this.dataUser.length === 1 && this.currentPage > 1;
        if (unicoEnPagina) this.currentPage -= 1;

        this.onListUsers();
      },
      error: (err: any) => {
        this.isEliminando = false;
        this.alertServ.warning(err);
      }
    });
  }
}
