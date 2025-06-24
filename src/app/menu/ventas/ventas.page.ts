import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  onIngresarGraficas() {
    this.router.navigate(['graficas']);
  }

  onIngresarProductos() {
    this.router.navigate(['productos']);
  }

  onIngresarVentas() {
    this.router.navigate(['ventas']);
  }
  
  onIngresarUsuarios() {
    this.router.navigate(['usuarios']);
  }

  onIngresarCondiciones() {
    this.router.navigate(['condiciones']);
  }

  onIngresarMovimientos() {
    this.router.navigate(['movimientos']);
  }
}
