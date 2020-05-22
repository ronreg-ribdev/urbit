import GroupReducer from '../reducers/group-update';
import ContactReducer from '../reducers/contact-update';
import PermissionReducer from '../reducers/permission-update';
import MetadataReducer from '../reducers/metadata-update';
import InviteReducer from '../reducers/invite-update';
import LinkReducer from '../reducers/link-update';
import ListenReducer from '../reducers/listen-update';
import LocalReducer from '../reducers/local';

import BaseStore from './base';


export default class LinksStore extends BaseStore {
  constructor() {
    super();
    this.groupReducer = new GroupReducer();
    this.contactReducer = new ContactReducer();
    this.permissionReducer = new PermissionReducer();
    this.metadataReducer = new MetadataReducer();
    this.inviteReducer = new InviteReducer();
    this.localReducer = new LocalReducer();
    this.linkReducer = new LinkReducer();
    this.listenReducer = new ListenReducer();
  }

  initialState() {
    return {
      contacts: {},
      groups: {},
      associations: {
        link: {},
        contacts: {}
      },
      invites: {},
      links: {},
      listening: new Set(),
      comments: {},
      seen: {},
      permissions: {},
      sidebarShown: true
    };
  }

  reduce(data, state) {
    this.groupReducer.reduce(json, this.state);
    this.contactReducer.reduce(json, this.state);
    this.permissionReducer.reduce(json, this.state);
    this.metadataReducer.reduce(json, this.state);
    this.inviteReducer.reduce(json, this.state);
    this.localReducer.reduce(json, this.state);
    this.linkReducer.reduce(json, this.state);
    this.listenReducer.reduce(json, this.state);
  }
}

