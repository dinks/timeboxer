var flux_riot = require('flux-riot');
var TimeBoxer = require('../../actions/timeboxer.js');

<timer-list>
  <li class="list-group-item" >
    <input type="text" value={agenda.name} name="itemName"> <span> For </span>
    <input type="text" value={agenda.time} name="itemTime"> <span> Minutes </span>
    <span onclick={moveUp} data-index={index} class="btn btn-default glyphicon glyphicon-arrow-up"> </span>
    <span onclick={moveDown} data-index={index} class="btn btn-default glyphicon glyphicon-arrow-down"> </span>
    <span onclick={deleteItem} data-index={index} class="btn btn-default glyphicon glyphicon-remove"> </span>
  </li>

  moveUp (event) {
    var index = parseInt(event.target.dataset.index);
    var tmp;
    var agendas = this.parent.agendaItems.agenda;
    if ( index > 0) {
      tmp = agendas[index - 1];
      agendas[index - 1] = agendas[index];
      agendas[index] = tmp;
      TimeBoxer.updateTemplate(this.parent.agendaItems, this.parent.opts.templateId);
    }
  }
  moveDown (event) {
    var index = parseInt(event.target.dataset.index, 10);
    var tmp;
    var agendas = this.parent.agendaItems.agenda;

    if ( index < agendas.length - 1) {
      tmp = agendas[index];
      agendas[index] = agendas[index + 1];
      agendas[index + 1] = tmp;
      TimeBoxer.updateTemplate(this.parent.agendaItems, this.parent.opts.templateId);
    }
  }
  deleteItem (event) {
    var index = parseInt(event.target.dataset.index, 10);
    var agendas = this.parent.agendaItems.agenda;
    agendas.splice(index, 1); // remove the array item
    TimeBoxer.updateTemplate(this.parent.agendaItems, this.parent.opts.templateId);
  }
</timer-list>

<timeboxer-template-edit>
  <p if={opts.is_error}> Fill up all the values </p>

  <h4> {opts.title} </h4>
  <form onsubmit={updateAgenda}>
    <div class="form-group">
      <input type="text" class="form-control" id="templateName" value={agendaItems.name}>
    </div>

    <div class="form-group">
      <label>Agenda</label>
      <ul class="list-group">
          <timer-list each="{agenda, index in agendaItems.agenda}" data="agenda" />
        </li>
      </ul>
    </div>
    <button class="btn btn-default" onclick={addNewRow}>New Item</button>
    <button type="submit" class="btn btn-default">Update</button>
  </form>

  addNewRow () {
    var agenda = {
      name: '',
      time: ''
    };
    this.agendaItems.agenda.push(agenda);
    this.update();
  }

  updateAgenda() {

    var templateName = this.templateName.value;

    var itemNames = $(this.root).find('[name="itemName"]');
    var itemTimes = $(this.root).find('[name="itemTime"]');

    for (var index = 0 ; index < itemNames.length ; index++) {
      if (itemNames[index].value == '' || itemTimes[index].value === '') {
        opts.is_error = true;
        this.update();
        return false;
      }
      this.agendaItems.agenda[index] = { name : itemNames[index].value,
                                         time : itemTimes[index].value
                                       };
    }
    this.agendaItems.name = templateName;
    TimeBoxer.updateTemplate(this.agendaItems, opts.templateId);
    riot.route('#');
  }

  updateFromStore() {
    this.agendaItems = this.store.getByIndex(opts.templateId);
    this.update();
  }

  this.on('mount', function () {
    this.agendaItems = this.store.getByIndex(opts.templateId) || {};
    this.update();
  });

  flux_riot.storeMixin(this, opts.store, this.updateFromStore);

</timeboxer-template-edit>