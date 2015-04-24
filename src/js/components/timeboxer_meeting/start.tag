var timeboxer = require('../../actions/timeboxer.js')
var flux_riot = require('flux-riot')

<timeboxer-meeting-start>

  <h3>{ this.template.name }</h3>

  <hr>

  <div class="row">
    <div class="col-md-8">
      <h3 class="agenda-name">{ this.currentAgenda.name }</h3>
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
          <a href="#" onclick={ nextAgenda } class="btn btn-block btn-info" id="nextAgendaBtn">
            <span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>
            Next
          </a>
        </div>
      </div>

    </div>
    <div class="col-md-4">
      <ul class="list-group">
        <li class="list-group-item" each={ item, index in this.template.agenda }>
          <input type="checkbox" id={ 'agendaItem'+ index } disabled> <b>{ item.name }</b> <span class="badge">{ item.time } minutes</span>
        </li>
      </ul>
    </div>
  </div>

  <div class="modal fade" id="allDone">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">Notice</h4>
        </div>
        <div class="modal-body">
          <p>Great Job finishing the meeting!!</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

  this.currentAgendaIndex = 0;
  this.currentAgendaTime = 1;

  setCurrentAgenda() {
    if(this.template) {
      this.currentAgenda = this.template.agenda[this.currentAgendaIndex];
      if (this.currentAgenda) {
        this.currentAgendaTime = parseFloat(this.currentAgenda.time) * 60;
        this.timerClock.setTime(this.currentAgendaTime);
      } else {
        $(this.allDone).modal();
      }
    }
  }

  getTemplateFromStore() {
    this.template = opts.template_store.getAll()[opts.templateId];
  }

  nextAgenda() {
    this.resetStatus();
    $('#agendaItem'+this.currentAgendaIndex).prop('checked', true);
    this.currentAgendaIndex++;
    this.setCurrentAgenda();
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

          if(t <= 0) {
            $(this.nextAgendaBtn).click();
          }
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

  resetStatus() {
    this.timerClock.stop();
    this.currentAgendaStatus = 'paused';
    $(this.agendaContinue).html('Start');

    $(this.progressbar).find('.progress-bar').
    css({
      width: '100%'
    }).
    removeClass('progress-bar-warning').
    removeClass('progress-bar-danger');
  }

  flux_riot.storeMixin(this, opts.template_store, this.updateFromStore);

  this.getTemplateFromStore();
  this.initClock();
  this.resetStatus();
  this.setCurrentAgenda();

</timeboxer-meeting-start>
