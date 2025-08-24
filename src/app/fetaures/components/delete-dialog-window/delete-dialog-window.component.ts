import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton, MatFabButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'delete-dialog',
  templateUrl: 'delete-dialog-window.component.html',
  styleUrl: 'delete-dialog-window.component.scss',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFabButton,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DeleteDialogWindowComponent{}
