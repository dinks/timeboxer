require('./timeboxer_template/index.tag')

var flux_riot = require('flux-riot')

<timeboxer-index>

  <h3>{ opts.title }</h3>

  <timeboxer-template-index store={ opts.store }></timeboxer-template-index>

</timeboxer-index>
