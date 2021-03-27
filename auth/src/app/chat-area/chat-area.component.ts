import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CommentComponent } from '../comment/comment.component';
import { Room } from '../Models/room';
import { AuthService } from '../services/auth.service';
import { CommentsService } from '../services/comments.service';
import { DataShareService } from '../services/data-share.service';
import { FileService } from '../services/file.service';
import { ChatDirective } from './chat.directive';

@Component({
  selector: 'chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.css'],
})
export class ChatAreaComponent implements OnInit, OnDestroy {
  @ViewChild(ChatDirective, { static: true })
  appChat!: ChatDirective;

  private rooms: any = Array<Room>();
  private vc!: ViewContainerRef;
  private activeRoom: any;
  private previousId: string = '';
  private observers: Subscription[] = [];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private fetchData: DataShareService,
    private commentsService: CommentsService,
    private auth: AuthService
  ) {}

  ngOnDestroy() {
    this.observers.forEach((observer) => {
      observer.unsubscribe();
    });
  }

  ngOnInit() {
    //on room change
    this.observers.push(
      this.fetchData.message.subscribe((data: any) => {
        if (data.name == 'default' || data.id == this.activeRoom) return;
        this.vc = this.appChat.viewContainerRef;
        this.vc.clear();
        this.activeRoom = data.id;
        this.getRoom();
      })
    );

    // local append
    this.observers.push(
      this.fetchData.local.subscribe((data: any) => {
        this.commentSectionInit(data);
        this.saveLocal(this.activeRoom, data);
      })
    );

    //remote append
    this.observers.push(
      this.fetchData.remote.subscribe((data: any) => {
        if (data.custom) {
          this.saveLocal(data.receiver, data);
          if (data.receiver == this.activeRoom) {
            this.commentSectionInit(data);
          }
        } else {
          this.saveLocal(data.sender, data);
          if (this.activeRoom == data.sender) {
            this.commentSectionInit(data);
          }
        }
      })
    );
  }

  saveLocal(id: string, data: any) {
    this.rooms.forEach((room: any) => {
      if (room.getSender() == id) {
        room.addComment(data);
      }
    });
  }

  renderer(comments: any, rid: string) {
    this.previousId = '';
    comments.forEach((comment: any) => {
      this.commentSectionInit(comment);
    });
    this.fetchData.stopLoading();
    this.fetchData.sendroomId(rid);
  }

  //create a comment instance for each comment
  commentSectionInit(data: any) {
    if (!data) return;
    this.vc = this.appChat.viewContainerRef;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      CommentComponent
    );
    const componentRef = this.vc.createComponent<CommentComponent>(
      componentFactory
    );
    (<CommentComponent>componentRef.instance).data = data;
    (<CommentComponent>componentRef.instance).previousId = this.previousId;
    this.previousId = data.sender;
  }

  getRoom() {
    for (let room of this.rooms) {
      if (room.getSender() == this.activeRoom) {
        this.renderer(room.getComments(), room.id);
        return;
      }
    }
    this.fetchFromServer();
  }

  fetchFromServer() {
    let sender = this.auth.getUserInfo().id;
    this.commentsService
      .getComments('room', {
        receiver: this.activeRoom,
        sender: sender,
      })
      .subscribe((response: any = []) => {
        let room = new Room(response.comments, this.activeRoom, response.rid);
        this.rooms.push(room);
        this.renderer(response.comments, room.id);
      });
  }
}
