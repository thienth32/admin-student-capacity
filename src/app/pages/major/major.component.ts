import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MajorService } from '../../services/major.service';

@Component({
  selector: 'app-major',
  templateUrl: './major.component.html',
  styleUrls: ['./major.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MajorComponent implements OnInit {
  sortId: String = 'desc';
  sortName: String = 'desc';
  sortBy: String = '';
  checkAll: Boolean = false;
  majors: Array<any> = [];
  pages:  any  = {};
  url: string = "http://127.0.0.1:8000/api/public/majors";

  constructor(private majorService : MajorService) { }

  ngOnInit(): void {
    this.fetchMajors(this.url);
  }

  fetchMajors(url : string){
    return this.majorService.list(url).subscribe((resp : any) => {
      this.majors = resp.payload.data;
      delete  resp.payload.data;
      this.pages =   resp.payload;
    })
  }

  pagesArrayTotals() : Array<number> {
    return Array.from(Array(this.pages.last_page).keys());
  }

  perPage(){
     this.fetchMajors(this.pages.first_page_url+this.sortBy);
  }
  nextPage(){
    if(this.pages.next_page_url !== null ) this.fetchMajors(this.pages.next_page_url+this.sortBy);
  }
  currentPage(page: number){
    this.fetchMajors(this.url + '?page='+page+this.sortBy);
  }


  formatBy(name: string , sort : string){
    if(name == 'id'){
      this.sortId = sort == 'desc' ? 'asc' : 'desc';
    }else if(name == 'name'){
      this.sortName = sort == 'desc' ? 'asc' : 'desc';
    }
    this.sortBy = '&sort='+sort+'&sort_by='+name;
     this.fetchMajors(this.url + '?sort='+sort+'&sort_by='+name);
  }
}
