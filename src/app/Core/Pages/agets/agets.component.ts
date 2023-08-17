import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UserServiceService } from '../../Services/user-service.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Agent } from '../../Models/Agent';
import { AgentdialogComponent } from '../../../Dialogs/agentdialog/agentdialog.component';
import { ErrorsComponent } from '../../../Dialogs/errors/errors.component';
import { CoreService } from '../../Services/core.service';
import { Role } from '../../Models/Role';
import { RoleService } from '../../Services/role.service';
import { AddUserComponent } from '../../../Dialogs/add-user/add-user.component';
import { AssignRoledialogComponent } from 'src/app/Dialogs/assign-roledialog/assign-roledialog.component';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { SuccessToastComponent } from 'src/app/alerts/success-toast/success-toast.component';
import { auto } from '@popperjs/core';

@Component({
  selector: 'app-agets',
  templateUrl: './agets.component.html',
  styleUrls: ['./agets.component.css']
})
export class AgetsComponent implements OnInit, AfterViewInit {

  agents: Agent[] = [];
  searchResults: Agent[] = [];
  agentss: Agent;
  term: string = '';
  role: Role[] = [];
  filteredAgents: Agent[] = [];
  imagedata: string = '';
  search: string;
  currentPage = 0;
  pageSize = 5;
  totalAgents: number;
  totalPages: number;
  totalElements: number;
  isButtonDisabled= false;
  dateFilter = new FormControl(null);
  isfilterclicked=false;
  pageSizeOptions: number[] = [5, 10, 20,50];

  constructor(private agentservice: UserServiceService,
    private dialog: MatDialog,
    private roleservice: RoleService,
    private router: Router,
    private snackbar: MatSnackBar) { }
  ngOnInit(): void {
    //this.fetchAgents();
    this.getRoles();
    this.loadagentspages(this.currentPage, this.pageSize);
    this.fetchAgents();

  }
  ngAfterViewInit() {

  }

  public fetchAgents(): void {
    this.agentservice.getAgentsPage(this.currentPage, this.pageSize).subscribe(
      agents => {
        this.agents = agents;
        //this.getAgentImage(this.agents);
      },
      () => {
        this.openError('erreur lors de l\'affichage de liste des agents', 'Backend_Error');
      }
    );
  }
  public loadagentspages(page: number, pagesize: number): void {
    if (this.filteredAgents && this.filteredAgents.length > 0) {
      this.agents = this.filteredAgents.slice(page * this.pageSize, (page + 1) * this.pageSize);
      this.totalElements = this.filteredAgents.length;
      this.totalPages = Math.ceil(this.totalElements / this.pageSize);
    } else
    if (this.searchResults && this.searchResults.length > 0) {
      this.agents = this.searchResults.slice(page * this.pageSize, (page + 1) * this.pageSize);
      this.totalElements = this.searchResults.length;
      this.totalPages = Math.ceil(this.totalElements / this.pageSize);
    } else {
      this.agentservice.getAgentsPage(page, pagesize).subscribe((res: any) => {
        this.agents = res.content;
        this.totalElements = res.totalElements;
        this.totalPages = res.totalPages;
      }, (error) => {
        console.log("error getting agent pages", error);
      });
    }
  }
  
  
  
  
  openAddUserDialog(): void {
    const dialogref = this.dialog.open(AddUserComponent, {
      height: 'auto',
      width: 'auto',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '200ms',
    });
    dialogref.afterClosed().subscribe(()=>{
      this.currentPage =0;
      this.loadagentspages(this.currentPage,this.pageSize);
          })
  }

 
  openEditAgentDialog(agent: Agent): void {
    const dialogRef = this.dialog.open(AgentdialogComponent, {
      width: '70%',
      height:'auto',
      data: { agent: agent },      
    });

    // Subscribe to the dialog's afterClosed event to handle the result or any other logic
    dialogRef.afterClosed().subscribe(() => {
      this.currentPage =0;
      this.loadagentspages(this.currentPage,this.pageSize);
    });
  }
  openAssignRole(agent: number): void {
    const dialg = this.dialog.open(AssignRoledialogComponent, {
      width: '50%',
      height: '50%',
      data: { agent: { id: agent } },
    });
    dialg.afterClosed().subscribe(()=> {
      this.currentPage =0;
      this.loadagentspages(this.currentPage,this.pageSize);
    });
  }

  openError(message: string, title: string) {
    const currentpage = this.router.url;
    if (currentpage === '/agents') {
      const dialogRef = this.dialog.open(ErrorsComponent, {
        data: {
          title: title,
          message: message,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        setTimeout(() => {
          this.openError(message, title);
        }, 3000);
      });
    }
  }
  opensnackbar(message: string) {

  }

  open = false;
  deleteagent(id: number): void {

    const deldialog = this.dialog.open(ConfirmationComponent, {
      data: { message: 'supprimer l\'agent ?' },
    });
    deldialog.afterClosed().subscribe((res) => {
      const message = 'l\'agent a été supprimé avec succes';
      if (res == 'confirm')
        this.agentservice.deleteAgent(id).subscribe({
          next: (res) => {
            this.snackbar.openFromComponent(SuccessToastComponent, {
              data: { message: message },
              duration: 5000,
              horizontalPosition: "end",
              verticalPosition: "top",
              panelClass: ['snack-green', 'snack-size', 'snack-position']
            });
            this.agents = this.agents.filter(agent => agent.id !== id);
                    if (this.agents.length === 0) {
                      this.currentPage = this.currentPage -1
                      if (this.currentPage < 0) {
                        this.currentPage = 0;
                      }
                      this.loadagentspages(this.currentPage,this.pageSize);
                    }
          },
        })
  });
  }

  public getRoles(): void {
    this.roleservice.getRoles().subscribe(
      role => { this.role = role },
      error => {
        console.log("error getting roles from DB")
      }
    )
  }

  public getAgentImage(agents: Agent[]): void {
    for (let agent of agents) {
      if (agent.imageUrl) {
        this.agentservice.getimage(agent.imageUrl).subscribe(
          (res: Blob) => {
            this.convertBlobToString(res).then((imageUrl: string) => {
              agent.imageUrl = imageUrl;
            });
          },
          (error) => {
            console.log('Error getting agent image:', error);
          }
        );
      }
    }
  }

  convertBlobToString(blob: Blob): Promise<String> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  searchAgent(query: String) {
    this.agentservice.searchagent(query).subscribe((res) => {
      this.searchResults = res;
      this.currentPage = 0;
      this.totalElements = this.searchResults.length;
      this.totalPages = Math.ceil(this.totalElements / this.pageSize);
      this.loadagentspages(this.currentPage, this.pageSize);

    }, (error) => {
      console.log("error searching for agent", error);
    })
  }
  applyDateFilter() {
    const filterDate: Date = this.dateFilter.value;
    const year: number = filterDate.getFullYear();
    const month: number = filterDate.getMonth() + 1;
    const day: number = filterDate.getDate();
    const formattedDate: string = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    this.agentservice.getfilteredDate(new Date(formattedDate)).subscribe((res) => {
      this.filteredAgents = res;
      this.currentPage = 0;
      this.totalElements = this.filteredAgents.length;
      this.totalPages = Math.ceil(this.totalElements / this.pageSize);
      this.loadagentspages(this.currentPage, this.pageSize);
    })
    console.log(new Date(formattedDate))
  }
  enableButton(){
    this.isButtonDisabled = false;
  }


  getDatePickerValue(): void { 
    this.isButtonDisabled = false;
    this.isfilterclicked=true;
    if (this.dateFilter.value=== null){
    console.log(null);
    }else{
    this.applyDateFilter();
    this.isButtonDisabled= true;
  }
   
  }
  onPageSizeChange(value :number):void{
    this.pageSize = value;
    this.loadagentspages(this.currentPage,this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadagentspages(this.currentPage -1 , this.pageSize);
  }
}



