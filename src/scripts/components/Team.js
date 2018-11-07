import { $insertAfter } from '../utils/toolbox';
import { Slidy } from 'epic-slidy';

export default class Team {
  constructor (el) {
    // On stocke quelques informations utiles pour la suite
    this.el = el;
    this.elWidth = el.offsetWidth;
    this.items = el.children;
    this.itemWidth = this.items[0].offsetWidth;
    this.nb = this.items.length;
    this.current = Math.floor(this.nb / 2);
    // On initialise = setup initial
    this.init();
  }

  /**
   * Init method
   *
   * @returns {undefined}
   * @memberof Team
   */
  init () {
    // On décale le conteneur
    this.translate(this.current);

    // On crée l'input de type range (aka trigger)
    // Méthode "classique"
    // this.trigger = document.createElement('input');
    // this.trigger.classList.add('team__trigger');
    // this.trigger.setAttribute('type', 'range');
    // this.trigger.setAttribute('min', '0');
    // this.trigger.setAttribute('max', this.nb - 1);
    // this.trigger.value = this.current;

    // Méthode "template"
    const tpl = document.createElement('template');
    const html = `<input class="team__trigger"
      type="range"
      min="0"
      max="${this.nb - 1}"
      value="${this.current}"
      step="any"
    >`;
    tpl.innerHTML = html;
    this.trigger = tpl.content.firstChild;

    // On ajoute le trigger
    // Via le parent
    // this.el.parentNode.appendChild(input);
    // Ou directement aprés le `ul`
    $insertAfter(this.trigger, this.el);

    // On écoute les changements via un callback avec le bon contexte
    this.onChange = this.onChange.bind(this);
    this.trigger.addEventListener('input', this.onChange);

    // On initialise le slider
    // L'index initial est l'index de l'item courant
    // On lui passe le contexte de l'instance comme dernier paramètre
    // qui sera accessible via `sliderInstance.context`
    this.slider = new Slidy(this.el, {
      index: this.current,
      loop: false,
      swipe: true,
      transition: this.animation
    }, this);
  }

  /**
   * Changement déclenché par le `trigger`
   *
   * @param {InputEvent} e de l'input de type range
   * @returns {undefined}
   * @memberof Team
   */
  onChange (e) {
    // On arrondit la valeur reçue
    const index = Math.round(e.currentTarget.value);

    // Lorsqu'elle diffère de la valeur actuelle…
    if (index !== this.current) {
      // On anime le slider vers nouvel index
      this.slider.slideTo(index);
      // On met à jour l'index courant pour la suite
      this.current = index;
    }
  }

  /**
   * Animation de la transition du slider
   *
   * @param {HTMLElement} currentSlide item courant
   * @param {HTMLElement} newSlide item suivant
   * @param {string} direction prev | next
   * @returns {promise} fin de l'animation (Slidy attend un promesse résolue)
   * @memberof Team
   */
  animation (currentSlide, newSlide, direction) {
    // Actuellement, tout est fait via CSS…
    // Si on veut une animation plus complexe, c'est ici que ça se passe…
    return new Promise(resolve => {
      this.context.translate(Number(this.newIndex));
      // Comme Slidy supporte le swipe ou le click,
      // on met également à jour le trigger, si nécessaire…
      this.context.trigger.value = this.newIndex;
      resolve();
    });
  }

  /**
   * Décalage du conteneur
   * - négatif de `x` items (selon index) + widthItem / 2
   * - positif de la moitié du conteneur
   * @param {number} index de l'item à centrer
   * @returns {undefined}
   * @memberof Team
   */
  translate (index) {
    // On calcule le décalage
    const x = -(index + 0.5) * this.itemWidth + this.elWidth / 2;

    this.el.style.transform = `translateX(${x}px)`;
  }
}
