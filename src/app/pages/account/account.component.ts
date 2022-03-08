import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/modules/auth';
import { Paging } from 'src/app/_share/models/paging';
import { AccountService } from 'src/app/_share/services/account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  accounts: Array<UserModel>;
  paging: Paging;
  constructor(private accountService: AccountService) {
    this.paging = new Paging();  
  }

  ngOnInit(): void {
    this.getListAccount();
  }

  getListAccount(){
    this.accountService.paginate(this.paging).subscribe(response => {
      console.log(response);
    })
  }

}
