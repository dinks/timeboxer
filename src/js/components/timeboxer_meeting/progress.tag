<progress-bar>
  <div class="progress">
    <div class="progress-bar progress-bar-striped {this.progressState}" role="progressbar" style="width: {this.percentage}%;">
    </div>
  </div>

  showDanger() {
    this.progressState = 'progress-bar-danger';
  }

  showWarning () {
    this.progressState = 'progress-bar-warning';
  }

  showNormal () {
    this.progressState = 'progress-bar-success';
  }

  this.on('mount', function() {
    this.showNormal();
    this.update();
  });

  this.on('update', function() {
    this.percentage = opts['current-time']*100/opts['total-time'];

    if (opts['current-time'] < 20) {
      this.showDanger();
    } else if (opts['current-time'] < 50) {
      this.showWarning();
    } else {
      this.showNormal();
    }
  });

</progress-bar>
