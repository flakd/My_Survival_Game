class WhatAmIDoing {
  constructor() {
    this._timeLeft = 0;
    this._activity = null;
    this._onActivityCompleted = []; //listener queue
  }
  triggerActivityCompletedEvent() {
    for (let i = 0; i < this._onActivityCompleted.length; i++) {
      this._onActivityCompleted[i]();
    }
  }
  addActivityCompletedEventListener(listenerFunc) {
    this._onActivityCompleted.push(listenerFunc);
  }
  removeActivityCompletedEventListener(listenerFunc) {
    var index = this._onActivityCompleted.indexOf(listenerFunc);
    if (index >= 0) {
      arr.splice(index, 1);
    }
  }
  startActivity(action) {
    //  Is a procedure that MUST perform the start of the activity if
    //  possible.  It is possible if I am NOT BUSY doing anything else.
    //  RETURNS: a boolean if the activity started
    this._timeLeft = action.numHrs * 60;
    this._activity = action;
    playActivityMedia(g.c.action.gerund);
  }
  isBusy() {
    if (this._activity !== null) {
      return true;
    } else {
      return false;
    }
  }
  getActivityName() {
    if (this.isBusy()) {
      return this._activity.key;
    }
  }
  getActivityGerund() {
    if (this.isBusy()) {
      return this._activity.gerund;
    }
  }
  getBusyMessage(message) {
    if (this.isBusy()) {
      return `You can't do that right now, you're busy ${this.getActivityGerund()} for the next ${this.getTimeLeft()} minutes`;
    } else {
      return "sure thing... you're not busy";
    }
  }
  get timeLeft() {
    if (this.isBusy()) {
      return this._timeLeft;
    } else {
      return 0;
    }
  }
  getTimeLeft() {
    if (this.isBusy()) {
      return this._timeLeft;
    } else {
      return 0;
    }
  }
  passMinute() {
    if (this._activity === null) return;
    this._timeLeft--;
    if (this._timeLeft <= 0) {
      //this._onActivityCompleted(this, this._activity);
      this.triggerActivityCompletedEvent(this, this._activity);
      this._activity = null;
      this._timeLeft = 0;
    }
  }
}

(function () {
  g.waid = new WhatAmIDoing();
  g.waid.addActivityCompletedEventListener(handle_activityCompleted);
})();
