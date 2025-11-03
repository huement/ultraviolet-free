(function(){
  if(!window.SystemTicker){
    class Ticker{
      constructor(selector, opts){
        this.root = document.querySelector(selector);
        this.move = this.root ? this.root.querySelector('.ticker-move') : null;
        this.speed = (opts && opts.speed) || 0.5; // pixels per frame
        this._raf = null;
        if(this.root && this.move){
          // 1) Seed content if empty
          if(!this.move.children.length){
            // Generate items like live SystemTicker
            const methods = ['GET','POST','PUT','DELETE','PATCH'];
            const endpoints = ['/api/users','/api/products','/api/orders','/api/auth/login','/api/inventory','/api/dashboard','/api/analytics','/api/settings'];
            const statuses = [
              { code: 200, icon: 'check_circle', class: 'status-success' },
              { code: 201, icon: 'add_circle', class: 'status-success' },
              { code: 304, icon: 'cached', class: 'status-info' },
              { code: 401, icon: 'gpp_maybe', class: 'status-warning' },
              { code: 404, icon: 'error', class: 'status-error' },
              { code: 500, icon: 'report', class: 'status-error' }
            ];
            const itemsToGenerate = 30;
            const frag = document.createDocumentFragment();
            for(let i=0;i<itemsToGenerate;i++){
              const method = methods[Math.floor(Math.random()*methods.length)];
              const endpoint = endpoints[Math.floor(Math.random()*endpoints.length)];
              const status = statuses[Math.floor(Math.random()*statuses.length)];
              const responseTime = Math.floor(Math.random()*450) + 20;
              const div = document.createElement('div');
              div.className = 'ticker-item';
              div.innerHTML = `
        <span class="material-symbols-rounded ${status.class}" title="Status: ${status.code}">${status.icon}</span>
        <span class="log-method">${method}</span>
        <span class="log-endpoint">${endpoint}</span>
        <span class="log-status ${status.class}">${status.code}</span>
        <span class="log-time">${responseTime}ms</span>
      `;
              frag.appendChild(div);
            }
            this.move.innerHTML='';
            this.move.appendChild(frag);
          }

          // 2) Duplicate content to create seamless loop
          const ensureWidth = () => {
            const target = this.root.clientWidth * 2;
            let cycles = 0;
            while(this.move.scrollWidth < target && cycles < 20){
              this.move.innerHTML += this.move.innerHTML;
              cycles++;
            }
          };
          ensureWidth();

          // 3) Smooth scroll using rAF
          const tick = () => {
            this.root.scrollLeft += this.speed;
            if(this.root.scrollLeft >= (this.move.scrollWidth - this.root.clientWidth)){
              this.root.scrollLeft = 0;
            }
            this._raf = requestAnimationFrame(tick);
          };

          // 4) Pause on hover
          const pause = () => { if(this._raf){ cancelAnimationFrame(this._raf); this._raf = null; } };
          const resume = () => { if(!this._raf){ this._raf = requestAnimationFrame(tick); } };
          this.root.addEventListener('mouseenter', pause);
          this.root.addEventListener('mouseleave', resume);

          // Start
          resume();
        }
      }
      stop(){ if(this._raf){ cancelAnimationFrame(this._raf); this._raf = null; } }
    }
    class SystemTicker extends Ticker{}
    window.Ticker = Ticker;
    window.SystemTicker = SystemTicker;
  }
})();


