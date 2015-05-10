var flux_riot = require('flux-riot');
var TimeBoxer = require('../../actions/timeboxer.js');

<timeboxer-template-add>

  <h3>{ opts.title }</h3>

  <hr>

  <form>
    <div class="form-group">
      <label for="templateName">Event Template Name</label>
      <input type="text" class="form-control" id="templateName" placeholder="Enter Template Name" onkeyup={ editTitle }>
    </div>
    <div class="form-group">
      <label>Agenda</label>
      <ul class="list-group">
        <li class="list-group-item" each={ item in agendaItems }>
          <b>{ item.name }</b> for <b>{ item.time }</b> minutes
        </li>
      </ul>
    </div>
  </form>

  <form class="form-inline" onsubmit={ addAgenda }>
    <div class="form-group">
      <label class="sr-only" for="agendaTitle">Item Title</label>
      <input type="text" class="form-control" id="agendaTitle" placeholder="Enter Agenda Item Title" onkeyup={ editAgendaTitle }>
    </div>
    <div class="form-group">
      <label class="sr-only" for="agendaTime">Item Time</label>
      <input type="text" class="form-control" id="agendaTime" placeholder="Enter Agenda Item Time" onkeyup={ editAgendaTime }>
    </div>
    <button type="submit" disabled={ !(agendaTitleValue && agendaTimeValue) } class="btn btn-default">Add Agenda Item</button>
  </form>

  <hr>

  <a href="#" onclick={ saveTemplate } class="btn btn-success">
    <span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Create
  </a>
  <a href="#" onclick={ cancel } class="btn btn-info">
    <span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span> Cancel
  </a>

  this.title = '';

  this.agendaItems = [];

  addAgenda() {
    if (this.agendaTitleValue && this.agendaTimeValue) {
      this.agendaItems.push({
        name: this.agendaTitleValue,
        time: this.agendaTimeValue
      });
      this.agendaTitleValue = this.agendaTimeValue = this.agendaTime.value = this.agendaTitle.value = '';
    }
  }

  editTitle(e) {
    this.title = e.target.value;
  }

  editAgendaTitle(e) {
    this.agendaTitleValue = e.target.value;
  }

  editAgendaTime(e) {
    this.agendaTimeValue = e.target.value;
  }

  saveTemplate() {
    TimeBoxer.saveTemplate({
      name: this.title,
      agenda: this.agendaItems
    });
  }

  updateFromStore() {
    riot.route('#');
  }
  cancel() {
    riot.route('#');
  }

  flux_riot.storeMixin(this, opts.store, this.updateFromStore)

</timeboxer-template-add>
