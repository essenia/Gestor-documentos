import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(  private toastr: ToastrService,) { }
   msjError(e: HttpErrorResponse) {
        const message = e.error.msg || e.error.message; // revisa ambos campos

    if (message) {
    this.toastr.error(message, 'Error');
    } else {
      this.toastr.error(
        'upps occurio un error comuniquese con el administrador ',
        'Error',
      );
    }
  }
}
