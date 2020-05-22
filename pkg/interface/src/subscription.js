export default class Subscription {
  constructor(store, api, channel) {
    this.store = store;
    this.api = api;
    this.channel = channel;

    this.channel.setOnChannelError(this.onChannelError.bind(this));
  }

  start() {
    this.subscribe('/primary', 'invite-view');
    this.subscribe('/app-name/contacts', 'metadata-store');
  }

  onChannelError(err) {
    console.error('event source err: ', err);
    console.log('initiating new channel');

    this.start();
  }

  subscribe(path, app) {
    this.api.bind(path, 'PUT', this.api.ship, app,
      this.handleEvent.bind(this),
      (err) => {
        console.log(err);
        this.subscribe(path, app);
      },
      () => {
        this.subscribe(path, app);
      });
  }

  handleEvent(diff) {
    this.store.handleEvent(diff);
  }
}