import { Component } from '@angular/core';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isSubmenuHidden = true;
  isSubmenuEntropotHidden = true;
  isSubmenuvehiculeHidden = true;
  isSubmenulineHidden = true;

  toggleDropdown() {
    this.isSubmenuHidden = !this.isSubmenuHidden;
  }
  toggleDropdownE(){
    this.isSubmenuEntropotHidden = !this.isSubmenuEntropotHidden;
  }
  toggleDropdownV(){
    this.isSubmenuvehiculeHidden = !this.isSubmenuvehiculeHidden;
  }
  toggleDropdownL(){
this.isSubmenulineHidden = !this.isSubmenulineHidden;
  }
}
