import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './error.component.html',
})
export class ErrorComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string } ) {}
}
