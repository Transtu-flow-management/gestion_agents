import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UserServiceService } from '../../Services/user-service.service';
import { MatDialog } from '@angular/material/dialog';

import { Agent } from '../../interfaces/Agent';
import { AgentdialogComponent } from '../../../Dialogs/agentdialog/agentdialog.component';
import { ErrorsComponent } from '../../../Dialogs/errors/errors.component';
import { CoreService } from '../../Services/core.service';
import { Role } from '../../interfaces/Role';
import { RoleService } from '../../Services/role.service';
import { AdduserDialogComponent } from '../../../Dialogs/adduser-dialog/adduser-dialog.component';
import { AddUserComponent } from '../add-user/add-user.component';
import { AssignRoledialogComponent } from 'src/app/Dialogs/assign-roledialog/assign-roledialog.component';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  role: Role[] = []
  imagedata: string = '';
  search: string;
  currentPage = 0;
  pageSize = 2;
  totalAgents: number;
  totalPages: number;
  totalElements: number;




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
      height: '60%',
      width: '50%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '200ms',
      panelClass: 'dialogbackgroundcolor'

    })
  }
  openEditAgentDialog(agent: Agent): void {
    const dialogRef = this.dialog.open(AgentdialogComponent, {
      width: '50%',
      data: { agent: agent },
    });

    // Subscribe to the dialog's afterClosed event to handle the result or any other logic
    dialogRef.afterClosed().subscribe((updatedAgent) => {
      if (updatedAgent) {
        if (updatedAgent.err === 'USERNAME_EXIST') {
          this.openError('nom utlisateur deja existant', 'user_exist');
        }
      } else {
        let index = this.agents.findIndex(
          (item: Agent) => item.id === updatedAgent.id
        );
        this.agents.splice(index, 1, agent);;
      }
    });
  }
  openAssignRole(agent: number): void {
    const dialg = this.dialog.open(AssignRoledialogComponent, {
      width: '50%',
      height: '50%',
      data: { agent: { id: agent } },
    });
    dialg.afterClosed().subscribe(result => {
      console.log('Dialog closed:', result);
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

    });
    deldialog.afterClosed().subscribe((res) => {
      if (res == 'confirm')
        this.agentservice.deleteAgent(id).subscribe({
          next: (res) => {
            alert('Agent supprimé');
            // this.fetchAgents();
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

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadagentspages(this.currentPage - 1, this.pageSize);
    console.log(this.currentPage);
  }
}



