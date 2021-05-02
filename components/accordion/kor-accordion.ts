import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators';
import { sharedStyles } from '../../shared-styles';
import '../icon';
import '../card';

/**
 * @prop {String} label -	Defines the text label.
 * @prop {String} icon - If set, defines the icon shown before the label.
 * @prop {Boolean} expanded -	If set to true, expands the accordion to display its content.
 * @prop {Boolean} disabled -	If set to true, disables mouse clicks and the style gets updated.
 *
 * @slot - Displayed inside the accordion when it is expanded.
 * @slot header - If used, the header slot replaces the default text label and expand arrow with custom content.
 * @slot functions - Displayed close to the 'expand' arrow.
 * @slot footer - Displayed below the content when it is expanded.
 */

export class korAccordion extends LitElement {
  @property({ type: String, reflect: true }) label = 'Label';
  @property({ type: String, reflect: true }) icon;
  @property({ type: Boolean, reflect: true }) expanded;
  @property({ type: Boolean, reflect: true }) disabled;

  // readonly properties
  /** @ignore */
  @property({ type: Boolean }) emptyHeader = true;
  /** @ignore */
  @property({ type: Boolean }) emptyFunctions = true;
  /** @ignore */
  @property({ type: Boolean }) emptyBody = true;
  /** @ignore */
  @property({ type: Boolean }) emptyFooter = true;

  static get styles() {
    return [
      sharedStyles,
      css`
        :host(:not([expanded])) kor-card {
          cursor: pointer;
        }
        kor-card {
          padding: 8px 16px;
        }
        slot:not([name]) {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          transition: var(--transition-1);
        }
        /* expanded */
        :host(:not([expanded])) slot:not([name]) {
          margin-top: 0;
          max-height: 0px;
          opacity: 0;
          overflow: hidden;
        }
        .header {
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex: 1;
        }
        .icon {
          margin-right: 8px;
        }
        slot[name='header'] p {
          margin-right: 8px;
          font: var(--header-1);
          color: var(--text-1);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 0;
          flex: 1;
        }
        :host([expanded]) .expand {
          transform: rotate(180deg);
        }
        /* disabled */
        :host([disabled]) .header {
          opacity: 0.2;
        }
        :host([disabled]) kor-card {
          pointer-events: none;
        }
      `,
    ];
  }

  render() {
    return html`
      <kor-card
        @click="${() => (!this.expanded ? (this.expanded = true) : '')}"
      >
        <slot
          name="header"
          slot="header"
          @click="${(e) => this.handleCollapse(e)}"
        >
          <div class="header">
            ${this.icon
        ? html` <kor-icon class="icon" icon="${this.icon}"></kor-icon> `
        : ''}
            <p>${this.label}</p>
            <kor-icon
              button
              class="expand"
              icon="keyboard_arrow_down"
            ></kor-icon>
          </div>
        </slot>
        <slot></slot>
        <slot name="functions" slot="functions"></slot>
        ${this.expanded
        ? html`
              <slot
                name="footer"
                slot="${this.emptyFooter ? undefined : 'footer'}"
                @slotchange="${(e) =>
            (this.emptyFooter = e.target.assignedNodes().length === 0)}"
              ></slot>
            `
        : ''}
      </kor-card>
    `;
  }

  attributeChangedCallback(name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval);
    this.dispatchEvent(new Event(`${name}-changed`));
  }

  connectedCallback() {
    super.connectedCallback();
    // remove card padding
    setTimeout(() => {
      const topNode: any = this.shadowRoot
        .querySelector('kor-card')
        .shadowRoot.querySelector('.top');
      topNode.style.padding = '0';
    }, 0);
  }

  handleCollapse(e) {
    if (this.expanded) {
      this.expanded = false;
      e.stopPropagation();
    }
  }
}

if (!window.customElements.get('kor-accordion')) {
  window.customElements.define('kor-accordion', korAccordion);
}
