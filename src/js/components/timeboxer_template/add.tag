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
    </div>
  </form>

</timeboxer-template-add>
