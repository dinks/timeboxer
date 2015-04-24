var timeboxer = require('../../actions/timeboxer.js')
var flux_riot = require('flux-riot')

<timeboxer-meeting-start>

  <h3>{ this.template.name }</h3>

  <hr>

  <div class="row">
    <div class="col-md-6">
      <h3>{ this.currentAgenda.name }</h3>
      <div id="timingClock"></div>

      <div class="progress" id="progressbar">
        <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <a href="#" onclick={ startOrPause } class="btn btn-block btn-success">
            <span class="glyphicon glyphicon-play-circle" aria-hidden="true"></span>
            <span id="agendaContinue">Start</span>
          </a>
        </div>
        <div class="col-md-6">
          <a href="#" onclick={ nextAgenda } class="btn btn-block btn-info">
            <span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>
            Next
          </a>
        </div>
      </div>

    </div>
    <div class="col-md-6">
      <ul class="list-group">
        <li class="list-group-item" each={ item in this.template.agenda }>
          <b>{ item.name }</b> <span class="badge">{ item.time } minutes</span>
        </li>
      </ul>
    </div>
  </div>

  this.currentAgendaIndex = 0;
  this.currentAgendaStatus = 'paused';
  this.currentAgendaTime = 1;

  setCurrentAgenda() {
    if(this.template) {
      this.currentAgenda = this.template.agenda[this.currentAgendaIndex];
      this.currentAgendaTime = parseInt(this.currentAgenda.time) * 60;
      this.timerClock.setTime(this.currentAgendaTime);
    }
  }

  getTemplateFromStore() {
    this.template = opts.template_store.getAll()[0];
  }

  initClock() {
    this.timerClock = $(this.timingClock).FlipClock({
      autoStart: false,
      countdown: true,
      clockFace: 'MinuteCounter',
      callbacks: {
        interval: function() {
          var t = this.timerClock.getTime();
          var percent = (t*100)/this.currentAgendaTime;
          var extraClass = '';

          if (percent <= 20) {
            extraClass = 'progress-bar-warning';
          }

          if (percent <= 10) {
            extraClass = 'progress-bar-danger';
          }

          $(this.progressbar).find('.progress-bar').css({
            width: percent + '%'
          }).addClass(extraClass);
        }.bind(this)
      }
    });
  }

  updateFromStore() {
    this.getTemplateFromStore()
    this.setCurrentAgenda()
    this.update()
  }

  startOrPause() {
    switch(this.currentAgendaStatus) {
      case 'paused':
        this.timerClock.start();
        this.currentAgendaStatus = 'started';
        $(this.agendaContinue).html('Pause');
        break;
      case 'started':
        this.timerClock.stop();
        this.currentAgendaStatus = 'paused';
        $(this.agendaContinue).html('Start');
        break;
    }
  }

  flux_riot.storeMixin(this, opts.template_store, this.updateFromStore);

  this.getTemplateFromStore();
  this.initClock();
  this.setCurrentAgenda();

</timeboxer-meeting-start>
