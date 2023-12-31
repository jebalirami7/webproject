import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { Service } from '../service';
import { Reclamation } from '../Entities/Reclamation';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})

export class DataTableComponent implements AfterViewInit {

  param?:string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  dataSource: any;
  reclamations !: Reclamation[];

  constructor(private service: Service, private dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.param = params['param'];
    });      
    console.log(this.param);
    this.loadReclamation(this.param);
  }
  
  loadReclamation(param: any) {
    this.service.GetReclamation(param).subscribe(res => {
    console.log(res?.reclamations)
    this.reclamations = res?.reclamations;
    this.dataSource = new MatTableDataSource<Reclamation>(this.reclamations);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }, err => {
    if (err instanceof HttpErrorResponse) {
      if ( err.status === 401 ) {
        this.router.navigate(['']);
      }
    }
  });
  }
  
  displayedColumns = ['id', 'subject', 'cin', 'date', 'status', 'action'];
  
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  Filterchange(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }
  
  editReclamation(id: any) {
    this.openPopup(id);
  }

  openPopup(id: any) {
    var _popup = this.dialog.open(PopupComponent, {
      width: '60%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        id: id,
      }
    });
    _popup.afterClosed().subscribe(item => {
      // console.log(item)
      this.loadReclamation(this.param);
    });
  }
}
