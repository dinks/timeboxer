<count-down-timer>
  <div class="timerContainer {this.containerClass}">
  <span>{this.minutes}</span>:<span>{this.seconds}</span>
  </div>

  prettify (data) {
    return (data < 10) ? '0'+ data : data;
  }

  showDanger () {
    this.containerClass = 'danger';
  }
  showNormal () {
   this.containerClass = '';
  }
  showWarning () {
   this.containerClass = 'warning';
  }

  this.on('update', function() {
    this.minutes = opts.minutes;
    this.seconds = this.prettify(opts.seconds);
    if (opts.minutes === 0) {
      if (opts.seconds < 20) {
        this.showDanger();
      } else if (opts.seconds < 50) {
        this.showWarning();
      }
    } else {
      this.showNormal();
    }
  });
</count-down-timer>