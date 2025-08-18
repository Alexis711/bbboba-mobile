import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface Column {
  header: string;
  field: string;
  width?: string;
}

@Component({
  selector: 'app-tablas',
  templateUrl: './tablas.component.html',
  styleUrls: ['./tablas.component.scss']
})
export class TablasComponent {
  @Input() data: any[] = [];
  @Input() columnas: Column[] = [];

  @Output() exportExcel = new EventEmitter<any[]>();
  @Output() exportPDF = new EventEmitter<any[]>();

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Ordenar por columna
  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.data = [...this.data].sort((a, b) => {
      const valueA = a[column] ?? '';
      const valueB = b[column] ?? '';
      return this.sortDirection === 'asc'
        ? valueA > valueB ? 1 : -1
        : valueA < valueB ? 1 : -1;
    });
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    XLSX.writeFile(wb, 'Datos.xlsx');
    this.exportExcel.emit(this.data);
  }

  exportToPDF() {
    const doc = new jsPDF({ orientation: 'landscape' });
    const headers = this.columnas.map(c => c.header);
    const body = this.data.map(row => this.columnas.map(c => row[c.field] ?? ''));

    autoTable(doc, {
      head: [headers],
      body: body,
    });

    doc.save('Datos.pdf');
    this.exportPDF.emit(this.data);
  }
}
