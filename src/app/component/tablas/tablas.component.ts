import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit, SimpleChanges, OnChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Platform } from '@ionic/angular';
import DataTable from 'datatables.net-dt';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ButtonConfig {
  iconName?: string;
  background?: string;
  color?: string;
  clickButton?: (row: any) => void;
  isAdmin: string;
}

export interface Column {
  header: string;
  width: string;
  display?: string;
  field?: string;
  direccion?: string;
  showButton?: boolean;
  showButtons?: ButtonConfig[];
}

@Component({
  selector: 'app-tablas',
  templateUrl: './tablas.component.html',
  styleUrls: ['./tablas.component.scss'],
})

export class TablasComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('tablaGeneral', { static: false }) tablaGeneral!: ElementRef;
  @Output() exportExcel = new EventEmitter<any[]>();
  @Output() exportPDF = new EventEmitter<any[]>();
  @Input() data: any[] = [];
  @Input() opciones: any = {};
  @Input() columnas: Column[] = [];
  private columnasVisibles: Column[] = [];

  elementosTabla: any[] = [];
  resizeSubscription!: Subscription;

  private dataTable: any;

  constructor(
    private platform: Platform,
  ) { }

  ngOnInit() {
    this.resizeSubscription = this.platform.resize.subscribe(() => {
      this.handleResize();
    });
  }

  ngAfterViewInit() {
    this.onTablaGeneral();
    setTimeout(() => this.initializeIonicButtons(), 200);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['columnas']) {
      this.verifyDataStructure();
      this.updateTable();
      setTimeout(() => this.initializeIonicButtons(), 200);
    }
  }

  exportToExcel(): void {
    const exportData = this.prepareExportData();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    XLSX.writeFile(wb, 'babyboba.xlsx');
    this.exportExcel.emit(exportData);
  }

  exportToPDF(): void {
    try {
      const exportData = this.prepareExportData();
      const doc = new jsPDF({ orientation: 'landscape' });

      const headers = this.columnas
        .filter(col => col.display !== 'none' && col.field && col.field !== 'acciones')
        .map(col => col.header);

      const body = exportData.map(item =>
        this.columnas
          .filter(col => col.display !== 'none' && col.field && col.field !== 'acciones')
          .map(col => item[col.header]?.toString() || '')
      );

      autoTable(doc, {
        head: [headers],
        body: body,
      });

      doc.save('babyboba.pdf');
    } catch (error) {
      console.error('PDF Error:', error);
    }
  }

  private prepareExportData(): any[] {
    return this.data.map(item => {
      const exportItem: { [key: string]: any } = {};

      this.columnas
        .filter(col =>
          col.display !== 'none' &&
          typeof col.field === 'string' &&
          col.field !== 'acciones'
        )
        .forEach(col => {
          const field = col.field as string;
          exportItem[col.header] = field in item ? item[field] : null;
        });

      return exportItem;
    });
  }

  private verifyDataStructure() {
    if (this.data.length > 0 && this.columnas.length > 0) {
      const firstRow = this.data[0];
      this.columnas.forEach(col => {
        if (col.field && !firstRow.hasOwnProperty(col.field)) {
          console.warn(`Advertencia: La columna '${col.header}' espera el campo '${col.field}' que no existe en los datos`);
        }
      });
    }
  }

  private updateTable() {
    if (this.dataTable) {
      this.dataTable.clear();
      this.dataTable.rows.add(this.data);
      this.dataTable.draw();
    } else {
      this.onTablaGeneral();
    }
  }

  private onTablaGeneral() {
    setTimeout(() => {
      if (this.dataTable) {
        this.dataTable.destroy();
        this.dataTable = null;
      }

      if (this.tablaGeneral && this.tablaGeneral.nativeElement) {
        this.columnasVisibles = this.columnas.filter(col => col.display !== 'none');
        const columnaConOrden = this.columnasVisibles.find(col => col.direccion);
        const indexColumnaOrden = columnaConOrden
          ? this.columnasVisibles.findIndex(col => col.field === columnaConOrden.field)
          : 0;
        const direccionOrden = columnaConOrden?.direccion || 'asc';
        this.dataTable = new DataTable(this.tablaGeneral.nativeElement, {
          style: 'none',
          data: this.data,
          columns: this.columnasVisibles.map(col => ({
            title: col.header,
            data: col.field || null,
            width: col.width,
            render: col.showButton ? this.renderButtons.bind(this) : null,
          })),
          order: [[indexColumnaOrden, direccionOrden]],
          language: {
            'emptyTable': 'No hay información',
            'info': 'Mostrando _START_ a _END_ de _TOTAL_ Entradas',
            'lengthMenu': 'Mostrar _MENU_ Entradas',
            'loadingRecords': 'Cargando...',
            'processing': 'Procesando...',
            'zeroRecords': 'Sin resultados encontrados',
          },
          autoWidth: false,
          info: false,
          scrollX: true,
          scrollCollapse: true,
          responsive: true,
          paging: false,
          searching: false,
          ...this.opciones,
          drawCallback: () => {
            setTimeout(() => this.initializeIonicButtons(), 50);
          },
        });

      }

    }, 0);
  }

  private renderButtons(data: any, type: any, row: any, meta: any) {
    const columnConfig = this.columnasVisibles[meta.col];
    if (!columnConfig.showButtons) return '';
    const buttonsWithPermission = columnConfig.showButtons.filter(button => {
      const hasPermission = button.isAdmin;
      if (!hasPermission) return false;

      const requiresInfo = ['trash', 'pencil'].includes(button.iconName || '');
      if (requiresInfo && row.hasInfo === false) return false;

      return true;
    });

    if (buttonsWithPermission.length === 0) return '';

    // Crea un contenedor único para todos los botones de esta celda
    return `
      <div class="buttons-wrapper">
        ${buttonsWithPermission.map(button => `
          <div class="ionic-button-container" 
              data-row='${JSON.stringify(row).replace(/'/g, "\\'")}'
              data-button='${JSON.stringify({
      iconName: button.iconName,
      background: button.background,
      color: button.color,
    })}'>
          </div>
        `).join('')}
      </div>
    `;
  }

  private initializeIonicButtons() {
    this.clearExistingButtons();

    const containers = document.querySelectorAll('.ionic-button-container:not(.initialized)');

    containers.forEach(container => {
      const rowDataStr = container.getAttribute('data-row');
      const buttonDataStr = container.getAttribute('data-button');

      if (!rowDataStr || !buttonDataStr) return;

      try {
        const rowData = JSON.parse(rowDataStr);
        const buttonData = JSON.parse(buttonDataStr);
        container.classList.add('initialized');

        const ionButton = document.createElement('ion-button');
        ionButton.setAttribute('size', 'small');
        ionButton.style.setProperty('--background', buttonData.background);
        ionButton.style.setProperty('--color', buttonData.color || 'var(--light-neutral)');
        ionButton.style.setProperty('margin', '0px');

        const icon = document.createElement('ion-icon');
        icon.setAttribute('name', buttonData.iconName);
        ionButton.appendChild(icon);

        ionButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.handleButtonClick(buttonData.iconName, rowData);
        });

        container.appendChild(ionButton);
      } catch (error) {
        console.error('Error al inicializar botones:', error);
      }
    });
  }

  private clearExistingButtons() {
    document.querySelectorAll('.ionic-button-container').forEach(container => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.classList.remove('initialized');
    });
  }

  private handleButtonClick(iconName: string, rowData: any) {
    for (const col of this.columnas) {
      if (col.showButtons) {
        const button = col.showButtons.find(b => b.iconName === iconName);
        if (button?.clickButton) {
          button.clickButton(rowData);
        }
      }
    }
  }

  handleResize() {
    this.onTablaGeneral();
  }

  ngOnDestroy() {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }
}
