import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { Details } from '../Models/details';
import { User } from '../Models/user';
import { DataShareService } from '../services/data-share.service';
import { SocketioService } from '../services/socketio.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css'],
})
export class PopUpComponent implements OnInit, OnDestroy, AfterViewInit {
  //
  @Input() details: Details | undefined;
  @Output() selected: EventEmitter<User> = new EventEmitter<User>();
  @ViewChild('close') button: any;

  private users: User[] = [];
  private observers: Subscription[] = [];
  private btn!: HTMLElement;
  //private usersPipe$!:Observable<any>;

  constructor(
    private dataShare: DataShareService,
    private io: SocketioService
  ) {}

  ngAfterViewInit() {
    this.btn = this.button.nativeElement;
  }

  ngOnInit(): void {
    //get users
    //this.users$ = this.dataShare.passUsers
    this.observers.push(
      this.dataShare.passUsers.subscribe((users: any) => {
        for (const user of users) {
          if (!user.custom) {
            this.users.push(new User(user));
          }
        }
      })
    );
  }

  ngOnDestroy() {
    this.observers.forEach((observer) => {
      observer.unsubscribe();
    });
  }

  submit(index: number) {
    this.io.invite(this.users[index].details.id, this.details?.rid);
    this.selected.emit(this.users[index]);
    this.btn.click();
  }

  get all() {
    return this.users;
  }
}
