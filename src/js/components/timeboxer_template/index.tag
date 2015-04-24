var timeboxer = require('../../actions/timeboxer.js')
var flux_riot = require('flux-riot')

var ServerApiUtils = require('../../utils/ServerApiUtils.js');
ServerApiUtils.getAll();

<timeboxer-template-index>

  <h3>{ opts.title }</h3>

  <table class="table table-hover">
    <tr>
      <th>Template</th>
      <th>Actions</th>
    </tr>
    <tr each={ item in this.items }>
      <td><h4>{ item.name }</h4></td>
      <td>
        <a href="#" onclick={ parent.startMeeting } class="btn btn-primary">Start a Meeting</a>
        <a href="#" class="btn btn-primary">Edit</a>
        <a href="#" class="btn btn-primary">Remove</a>
      </td>
    </tr>
  </table>

  <a href="#" onclick={ add } class="btn btn-primary">Add New Template</a>

  add() {
    riot.route('templates/add')
  }

  getDataFromStore() {
    this.items = this.store.getAll()
  }

  updateFromStore() {
    this.getDataFromStore()
    this.update()
  }

  startMeeting(event) {
    var index = this.items.indexOf(event.item.item);
    riot.route('meeting/start/' + index);
  }

  flux_riot.storeMixin(this, opts.store, this.updateFromStore)

  this.getDataFromStore()

</timeboxer-template-index>
