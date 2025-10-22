(function () {
  // Run after DOM is ready even if defer was removed
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // ---- Elements
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('nav');
    if (navToggle && nav) {
      navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        nav.toggleAttribute('hidden');
      });
    }

    const figure = byId('charFigure');
    const imageEl = byId('charImage');
    const formTag = byId('formTag');

    const nameEl = byId('charName');
    const aliasEl = byId('charAlias');
    const dobEl = byId('charDob');
    const heightEl = byId('charHeight');
    const bloodEl = byId('charBlood');
    const formEl = byId('charForm');
    const bioEl = byId('charBio');

    const roseSwitch = byId('roseSwitch');
    const roseIcon = byId('roseIcon');
    const roseLabel = byId('roseLabel');

    // If any critical element is missing, bail with a helpful message
    const critical = [figure, imageEl, formTag, nameEl, aliasEl, dobEl, heightEl, bloodEl, formEl, bioEl, roseSwitch];
    if (critical.some(el => !el)) {
      console.error('[Characters] Missing required elements. Check IDs in HTML.');
      return;
    }

    // ---- Data
    const DATA = {
      hiro: {
        name: "Hiro Mashida",
        alias: "The White Rose",
        dob: "April 20, 2004 (21)",
        height: `5'9" (175 cm)`,
        blood: "O−",
        bio: {
          human:
            "Hiro is a young college student, born and raised in Vancouver, Canada. The routine of a young adult wears him down day by day, making him question his path—until he meets Momoka, who brings color to his colorless world. He can’t deny a woman like Momoka.",
          vampire:
            "After surrendering to Momoka’s sweetness, Hiro turns. What once felt like a curse now looks like salvation—a new reason to exist. He feels alive, so alive he could die."
        },
        img: {
          human: "images/characters/hiro-human.jpg",
          vampire: "images/characters/hiro-vampire.jpg"
        }
      },
      momoka: {
        name: "Momoka Wakui",
        alias: "The Red Rose",
        dob: "March 27, 1904 (121)",
        height: `5'5" (165 cm)`,
        blood: "—",
        bio: {
          human:
            "Momoka is a century-old vampire who has wandered the world for a very long time. Witty, careful, and manipulative, she chooses her prey and leaves no trace. She never considered turning anyone—until she fell for Hiro’s innocence and purity.",
          vampire:
            "Fangs bared, she moves with intention. She wants to dye this white rose red and make it hers—forever."
        },
        img: {
          human: "images/characters/momoka-human.png",
          vampire: "images/characters/momoka-vampire.png"
        }
      }
    };

    // ---- State
    let current = 'hiro';  // 'hiro' | 'momoka'
    let form = 'human';    // 'human' | 'vampire'

    // ---- Render
    function render() {
      const d = DATA[current];
      if (!d) return;

      // swap image with soft animation (guard if src missing)
      figure.classList.add('is-swapping');
      setTimeout(() => {
        const nextSrc = (d.img && d.img[form]) ? d.img[form] : '';
        if (nextSrc) imageEl.src = nextSrc;
        imageEl.alt = `${d.name} in ${form} form`;
        figure.classList.remove('is-swapping');
      }, 180);

      nameEl.textContent = d.name;
      aliasEl.textContent = d.alias;
      dobEl.textContent = d.dob;
      heightEl.textContent = d.height;
      bloodEl.textContent = d.blood;

      const formLabel = cap1(form);
      formEl.textContent = formLabel;
      formTag.textContent = formLabel;

      const bioText = (d.bio && (d.bio[form] || d.bio.human)) || '';
      bioEl.textContent = bioText;

      // Theme flip: persists across character switches
      document.documentElement.classList.toggle('vampire', form === 'vampire');

      // Rose shows the OTHER character you can switch to
      if (roseIcon) {
        roseIcon.src = (current === 'hiro')
          ? 'icons/red-rose.png'
          : 'icons/white-rose.png';
      }
      if (roseLabel) {
        roseLabel.textContent = (current === 'hiro') ? 'Switch to Momoka' : 'Switch to Hiro';
      }

      // reflect pressed state on the figure
      figure.setAttribute('aria-pressed', String(form === 'vampire'));
    }

    // ---- Interactions
    function toggleForm() {
      form = (form === 'human') ? 'vampire' : 'human';
      render();
    }
    function switchCharacter() {
      current = (current === 'hiro') ? 'momoka' : 'hiro';
      render();
    }

    figure.addEventListener('click', toggleForm);
    figure.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleForm(); }
    });

    roseSwitch.addEventListener('click', switchCharacter);
    roseSwitch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); switchCharacter(); }
    });

    // Initial paint
    render();

    // Tiny debug helper: type svCharState() in console
    window.svCharState = function () {
      return { current, form, imageSrc: imageEl?.src || null };
    };

    // Utils
    function byId(id) { return document.getElementById(id); }
    function cap1(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
  }
})();
