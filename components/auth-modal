class AuthModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        
        .modal-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        
        .modal-content {
          background: #16161a;
          border-radius: 16px;
          width: 90%;
          max-width: 400px;
          padding: 2rem;
          position: relative;
        }
        
        .close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #7f5af0;
          font-size: 1.5rem;
          cursor: pointer;
        }
        
        .tabs {
          display: flex;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #242629;
        }
        
        .tab {
          padding: 0.5rem 1rem;
          cursor: pointer;
          color: #7f5af0;
          border-bottom: 2px solid transparent;
        }
        
        .tab.active {
          border-bottom-color: #7f5af0;
        }
        
        .tab-content {
          display: none;
        }
        
        .tab-content.active {
          display: block;
        }
      </style>
      
      <div class="modal-overlay">
        <div class="modal-content">
          <button class="close-button">&times;</button>
          
          <div class="tabs">
            <div class="tab active" data-tab="login">Login</div>
            <div class="tab" data-tab="register">Register</div>
          </div>
          
          <div class="tab-content active" id="login-content">
            <form id="login-form">
              <div class="form-group">
                <label for="login-email">Email</label>
                <input type="email" id="login-email" required>
              </div>
              
              <div class="form-group">
                <label for="login-password">Password</label>
                <input type="password" id="login-password" required>
              </div>
              
              <button type="submit">Login</button>
            </form>
          </div>
          
          <div class="tab-content" id="register-content">
            <form id="register-form">
              <div class="form-group">
                <label for="register-username">Username</label>
                <input type="text" id="register-username" required>
              </div>
              
              <div class="form-group">
                <label for="register-email">Email</label>
                <input type="email" id="register-email" required>
              </div>
              
              <div class="form-group">
                <label for="register-password">Password</label>
                <input type="password" id="register-password" required>
              </div>
              
              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.close-button').addEventListener('click', () => this.close());
    
    this.shadowRoot.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });
    
    this.shadowRoot.querySelector('#login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = e.target.elements['login-email'].value;
      const password = e.target.elements['login-password'].value;
      this.dispatchEvent(new CustomEvent('login', { detail: { email, password } }));
    });
    
    this.shadowRoot.querySelector('#register-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const username = e.target.elements['register-username'].value;
      const email = e.target.elements['register-email'].value;
      const password = e.target.elements['register-password'].value;
      this.dispatchEvent(new CustomEvent('register', { detail: { username, email, password } }));
    });
  }

  open() {
    this.shadowRoot.querySelector('.modal-overlay').classList.add('active');
  }

  close() {
    this.shadowRoot.querySelector('.modal-overlay').classList.remove('active');
  }

  switchTab(tabName) {
    this.shadowRoot.querySelectorAll('.tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    this.shadowRoot.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `${tabName}-content`);
    });
  }
}

customElements.define('auth-modal', AuthModal);
