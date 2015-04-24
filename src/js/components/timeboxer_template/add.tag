var timeboxer = require('../../actions/timeboxer.js')
var flux_riot = require('flux-riot')

<timeboxer-template-add>

  <h3>{ opts.title }</h3>

  <form>
    <div class="form-group">
      <label for="templateName">Template Name</label>
      <input type="text" class="form-control" id="templateName" placeholder="Enter Template Name">
    </div>
    <div class="form-group">
      <label>Agenda</label>
      <ul class="list-group">
        <li class="list-group-item" each={ item in agendaItems }>
          { item.title } for { item.time } minutes
        </li>
      </ul>
    </div>
  </form>

  <form class="form-inline" onsubmit={ addAgenda }>
    <div class="form-group">
      <label class="sr-only" for="agendaTitle">Agenda</label>
      <input type="text" class="form-control" id="agendaTitle" placeholder="Enter Agenda Title" onkeyup={ editTitle }>
    </div>
    <div class="form-group">
      <label class="sr-only" for="agendaTime">Agenda Time</label>
      <input type="text" class="form-control" id="agendaTime" placeholder="Enter Agenda Time" onkeyup={ editTime }>
    </div>
    <button type="submit" disabled={ !(agendaTitleValue && agendaTimeValue) } class="btn btn-default">Add Agenda</button>
  </form>

  this.agendaItems = [];

  addAgenda() {
    if (this.agendaTitleValue && this.agendaTimeValue) {
      this.agendaItems.push({
        title: this.agendaTitleValue,
        time: this.agendaTimeValue
      });
      this.agendaTitleValue = this.agendaTimeValue = this.agendaTime.value = this.agendaTitle.value = '';
    }
  }

  editTitle(e) {
    this.agendaTitleValue = e.target.value;
  }

  editTime(e) {
    this.agendaTimeValue = e.target.value;
  }

</timeboxer-template-add>
