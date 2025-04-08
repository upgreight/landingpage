// Zentrale Swiper Animation Konfiguration
const swiperAnimationConfig = {
  speed: 800,
  on: {
    init: function() {
      this.slides.forEach(slide => {
        slide.style.transitionTimingFunction = 'cubic-bezier(0.34, 1.8, 0.64, 1)';
      });
    }
  }
};

// Hero Heading Animation
document.addEventListener('DOMContentLoaded', () => {
    const headingWrapper = document.querySelector('.hero_heading-wrapper');
    if (!headingWrapper) return;
  
    const heading = headingWrapper.querySelector('.heading-style-h1');
    if (!heading) return;
  
    heading.style.visibility = 'hidden';
    heading.style.opacity = 0;
  
    const staggerEls = heading.querySelectorAll('.hero_heading-stagger');
  
    // Jedes Stagger-Element mit einzelnen Wörtern vorbereiten
    staggerEls.forEach(staggerEl => {
      const text = staggerEl.textContent.trim();
      // Text in Wörter aufteilen und jedes Wort mit einem span umgeben
      const words = text.split(' ');
      staggerEl.innerHTML = '';
      
      words.forEach((word, index) => {
        const wordSpan = document.createElement('span');
        wordSpan.classList.add('hero_heading-word');
        wordSpan.style.opacity = '0';
        wordSpan.style.transform = 'translateY(16px)';
        wordSpan.style.display = 'inline-block';
        wordSpan.textContent = word;
        staggerEl.appendChild(wordSpan);
        
        // Füge ein Leerzeichen zwischen den Wörtern hinzu (außer beim letzten Wort)
        if (index < words.length - 1) {
          staggerEl.appendChild(document.createTextNode(' '));
        }
      });
    });
  
    const wordElements = heading.querySelectorAll('.hero_heading-word');
  
    const tl = gsap.timeline({
      defaults: {
        duration: 1.2,
        ease: 'power2.out'
      },
      delay: 0.4
    });
  
    tl.set(heading, { autoAlpha: 1 });
  
    tl.to(wordElements, {
      autoAlpha: 1,
      y: 0,
      stagger: 0.08, // Schnellere Stagger-Zeit für einzelne Wörter
      duration: 0.8 // Kürzere Duration für flüssigere Animation
    }, 0);
  });
  
  
  // Date Picker and Form Setup
  document.addEventListener('DOMContentLoaded', function() {
  
    let heroSelectedDates = [];
    let heroAdultsCount = 2;
    let heroChildrenCount = 0;
    let formAdultsCount = 2;
    let formChildrenCount = 0;
    let formDateInstance = null;
  
    function formatFancyRange(selectedDates, instance) {
      if (!selectedDates || selectedDates.length < 1) return "";
      return selectedDates.map(function(d) {
        return instance.formatDate(d, instance.config.dateFormat);
      }).join(" bis ");
    }
  
    function formatTechnicalRange(selectedDates) {
      if (!selectedDates || selectedDates.length < 1) return "";
      return selectedDates.map(function(d) {
        let yyyy = d.getFullYear();
        let mm = ("0" + (d.getMonth() + 1)).slice(-2);
        let dd = ("0" + d.getDate()).slice(-2);
        return yyyy + "-" + mm + "-" + dd;
      }).join(" - ");
    }
  
    function updateNightsDisplay(selectedDates) {
      const nightsEl = document.querySelector('[data-summary-nights]');
      if (!nightsEl) return;
      if (!selectedDates || selectedDates.length < 2) {
        nightsEl.style.visibility = 'hidden';
        return;
      }
      const diff = Math.round((selectedDates[1] - selectedDates[0]) / 86400000);
      const nights = diff < 1 ? 1 : diff;
      nightsEl.style.visibility = 'visible';
      const label = (nights === 1) ? "1 Übernachtung" : (nights + " Übernachtungen");
      if (nightsEl.value !== undefined) {
        nightsEl.value = label;
      } else {
        nightsEl.textContent = label;
      }
    }
  
    if (window.innerWidth >= 992) {
      setTimeout(function() {
        const compEl = document.querySelector('.picker_component');
        if (compEl) compEl.classList.add('show');
  
        flatpickr('.picker_date', {
          mode: "range",
          dateFormat: "D., d. M.",
          minDate: "today",
          locale: "de",
          static: true,
          position: "above",
          onReady: function(selectedDates, dateStr, instance) {
            const cal = instance.calendarContainer;
            if (cal) {
              cal.classList.add('picker_initial-position');
              const extra = cal.querySelectorAll("input[name^='field']");
              extra.forEach(f => f.removeAttribute('name'));
            }
          },
          onChange: function(sel, ds, inst) {
            heroSelectedDates = sel;
            const heroTextEl = document.querySelector('[data-picker="date-text"]');
            if (heroTextEl) {
              if (heroTextEl.value !== undefined) {
                heroTextEl.value = ds || "Datum auswählen";
              } else {
                heroTextEl.textContent = ds || "Datum auswählen";
              }
            }
          }
        });
  
        (function () {
          const pickerTrigger = document.querySelector('[data-open-popup-persons=""]');
          const pickerPopup = document.querySelector('[data-popup-persons=""]');
          const pickerText = document.querySelector('[data-picker="persons-text"]');
          const adultsCounterText = document.querySelector('[data-counter="adults-text"]');
          const childrenCounterText = document.querySelector('[data-counter="childs-text"]');
          const closeButton = pickerPopup ? pickerPopup.querySelector('[data-custom="submit-person"]') : null;
          const controls = pickerPopup ? pickerPopup.querySelectorAll('[data-controls]') : null;
          if (!pickerTrigger || !pickerPopup || !closeButton || !controls) return;
  
          pickerTrigger.addEventListener("click", function() {
            if (pickerPopup.getAttribute("aria-hidden") === "true") {
              pickerPopup.style.display = "block";
              pickerPopup.style.opacity = 0;
              
              requestAnimationFrame(() => {
                pickerPopup.style.opacity = 1;
                pickerPopup.setAttribute("aria-hidden", "false");
                pickerTrigger.setAttribute("aria-expanded", "true");
              });
            }
          });
  
          function closePopup() {
            // Erst den Fokus entfernen
            const focusedElement = document.activeElement;
            if (focusedElement && pickerPopup.contains(focusedElement)) {
              focusedElement.blur();
            }
            
            pickerTrigger.setAttribute("aria-expanded", "false");
            pickerPopup.style.opacity = 0;
            
            // Warten auf das Ende der Animation
            setTimeout(() => {
              pickerPopup.style.display = "none";
              pickerPopup.setAttribute("aria-hidden", "true");
            }, 300);
          }
  
          closeButton.addEventListener("click", function() {
            if (pickerText) {
              const txt = (heroAdultsCount === 1
                ? heroAdultsCount + " Erwachsener, " + (heroChildrenCount === 1 ? heroChildrenCount + " Kind" : heroChildrenCount + " Kinder")
                : heroAdultsCount + " Erwachsene, " + (heroChildrenCount === 1 ? heroChildrenCount + " Kind" : heroChildrenCount + " Kinder"));
              if (pickerText.value !== undefined) {
                pickerText.value = txt;
              } else {
                pickerText.textContent = txt;
              }
            }
            closePopup();
          });
  
          document.addEventListener("click", function(e) {
            if (!pickerPopup.contains(e.target) && e.target !== pickerTrigger) {
              closePopup();
            }
          });
  
          controls.forEach(function(ctrl) {
            ctrl.addEventListener("click", function() {
              const t = ctrl.getAttribute("data-controls");
              const wrap = ctrl.closest(".picker_persons-wrapper");
              const cEl = wrap.querySelector("[data-counter]");
              const cType = cEl ? cEl.dataset.counter : "";
              if (cType === "adults-text") {
                if (t === "plus") heroAdultsCount++;
                else if (t === "minus" && heroAdultsCount > 1) heroAdultsCount--;
                if (adultsCounterText) {
                  const valA = (heroAdultsCount === 1) ? heroAdultsCount + " Erwachsener" : heroAdultsCount + " Erwachsene";
                  if (adultsCounterText.value !== undefined) adultsCounterText.value = valA;
                  else adultsCounterText.textContent = valA;
                }
                const minusB = wrap.querySelector('[data-controls="minus"]');
                if (minusB) {
                  if (heroAdultsCount === 1) minusB.classList.add("is-disabled");
                  else minusB.classList.remove("is-disabled");
                }
              } else if (cType === "childs-text") {
                if (t === "plus") heroChildrenCount++;
                else if (t === "minus" && heroChildrenCount > 0) heroChildrenCount--;
                if (childrenCounterText) {
                  const valC = (heroChildrenCount === 1) ? heroChildrenCount + " Kind" : heroChildrenCount + " Kinder";
                  if (childrenCounterText.value !== undefined) childrenCounterText.value = valC;
                  else childrenCounterText.textContent = valC;
                }
                const minusB = wrap.querySelector('[data-controls="minus"]');
                if (minusB) {
                  if (heroChildrenCount === 0) minusB.classList.add("is-disabled");
                  else minusB.classList.remove("is-disabled");
                }
              }
            });
          });
        })();
  
        const heroRequestBtn = document.querySelector('[data-custom="transfer-hero-data"]');
        if (heroRequestBtn) {
          heroRequestBtn.addEventListener('click', function() {
            if (heroSelectedDates && heroSelectedDates.length > 0) {
              window.__heroData = {
                dates: heroSelectedDates,
                adults: heroAdultsCount,
                children: heroChildrenCount
              };
              if (formDateInstance) {
                formDateInstance.setDate(window.__heroData.dates, false);
                const fancy = formatFancyRange(window.__heroData.dates, formDateInstance);
                const tech = formatTechnicalRange(window.__heroData.dates);
                const formDateVisible = document.querySelector('.form_picker-date[data-picker="date-text-form"]');
                const formDateHidden = document.querySelector('[data-picker="date-hidden-form"]');
                formDateVisible.value = fancy || "";
                if (formDateHidden) formDateHidden.value = tech;
              }
              formAdultsCount = heroAdultsCount;
              formChildrenCount = heroChildrenCount;
              const pCont = document.querySelector('.form_picker-persons');
              if (pCont) {
                const w = pCont.querySelectorAll('.form_picker-persons-wrapper');
                if (w.length >= 2) {
                  const aWrap = w[0];
                  const cWrap = w[1];
                  const formAdultsText = aWrap.querySelector('[data-counter="adults-text-form"]');
                  const formChildsText = cWrap.querySelector('[data-counter="childs-text-form"]');
                  if (formAdultsText) {
                    const valA = (formAdultsCount === 1) ? formAdultsCount + " Erwachsener" : formAdultsCount + " Erwachsene";
                    if (formAdultsText.value !== undefined) formAdultsText.value = valA;
                    else formAdultsText.textContent = valA;
                    const minusBA = aWrap.querySelector('[data-controls="minus"]');
                    if (minusBA) {
                      if (formAdultsCount === 1) minusBA.classList.add("is-disabled");
                      else minusBA.classList.remove("is-disabled");
                    }
                  }
                  if (formChildsText) {
                    const valC = (formChildrenCount === 1) ? formChildrenCount + " Kind" : formChildrenCount + " Kinder";
                    if (formChildsText.value !== undefined) formChildsText.value = valC;
                    else formChildsText.textContent = valC;
                    const minusBC = cWrap.querySelector('[data-controls="minus"]');
                    if (minusBC) {
                      if (formChildrenCount === 0) minusBC.classList.add("is-disabled");
                      else minusBC.classList.remove("is-disabled");
                    }
                  }
                }
              }
              updateNightsDisplay(heroSelectedDates);
            }
          });
        }
      }, 600);
    }
  
    const formDateEl = document.querySelector('.form_picker-date[data-picker="date-text-form"]');
    const formDateHiddenEl = document.querySelector('[data-picker="date-hidden-form"]');
    if (formDateEl) {
      const flatpickrConfig = {
        mode: "range",
        dateFormat: "D., d. M.",
        minDate: "today",
        locale: "de",
        static: true,
        position: "below",
        onReady: function(sel, ds, inst) {
          const cal = inst.calendarContainer;
          if (cal) {
            cal.classList.add('form_picker_initial-position');
            const extraFields = cal.querySelectorAll("input[name^='field']");
            extraFields.forEach(f => f.removeAttribute('name'));
          }
        },
        onChange: function(sel, ds, inst) {
          if (!sel || sel.length === 0) {
            formDateEl.value = "";
          } else {
            formDateEl.value = formatFancyRange(sel, inst);
          }
          if (formDateHiddenEl) {
            formDateHiddenEl.value = formatTechnicalRange(sel);
          }
          updateNightsDisplay(sel);
        }
      };

      formDateInstance = flatpickr(formDateEl, {
        ...flatpickrConfig,
        showMonths: window.innerWidth >= 992 ? 2 : 1
      });
      
      window.addEventListener('resize', debounce(function() {
        if (!formDateInstance) return;
        
        const newShowMonths = window.innerWidth >= 992 ? 2 : 1;
        if (formDateInstance.config.showMonths === newShowMonths) return;
        
        const currentDates = formDateInstance.selectedDates;
        formDateInstance.destroy();
        
        formDateInstance = flatpickr(formDateEl, {
          ...flatpickrConfig,
          showMonths: newShowMonths
        });
        
        if (currentDates?.length > 0) {
          formDateInstance.setDate(currentDates);
        }
      }, 250));
    }
  
    function debounce(func, wait) {
      let timeout;
      return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
          func.apply(context, args);
        }, wait);
      };
    }
  
    (function initFormPersons() {
      const pCont = document.querySelector('.form_picker-persons');
      if (!pCont) return;
      const w = pCont.querySelectorAll('.form_picker-persons-wrapper');
      if (w.length < 2) return;
      const aWrap = w[0];
      const cWrap = w[1];
      const formAdultsText = aWrap.querySelector('[data-counter="adults-text-form"]');
      const formChildsText = cWrap.querySelector('[data-counter="childs-text-form"]');
      if (formAdultsText) {
        if (formAdultsText.value !== undefined) formAdultsText.value = "2 Erwachsene";
        else formAdultsText.textContent = "2 Erwachsene";
      }
      if (formChildsText) {
        if (formChildsText.value !== undefined) formChildsText.value = "0 Kinder";
        else formChildsText.textContent = "0 Kinder";
      }
      const aCtrls = aWrap.querySelectorAll('[data-controls]');
      aCtrls.forEach(function(ctrl) {
        ctrl.addEventListener('click', function() {
          const t = ctrl.getAttribute("data-controls");
          if (t === "plus") formAdultsCount++;
          else if (t === "minus" && formAdultsCount > 1) formAdultsCount--;
          const valA = (formAdultsCount === 1) ? formAdultsCount + " Erwachsener" : formAdultsCount + " Erwachsene";
          if (formAdultsText) {
            if (formAdultsText.value !== undefined) formAdultsText.value = valA;
            else formAdultsText.textContent = valA;
          }
          const minusB = ctrl.closest('.form_picker-persons-wrapper').querySelector('[data-controls="minus"]');
          if (minusB) {
            if (formAdultsCount === 1) minusB.classList.add("is-disabled");
            else minusB.classList.remove("is-disabled");
          }
        });
      });
      const cCtrls = cWrap.querySelectorAll('[data-controls]');
      cCtrls.forEach(function(ctrl) {
        ctrl.addEventListener('click', function() {
          const t = ctrl.getAttribute("data-controls");
          if (t === "plus") formChildrenCount++;
          else if (t === "minus" && formChildrenCount > 0) formChildrenCount--;
          const valC = (formChildrenCount === 1) ? formChildrenCount + " Kind" : formChildrenCount + " Kinder";
          if (formChildsText) {
            if (formChildsText.value !== undefined) formChildsText.value = valC;
            else formChildsText.textContent = valC;
          }
          const minusB = ctrl.closest('.form_picker-persons-wrapper').querySelector('[data-controls="minus"]');
          if (minusB) {
            if (formChildrenCount === 0) minusB.classList.add("is-disabled");
            else minusB.classList.remove("is-disabled");
          }
        });
      });
    })();
  
    (function customValidationSetup() {
      const myForm = document.querySelector('form');
      if (!myForm) return;
      function showElement(el, displayType = "block") {
        el.style.display = displayType;
        el.style.visibility = "visible";
      }
      function hideElement(el) {
        el.style.display = "none";
        el.style.visibility = "hidden";
      }
      function validateRequiredFields(showErrors = false) {
        let isFormValid = true;
        let firstErrorElement = null;
        document.querySelectorAll("[data-required]").forEach((requiredGroup) => {
          const inputs = requiredGroup.querySelectorAll("input, select, textarea");
          let isGroupValid = true;
          inputs.forEach((input) => {
            if (input.type === "checkbox" || input.type === "radio") {
            } else {
              if (input.value.trim() === "") {
                isGroupValid = false;
              }
            }
          });
          const checkable = Array.from(inputs).filter(input => input.type === "checkbox" || input.type === "radio");
          if (checkable.length > 0) {
            if (!checkable.some(input => input.checked)) {
              isGroupValid = false;
            }
          }
          const errorElement = requiredGroup.querySelector('.form_error');
          if (!isGroupValid) {
            isFormValid = false;
            if (showErrors && errorElement) {
              showElement(errorElement, "block");
              errorElement.setAttribute("aria-live", "polite");
            }
            if (!firstErrorElement) firstErrorElement = errorElement;
          } else {
            if (errorElement) {
              hideElement(errorElement);
              errorElement.removeAttribute("aria-live");
            }
          }
        });
        return { isFormValid, firstErrorElement };
      }
      myForm.action = "https://form.taxi/s/hao3m8ab";
      const thankYouURL = "https://upgreight-landingpage.webflow.io/danke";
      myForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const { isFormValid, firstErrorElement } = validateRequiredFields(true);
        if (!isFormValid) {
          if (firstErrorElement) {
            firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          return;
        }
        const submitButton = myForm.querySelector('button[type="submit"], #submit-button');
        let originalText = "";
        if (submitButton) {
          originalText = submitButton.textContent;
          submitButton.disabled = true;
          submitButton.textContent = "Bitte warten...";
        }
        fetch(myForm.action, {
          method: myForm.method || "POST",
          body: new FormData(myForm),
          headers: { "Accept": "application/json" }
        })
        .then(response => {
          if (response.ok) {
            window.location.href = thankYouURL;
          } else {
            throw new Error("Fehler beim Absenden des Formulars.");
          }
        })
        .catch(error => {
          console.error(error);
          const errorMessage = myForm.querySelector(".form_error-message");
          if (errorMessage) {
            showElement(errorMessage, "block");
          }
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
          }
        });
      });
      document.querySelectorAll("[data-required]").forEach((requiredGroup) => {
        const inputs = requiredGroup.querySelectorAll("input, select, textarea");
        inputs.forEach((input) => {
          input.addEventListener("change", () => {
            let isValidNow = true;
            if (input.type === "checkbox" || input.type === "radio") {
              const checkable = Array.from(requiredGroup.querySelectorAll("input[type='checkbox'], input[type='radio']"));
              if (!checkable.some(inp => inp.checked)) {
                isValidNow = false;
              }
            } else {
              if (input.value.trim() === "") {
                isValidNow = false;
              }
            }
            if (isValidNow) {
              const errorElement = requiredGroup.querySelector('.form_error');
              if (errorElement) hideElement(errorElement);
            }
          });
        });
      });
    })();
  
  });
  
  
  // Topic Buttons & Default Setup
  document.addEventListener('DOMContentLoaded', function() {
    const topicButtons = document.querySelectorAll('.topic_button[data-topic]');
    topicButtons.forEach(button => {
      button.setAttribute('aria-selected', 'false');
      button.addEventListener('click', function() {
        topicButtons.forEach(btn => {
          btn.classList.remove('is-active');
          btn.setAttribute('aria-selected', 'false');

          const parentSlide = btn.closest('.swiper-slide');
          if (parentSlide) {
            parentSlide.setAttribute('aria-selected', 'false');
          }
        });
        button.classList.add('is-active');
        button.setAttribute('aria-selected', 'true');

        const parentSlide = button.closest('.swiper-slide');
        if (parentSlide) {
          parentSlide.setAttribute('aria-selected', 'true');
        }

        const topic = button.getAttribute('data-topic').toLowerCase();
        const evt = new CustomEvent('topicChange', { detail: { topic, manual: true } });
        document.dispatchEvent(evt);
        if (window.topicSwiper) {
          const index = Array.from(topicButtons).findIndex(btn => btn === button);
          window.topicSwiper.slideTo(index);
        }
      });
    });
    
    const urlParams = new URLSearchParams(window.location.search);
    const urlTopic = urlParams.get('topic');
    let defaultTopic = urlTopic ? urlTopic.toLowerCase() : null;
    if (!defaultTopic && topicButtons.length > 0) {
      defaultTopic = topicButtons[0].getAttribute('data-topic').toLowerCase();
    }
    topicButtons.forEach((btn, index) => {
      const btnTopic = btn.getAttribute('data-topic').toLowerCase();
      if (btnTopic === defaultTopic) {
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        
        const parentSlide = btn.closest('.swiper-slide');
        if (parentSlide) {
          parentSlide.setAttribute('aria-selected', 'true');
        }
        
        const evt = new CustomEvent('topicChange', { detail: { topic: defaultTopic, manual: false } });
        document.dispatchEvent(evt);
        setTimeout(() => {
          if (window.topicSwiper) {
            window.topicSwiper.slideTo(index);
          }
        }, 100);
      } else {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-selected', 'false');
        
        const parentSlide = btn.closest('.swiper-slide');
        if (parentSlide) {
          parentSlide.setAttribute('aria-selected', 'false');
        }
      }
    });
  });
  
  // Topic Banner Animation
  let topicBannerTl;
  document.addEventListener('topicChange', function(e) {
    if (!e.detail.manual) return;
    if (topicBannerTl) topicBannerTl.kill();
    const bannerEl = document.querySelector('.topic_banner');
    if (!bannerEl) return;
    const newTopic = e.detail.topic;
    const bannerText = document.getElementById('topic-banner-text');
    if (bannerText) {
      bannerText.textContent = newTopic;
    }
    topicBannerTl = gsap.timeline();
    topicBannerTl.set(bannerEl, {
      y: '-20vh',
      opacity: 0,
      filter: 'blur(40px)',
      display: 'block'
    });
    topicBannerTl.to(bannerEl, {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.4,
      ease: 'power2.out'
    });
    topicBannerTl.to(bannerEl, { duration: 2 });
    topicBannerTl.to(bannerEl, {
      y: '-20vh',
      opacity: 0,
      filter: 'blur(40px)',
      duration: 0.3,
      onComplete: function() {
        bannerEl.style.display = 'none';
      }
    });
  });
  
  
  // Topic Swiper
  document.addEventListener("DOMContentLoaded", function () {
    // ARIA-Rollen für alle Swiper korrigieren
    function correctSwiperARIARoles() {
      // Korrektur für den Topic-Filter (Tabs)
      const topicWrapper = document.querySelector('.swiper-wrapper.is-topic');
      if (topicWrapper) {
        // Topic Filter braucht ein Tablist/Tab Modell
        topicWrapper.setAttribute('role', 'tablist');
        
        // Die Slides selbst sind jetzt die Tabs (nicht mehr presentation)
        const topicSlides = topicWrapper.querySelectorAll('.swiper-slide');
        topicSlides.forEach(slide => {
          slide.setAttribute('role', 'tab');
          // Initialen aria-selected Zustand setzen, falls nicht schon gesetzt
          if (!slide.hasAttribute('aria-selected')) {
            slide.setAttribute('aria-selected', 'false');
          }
        });
        
        // Setze das erste Slide als selected, falls keines selected ist
        const anySelected = Array.from(topicSlides).some(slide => 
          slide.getAttribute('aria-selected') === 'true');
        if (!anySelected && topicSlides.length > 0) {
          topicSlides[0].setAttribute('aria-selected', 'true');
        }
      }
      
      // Korrektur für andere Swiper (Karussells/Galerien)
      const otherWrappers = document.querySelectorAll('.swiper-wrapper:not(.is-topic)');
      otherWrappers.forEach(wrapper => {
        // Für Karussells ist role="group" besser als role="list"
        if (wrapper.getAttribute('role') === 'list') {
          wrapper.setAttribute('role', 'region');
          wrapper.setAttribute('aria-roledescription', 'carousel');
        }
        
        // Slides in Karussells sind besser als role="group" oder role="presentation"
        const slides = wrapper.querySelectorAll('.swiper-slide');
        slides.forEach(slide => {
          if (slide.getAttribute('role') === 'group') {
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-roledescription', 'slide');
            // Wir behalten alle aria-label der Slides bei (wie "1/6")
          }
        });
      });
    }

    window.topicSwiper = new Swiper('.swiper.is-topic', {
      slidesPerView: 2.5,
      spaceBetween: 0,
      rewind: true,
      navigation: {
        nextEl: '.topic_next-btn',
        prevEl: '.topic_prev-btn',
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      breakpoints: {
        389: {
          slidesPerView: 3.5,
        },
        480: {
          slidesPerView: 3,
        },
        768: {
          slidesPerView: 4,
        },
      },
      on: {
        init: correctSwiperARIARoles,
        // Falls Swiper die Rollen bei Updates zurücksetzt
        update: correctSwiperARIARoles
      }
    });
    
    // Verzögerter Check für den Fall, dass Swiper die Attribute nach der Initialisierung überschreibt
    setTimeout(correctSwiperARIARoles, 1000);
  });
  
  
  // Topic Change Listener for hero_img
  document.addEventListener("DOMContentLoaded", function() {
    const heroDataEls = document.querySelectorAll('.hero_cms-data[data-topic][data-hero-url]');
    const topicToImageMap = {};
    heroDataEls.forEach(el => {
      const key = el.getAttribute('data-topic').toLowerCase();
      const url = el.getAttribute('data-hero-url');
      topicToImageMap[key] = url;
    });
    const heroImg = document.querySelector('.hero_img');
    if (!heroImg) return;
    const urlParams = new URLSearchParams(window.location.search);
    const paramTopic = urlParams.get('topic');
  
    if (paramTopic && heroImg && topicToImageMap[paramTopic.toLowerCase()]) {
      const newUrl = topicToImageMap[paramTopic.toLowerCase()];
      const tempImg = new Image();
      tempImg.src = newUrl;
      tempImg.onload = function() {
        heroImg.removeAttribute("srcset");
        heroImg.removeAttribute("sizes");
        heroImg.src = newUrl;
        gsap.to(heroImg, { duration: 0.5, opacity: 1, onStart: function() { heroImg.style.visibility = "visible"; }});
      };
    } else {
      gsap.to(heroImg, { duration: 0.5, opacity: 1, onStart: function() { heroImg.style.visibility = "visible"; }});
    }
  
    document.addEventListener('topicChange', function(e) {
      const sel = e.detail.topic.toLowerCase();
      if (topicToImageMap[sel] && heroImg) {
        const temp = new Image();
        temp.src = topicToImageMap[sel];
        temp.onload = function() {
          heroImg.removeAttribute("srcset");
          heroImg.removeAttribute("sizes");
          heroImg.src = temp.src;
          heroImg.classList.remove("scaleup");
          void heroImg.offsetWidth;
          heroImg.classList.add("scaleup");
        };
      }
    });
  });
  
  
  // Topic Change Listener for quote_img
  document.addEventListener("DOMContentLoaded", function() {
    const quoteDataEls = document.querySelectorAll('.quote_cms-data[data-topic][data-quote-url]');
    const topicToQuoteMap = {};
    quoteDataEls.forEach(el => {
      const key = el.getAttribute('data-topic').toLowerCase();
      const url = el.getAttribute('data-quote-url');
      topicToQuoteMap[key] = url;
    });
  
    const quoteImg = document.querySelector('.quote_img');
    if (!quoteImg) return;
  
    const urlParams = new URLSearchParams(window.location.search);
    const paramTopic = urlParams.get('topic');
    if (paramTopic && topicToQuoteMap[paramTopic.toLowerCase()]) {
      const newUrl = topicToQuoteMap[paramTopic.toLowerCase()];
      const tempImg = new Image();
      tempImg.src = newUrl;
      tempImg.onload = function() {
        quoteImg.removeAttribute("srcset");
        quoteImg.removeAttribute("sizes");
        quoteImg.src = newUrl;
      };
    }
  
    document.addEventListener('topicChange', function(e) {
      const sel = e.detail.topic.toLowerCase();
      if (topicToQuoteMap[sel]) {
        const temp = new Image();
        temp.src = topicToQuoteMap[sel];
        temp.onload = function() {
          quoteImg.removeAttribute("srcset");
          quoteImg.removeAttribute("sizes");
          quoteImg.src = temp.src;
        };
      }
    });
  });
  
  
  // Topic Change Listener for Gallery
  document.addEventListener('topicChange', function(e) {
    const selectedTopic = e.detail.topic;
    function applyTopicFilter() {
      if (!window.gallerySwiper) return false;
      let targetIndex = 0;
      window.gallerySwiper.slides.forEach((slide, idx) => {
        const slideTopic = (slide.getAttribute('data-topic-target') || slide.getAttribute('data-gallery-id') || "").toLowerCase();
        if (slideTopic === selectedTopic && targetIndex === 0) {
          targetIndex = idx;
        }
      });
      window.gallerySwiper.slideTo(targetIndex);
      const galleryTabs = document.querySelectorAll('.gallery_tabs');
      galleryTabs.forEach(tab => {
        tab.classList.remove('is-custom-current');
        const tabTopic = (tab.getAttribute('data-topic-target') || tab.getAttribute('data-gallery-id') || "").toLowerCase();
        if (tabTopic === selectedTopic) {
          tab.classList.add('is-custom-current');
          tab.setAttribute('aria-selected', 'true');
        } else {
          tab.setAttribute('aria-selected', 'false');
        }
      });
      return true;
    }
    if (!applyTopicFilter()) {
      setTimeout(applyTopicFilter, 300);
    }
  });
  
  
  // Nav show/hide
  (function () {
    const navBg = document.querySelector(".navbar_bg-layer");
    const navMenu = document.querySelector(".navbar_menu");
    const hero = document.querySelector("#hero");
    if (!navBg || !navMenu || !hero) return;
  
    let navVisible = false;
  
    function showNav() {
      navBg.classList.add('is-active');
      navMenu.classList.add('is-active');
    }
  
    function hideNav() {
      navBg.classList.remove('is-active');
      navMenu.classList.remove('is-active');
    }
  
    function checkNavVisibility() {
      const isMobile = window.innerWidth < 992;
      const threshold = window.innerHeight * (isMobile ? 0.4 : 0.8);
      const shouldShow = window.scrollY >= threshold;
      if (shouldShow !== navVisible) {
        if (shouldShow) {
          showNav();
        } else {
          hideNav();
        }
        navVisible = shouldShow;
      }
    }
  
    window.addEventListener("scroll", checkNavVisibility);
    checkNavVisibility();
  })();
  
  
  // Popup-Skript mit Attributen
  document.addEventListener("DOMContentLoaded", function () {
  
    function openPopup(targetPopup) {
      if (!targetPopup) return;
      
      const previouslyFocused = document.activeElement;
      targetPopup.setAttribute('data-previous-focus', previouslyFocused ? previouslyFocused.id || 'document.body' : 'document.body');
      
      targetPopup.setAttribute("aria-hidden", "false");
      targetPopup.setAttribute("aria-modal", "true");
      
      targetPopup.removeAttribute("inert");
      
      document.body.classList.add("scroll-disable");
      
      targetPopup.classList.remove("hide");
      
      targetPopup.style.opacity = "0";
      targetPopup.style.transition = "opacity 300ms ease-in-out";
      
      requestAnimationFrame(() => {
        targetPopup.style.opacity = "1";
        
        setTimeout(() => {
          const closeButton = targetPopup.querySelector('[data-close-popup="true"] button');
          if (closeButton) {
            closeButton.focus();
          } else {
            const focusableElements = targetPopup.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableElements.length > 0) {
              focusableElements[0].focus();
            }
          }
        }, 100);
      });
    }
  
    function closePopup(targetPopup) {
      if (!targetPopup) return;
      
      const focusedElement = document.activeElement;
      if (focusedElement && targetPopup.contains(focusedElement)) {
        focusedElement.blur();
      }
      
      targetPopup.setAttribute("aria-hidden", "true");
      targetPopup.removeAttribute("aria-modal");
      
      targetPopup.setAttribute("inert", "");
      
      document.body.classList.remove("scroll-disable");
      
      targetPopup.style.opacity = "0";
      targetPopup.addEventListener("transitionend", () => {
        targetPopup.classList.add("hide");
        
        setTimeout(() => {
          const previousFocusId = targetPopup.getAttribute('data-previous-focus');
          if (previousFocusId) {
            if (previousFocusId === 'document.body') {
              document.body.focus();
            } else {
              const previousElement = document.getElementById(previousFocusId);
              if (previousElement) {
                previousElement.focus();
              }
            }
          }
        }, 10);
      }, { once: true });
    }
  
    function bindPopupTriggers() {
      const triggers = document.querySelectorAll("[data-open-popup]");
      triggers.forEach((trigger) => {
        const clone = trigger.cloneNode(true);
        trigger.replaceWith(clone);
      });
  
      const freshTriggers = document.querySelectorAll("[data-open-popup]");
      freshTriggers.forEach((trigger) => {
        trigger.addEventListener("click", function (event) {
          // Ignoriere diesen Klick, wenn es über ein Delete-Element kommt
          if (event.target.closest('[data-room-delete]') || event.target.closest('[data-offer-delete]')) {
            return;
          }
          
          const popupName = this.getAttribute("data-open-popup");
          const targetPopup = document.querySelector(`[data-popup="${popupName}"]`);
          if (targetPopup) {
            event.preventDefault();
            openPopup(targetPopup);
          }
        });
      });
    }
  
    bindPopupTriggers();
  
    if (window.fsAttributes) {
      window.fsAttributes.push([
        "cmsnest",
        () => {
          bindPopupTriggers();
        },
      ]);
    }
  
    document.querySelectorAll("[data-close-popup='true']").forEach((closer) => {
      closer.addEventListener("click", function (e) {
        const targetPopup = this.closest("[data-popup]");
        if (targetPopup) {
          closePopup(targetPopup);
        }
      });
    });
  
    document.addEventListener('click', function(e) {
      const linkElement = e.target.closest('a[href^="#"]');
      if (linkElement && linkElement.closest('[data-close-popup="true"]')) {
        const targetPopup = linkElement.closest("[data-popup]");
        if (targetPopup) {
          closePopup(targetPopup);
          const href = linkElement.getAttribute('href');
          setTimeout(() => {
            const targetElement = document.querySelector(href);
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth' });
            }
          }, 310); 
          e.preventDefault();
        }
      }
    }, true);
  
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        const activePopup = document.querySelector('[aria-modal="true"]');
        if (activePopup) {
          closePopup(activePopup);
        }
      }
    });
  });
  
  
  // Main Bildergalerie mit Swiper
  document.addEventListener("DOMContentLoaded", function () {
    const sliderEl = document.querySelector('.swiper.is-gallery');
    if (!sliderEl) return;
    
    const wrapper = sliderEl.querySelector('.swiper-wrapper.is-gallery');
    if (!wrapper) return;
  
    const templateSlide = wrapper.querySelector('.swiper-slide.is-gallery');
    if (templateSlide) templateSlide.remove();
  
    const categoriesData = document.querySelectorAll('.gallery_collection-item .gallery_data');
    const tabs = document.querySelectorAll('.gallery_tabs');
  
    categoriesData.forEach((categoryEl) => {
      const categoryId = categoryEl.getAttribute('data-gallery-id');
      const imageEls = categoryEl.querySelectorAll('.gallery_img-url[data-img-url]');
      imageEls.forEach((imgEl) => {
        const imgURL = imgEl.getAttribute('data-img-url');
        if (imgURL) {
          const slide = document.createElement('div');
          slide.classList.add('swiper-slide', 'is-gallery', 'swiper-backface-hidden');
          slide.setAttribute('data-gallery-id', categoryId);
          slide.setAttribute('data-topic-target', categoryId.toLowerCase());
          const img = document.createElement('img');
          img.src = imgURL;
          img.loading = "lazy";
          img.classList.add('gallery_img');
          slide.appendChild(img);
          wrapper.appendChild(slide);
        }
      });
    });
  
    window.gallerySwiper = new Swiper('.swiper.is-gallery', {
      ...swiperAnimationConfig,
      slidesPerView: 1.2,
      spaceBetween: 16,
      centeredSlides: false,
      initialSlide: 0,
      rewind: true,
      navigation: {
        nextEl: '.gallery_next-btn',
        prevEl: '.gallery_prev-btn',
      },
      keyboard: { enabled: true, onlyInViewport: true },
      breakpoints: {
        480: { slidesPerView: 2.2, spaceBetween: 16, centeredSlides: false, initialSlide: 0 },
        992: { slidesPerView: 2, spaceBetween: 32, centeredSlides: true, initialSlide: 1 },
      },
    });
  
    function updateActiveTab() {
      const activeSlide = window.gallerySwiper.slides[window.gallerySwiper.activeIndex];
      const activeCategory = activeSlide.getAttribute('data-gallery-id');
      tabs.forEach(tab => tab.classList.remove('is-custom-current'));
      const activeTab = document.querySelector(`.gallery_tabs[data-gallery-id="${activeCategory}"]`);
      if (activeTab) {
        activeTab.classList.add('is-custom-current');
      }
    }
  
    tabs.forEach((tab) => {
      tab.addEventListener('click', function () {
        const targetCategory = tab.getAttribute('data-gallery-id');
        const allSlides = wrapper.querySelectorAll('.swiper-slide.is-gallery');
        let targetIndex = 0;
        allSlides.forEach((slide, idx) => {
          if (slide.getAttribute('data-gallery-id') === targetCategory && targetIndex === 0) {
            targetIndex = idx;
          }
        });
        window.gallerySwiper.slideTo(targetIndex);
        updateActiveTab();
      });
    });
    
    window.gallerySwiper.on('slideChange', updateActiveTab);
    updateActiveTab();
  });
  
  
  // Swiper Gästestimmen
  document.addEventListener("DOMContentLoaded", function () {
    const swiper = new Swiper('.swiper.is-reviews', {
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
      autoHeight: true,
      slidesPerView: 1,
      spaceBetween: 32,
      rewind: true,
      navigation: {
        nextEl: '.reviews_next-btn',
        prevEl: '.reviews_prev-btn',
      },
      pagination: {
        el: '.reviews_bullets-wrapper',
        clickable: true,
        bulletClass: 'reviews_bullet',
        bulletActiveClass: 'is-current',
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      breakpoints: {
        992: {
          slidesPerView: 1,
          spaceBetween: 32,
        },
      },
    });
  });
  
  // ROOMS TABS & SWIPER
  document.addEventListener('DOMContentLoaded', () => {
    const roomsSection = document.querySelector('.section_rooms');
    if (!roomsSection) return;
  
    let tabs = roomsSection.querySelectorAll('[data-tab]');
    let tabContents = roomsSection.querySelectorAll('[data-target-tab]');
    const tabList = roomsSection.querySelector('[data-tab-list]');
  
    if (tabList) {
      tabList.setAttribute('role', 'tablist');
    }
  
    tabs.forEach(tab => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', 'false');
    });
    tabContents.forEach(panel => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-hidden', 'true');
    });
  
    function isContentEmpty(panel) {
      const text = panel.textContent.trim().toLowerCase();
      if (text.includes('no items found') || !panel.children.length) {
        return true;
      }
      return false;
    }
  
    tabs.forEach(tab => {
      const tabId = tab.getAttribute('data-tab');
      const panel = roomsSection.querySelector(`[data-target-tab="${tabId}"]`);
      if (!panel || isContentEmpty(panel)) {
        tab.remove();
        if (panel) panel.remove();
      }
    });
  
    tabs = roomsSection.querySelectorAll('[data-tab]');
    tabContents = roomsSection.querySelectorAll('[data-target-tab]');
  
    let currentSwiper = null;
  
    function setActiveTab(tabId) {
      tabs.forEach(tab => {
        tab.classList.remove('is-custom-current');
        tab.setAttribute('aria-selected', 'false');
      });
      tabContents.forEach(content => {
        content.classList.add('hide');
        content.setAttribute('aria-hidden', 'true');
      });
  
      const activeTab = roomsSection.querySelector(`[data-tab="${tabId}"]`);
      const activeContent = roomsSection.querySelector(`[data-target-tab="${tabId}"]`);
      if (!activeTab) return;
  
      activeTab.classList.add('is-custom-current');
      activeTab.setAttribute('aria-selected', 'true');
      if (activeContent) {
        activeContent.classList.remove('hide');
        activeContent.setAttribute('aria-hidden', 'false');
      }
    }
  
    function initSwiper(tabId) {
      if (currentSwiper) {
        currentSwiper.destroy();
        currentSwiper = null;
      }
      const container = roomsSection.querySelector(`[data-swiper="${tabId}"]`);
      if (!container) return;
  
      currentSwiper = new Swiper(container, {
        ...swiperAnimationConfig,
        autoHeight: false,
        slidesPerView: 1.2,
        spaceBetween: 16,
        rewind: false,
        navigation: {
          nextEl: '.rooms_next-btn',
          prevEl: '.rooms_prev-btn',
        },
        pagination: {
          el: '.rooms_bullets-wrapper',
          clickable: true,
          bulletClass: 'rooms_bullet',
          bulletActiveClass: 'is-current',
        },
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },
        breakpoints: {
          790: {
            slidesPerView: 2,
            spaceBetween: 32,
          },
          1150: {
            slidesPerView: 3,
            spaceBetween: 32,
          },
          1440: {
            slidesPerView: 3,
            spaceBetween: 48,
          },
        },
      });
    }
  
    if (tabs.length) {
      const firstTabId = tabs[0].getAttribute('data-tab');
      setActiveTab(firstTabId);
      initSwiper(firstTabId);
    }
  
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        setActiveTab(tabId);
        initSwiper(tabId);
      });
    });
  });
  
  
  // OFFERS TABS & SWIPER
  document.addEventListener('DOMContentLoaded', () => {
    const offersSection = document.querySelector('.section_offers');
    if (!offersSection) return;
  
    let tabs = offersSection.querySelectorAll('[data-tab]');
    let tabContents = offersSection.querySelectorAll('[data-target-tab]');
    const tabList = offersSection.querySelector('[data-tab-list]');
  
    if (tabList) {
      tabList.setAttribute('role', 'tablist');
    }
  
    tabs.forEach(tab => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', 'false');
    });
    tabContents.forEach(panel => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-hidden', 'true');
    });
  
    function isContentEmpty(panel) {
      const text = panel.textContent.trim().toLowerCase();
      if (text.includes('no items found') || !panel.children.length) {
        return true;
      }
      return false;
    }
  
    tabs.forEach(tab => {
      const tabId = tab.getAttribute('data-tab');
      const panel = offersSection.querySelector(`[data-target-tab="${tabId}"]`);
      if (!panel || isContentEmpty(panel)) {
        tab.remove();
        if (panel) panel.remove();
      }
    });
  
    tabs = offersSection.querySelectorAll('[data-tab]');
    tabContents = offersSection.querySelectorAll('[data-target-tab]');
  
    let currentSwiper = null;
  
    function setActiveTab(tabId) {
      tabs.forEach(tab => {
        tab.classList.remove('is-custom-current');
        tab.setAttribute('aria-selected', 'false');
      });
      tabContents.forEach(content => {
        content.classList.add('hide');
        content.setAttribute('aria-hidden', 'true');
      });
  
      const activeTab = offersSection.querySelector(`[data-tab="${tabId}"]`);
      const activeContent = offersSection.querySelector(`[data-target-tab="${tabId}"]`);
      if (!activeTab) return;
  
      activeTab.classList.add('is-custom-current');
      activeTab.setAttribute('aria-selected', 'true');
      if (activeContent) {
        activeContent.classList.remove('hide');
        activeContent.setAttribute('aria-hidden', 'false');
      }
    }
  
    function initSwiper(tabId) {
      if (currentSwiper) {
        currentSwiper.destroy();
        currentSwiper = null;
      }
      const container = offersSection.querySelector(`[data-swiper="${tabId}"]`);
      if (!container) return;
  
      currentSwiper = new Swiper(container, {
        ...swiperAnimationConfig,
        autoHeight: false,
        slidesPerView: 1.2,
        spaceBetween: 16,
        rewind: false,
        navigation: {
          nextEl: '.offers_next-btn',
          prevEl: '.offers_prev-btn',
        },
        pagination: {
          el: '.offers_bullets-wrapper',
          clickable: true,
          bulletClass: 'offers_bullet',
          bulletActiveClass: 'is-current',
        },
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },
        breakpoints: {
          790: {
            slidesPerView: 2,
            spaceBetween: 32,
          },
          1150: {
            slidesPerView: 2,
            spaceBetween: 32,
          },
          1440: {
            slidesPerView: 2,
            spaceBetween: 48,
          },
        },
      });
    }
  
    if (tabs.length) {
      const firstTabId = tabs[0].getAttribute('data-tab');
      setActiveTab(firstTabId);
      initSwiper(firstTabId);
    }
  
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        setActiveTab(tabId);
        initSwiper(tabId);
      });
    });
  });
  
  
  // Swiper Social Media Reviews
  document.addEventListener("DOMContentLoaded", function () {
    const swiper = new Swiper('.swiper.is-sm-reviews', {
      ...swiperAnimationConfig,
      autoHeight: false,
      slidesPerView: 1.2,
      centeredSlides: true,
      initialSlide: 1,
      spaceBetween: 16,
      rewind: true,
      navigation: {
        nextEl: '.sm-reviews_next-btn',
        prevEl: '.sm-reviews_prev-btn',
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      breakpoints: {
        630: {
          slidesPerView: 1.5,
          spaceBetween: 24,
        },
        992: {
          slidesPerView: 2.2,  
          spaceBetween: 24,    
        },
        1140: {
          centeredSlides: false,
          slidesPerView: 2,
          spaceBetween: 24,
        },
      },
    });
  });
  
  
  // Popup Gallery Swiper mit Thumbs
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.popup_gallery').forEach(container => {
      // Cache häufig verwendete DOM-Elemente
      const mainSliderEl = container.querySelector('.swiper.is-popup');
      const thumbsSliderEl = container.querySelector('.swiper.is-popup-thumbs');
      const imgWrapper = container.querySelector('.popup_gallery-img-wrapper');
      const navPrev = container.querySelector('.popup_gallery-prev-btn');
      const navNext = container.querySelector('.popup_gallery-next-btn');

      if (!mainSliderEl) {
        console.error('Kein Hauptslider-Element (.swiper.is-popup) im Container gefunden.');
        return;
      }

      const mainWrapper = mainSliderEl.querySelector('.swiper-wrapper.is-popup');
      if (!mainWrapper) {
        console.error('Kein Wrapper im Hauptslider (.swiper-wrapper.is-popup) im Container gefunden.');
        return;
      }
      while (mainWrapper.firstChild) {
        mainWrapper.removeChild(mainWrapper.firstChild);
      }

      if (!thumbsSliderEl) {
        console.error('Kein Thumbs-Slider-Element (.swiper.is-popup-thumbs) im Container gefunden.');
        return;
      }

      const thumbsWrapper = thumbsSliderEl.querySelector('.swiper-wrapper.is-popup-thumbs');
      if (!thumbsWrapper) {
        console.error('Kein Wrapper im Thumbs-Slider (.swiper-wrapper.is-popup-thumbs) im Container gefunden.');
        return;
      }
      while (thumbsWrapper.firstChild) {
        thumbsWrapper.removeChild(thumbsWrapper.firstChild);
      }

      if (!imgWrapper) {
        console.error('Kein Bild-Wrapper (.popup_gallery-img-wrapper) im Container gefunden.');
        return;
      }

      const imgURLItems = imgWrapper.querySelectorAll('.popup_gallery-img-url[data-img-url]');
      if (!imgURLItems.length) {
        console.error('Keine Bild-URLs in .popup_gallery-img-url im Container gefunden.');
        return;
      }
      
      imgURLItems.forEach(item => {
        const imgURL = item.getAttribute('data-img-url');
        if (imgURL) {
          const slide = document.createElement('div');
          slide.classList.add('swiper-slide', 'is-popup');
          const img = document.createElement('img');
          img.src = imgURL;
          img.loading = "lazy";
          img.classList.add('popup_gallery-img');
          slide.appendChild(img);
          mainWrapper.appendChild(slide);

          const thumbSlide = document.createElement('div');
          thumbSlide.classList.add('swiper-slide', 'is-popup-thumbs');
          const thumbImg = document.createElement('img');
          thumbImg.src = imgURL;
          thumbImg.loading = "lazy";
          thumbImg.classList.add('popup_gallery-thumb-img');
          thumbSlide.appendChild(thumbImg);
          thumbsWrapper.appendChild(thumbSlide);
        }
      });
      
      if (!navPrev || !navNext) {
        console.warn('Navigationselemente (.popup_gallery-prev-btn / .popup_gallery-next-btn) im Container nicht gefunden.');
      }

      const thumbsSwiper = new Swiper(thumbsSliderEl, {
        slidesPerView: 4.4,
        spaceBetween: 8,
        freeMode: true,
        watchSlidesProgress: true,
        mousewheel: {
          forceToAxis: true,
          sensitivity: 1,
          releaseOnEdges: true,
        },
        breakpoints: {
          480: {
            slidesPerView: 5.3,
            spaceBetween: 8,
          },
        },
      });

      const mainSwiper = new Swiper(mainSliderEl, {
        slidesPerView: 1,
        spaceBetween: 16,
        navigation: navPrev && navNext ? {
          nextEl: navNext,
          prevEl: navPrev,
        } : false,
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },
        mousewheel: {
          forceToAxis: true,
          sensitivity: 1,
          releaseOnEdges: true,
          thresholdDelta: 10,
        },
        thumbs: {
          swiper: thumbsSwiper
        },
        breakpoints: {
          480: {
            slidesPerView: 1,
            spaceBetween: 16,
          },
          992: {
            slidesPerView: 1,
            spaceBetween: 32,
          },
        },
      });
    });
  });
  
  
  // Rooms & Offers to Form
  document.addEventListener('click', function(e) {
    // Cache häufig verwendete DOM-Elemente
    const roomElement = document.querySelector('[data-room-element]');
    const offerElement = document.querySelector('[data-offer-element]');
    const wrapper = document.querySelector('[data-room-offer-wrapper]');
    const roomInput = document.querySelector('[name="selected-room"]');
    const offerInput = document.querySelector('[name="selected-offer"]');
    const roomNameTarget = document.querySelector('[data-room-name-target]');
    const roomImgTarget = document.querySelector('[data-room-image-target]');
    const offerNameTarget = document.querySelector('[data-offer-name-target]');
    const offerImgTarget = document.querySelector('[data-offer-image-target]');

    const roomBtn = e.target.closest('[data-custom="select-room"]');
    if (roomBtn) {
      e.preventDefault();
      
      const popup = roomBtn.closest('[data-popup]');
      let card;
      let popupId;
      
      if (popup) {
        popupId = popup.getAttribute('data-popup');
        card = document.querySelector(`[data-popup-source="${popupId}"]`);
      } else {
        card = roomBtn.closest('.rooms_card');
        const detailsBtn = card.querySelector('[data-open-popup]');
        if (detailsBtn) {
          popupId = detailsBtn.getAttribute('data-open-popup');
        }
      }
      
      if (!card) return;
      
      const nameEl = card.querySelector('[data-room-name]');
      const imgEl = card.querySelector('[data-room-image]');
      const name = nameEl ? nameEl.textContent.trim() : '';
      const img = imgEl ? imgEl.getAttribute('src') : '';
      
      if(roomNameTarget) {
        if (roomNameTarget.tagName === 'INPUT') {
          roomNameTarget.value = name;
        } else {
          roomNameTarget.textContent = name;
        }
      }
      
      if(roomImgTarget) roomImgTarget.src = img;
      if(roomInput) roomInput.value = name;
      
      if(roomElement) {
        roomElement.style.display = 'block';
        
        const roomButton = roomElement.querySelector('.form_r-o-wrapper[data-open-popup]');
        if (roomButton && popupId) {
          roomButton.setAttribute('data-open-popup', popupId);
        }
      }
      
      if(wrapper) wrapper.style.display = 'flex';
    }
    
    const offerBtn = e.target.closest('[data-custom="select-offer"]');
    if (offerBtn) {
      e.preventDefault();
      
      const popup = offerBtn.closest('[data-popup]');
      let card;
      let popupId;
      
      if (popup) {
        popupId = popup.getAttribute('data-popup');
        card = document.querySelector(`[data-popup-source="${popupId}"]`);
      } else {
        card = offerBtn.closest('.offers_card');
        const detailsBtn = card.querySelector('[data-open-popup]');
        if (detailsBtn) {
          popupId = detailsBtn.getAttribute('data-open-popup');
        }
      }
      
      if (!card) return;
      
      const nameEl = card.querySelector('[data-offer-name]');
      const imgEl = card.querySelector('[data-offer-image]');
      const name = nameEl ? nameEl.textContent.trim() : '';
      const img = imgEl ? imgEl.getAttribute('src') : '';
      
      if(offerNameTarget) {
        if (offerNameTarget.tagName === 'INPUT') {
          offerNameTarget.value = name;
        } else {
          offerNameTarget.textContent = name;
        }
      }
      
      if(offerImgTarget) offerImgTarget.src = img;
      if(offerInput) offerInput.value = name;
      
      if(offerElement) {
        offerElement.style.display = 'block';
        
        const offerButton = offerElement.querySelector('.form_r-o-wrapper[data-open-popup]');
        if (offerButton && popupId) {
          offerButton.setAttribute('data-open-popup', popupId);
        }
      }
      
      if(wrapper) wrapper.style.display = 'flex';
    }
    
    const roomDelete = e.target.closest('[data-room-delete]');
    if (roomDelete) {
      e.preventDefault();
      e.stopPropagation();
      
      const event = e || window.event;
      if (event.stopImmediatePropagation) {
        event.stopImmediatePropagation();
      }
      
      if (roomElement) roomElement.style.display = 'none';
      if (roomInput) roomInput.value = '';
      // Zusätzliche Sicherheit: Falls roomNameTarget ein Input ist, auch diesen leeren
      if (roomNameTarget && roomNameTarget.tagName === 'INPUT') {
        roomNameTarget.value = '';
      }
      
      if (offerElement && offerElement.style.display === 'none' && wrapper) {
        wrapper.style.display = 'none';
      }
      
      return false;
    }
    
    const offerDelete = e.target.closest('[data-offer-delete]');
    if (offerDelete) {
      e.preventDefault();
      e.stopPropagation();
      
      const event = e || window.event;
      if (event.stopImmediatePropagation) {
        event.stopImmediatePropagation();
      }
      
      if (offerElement) offerElement.style.display = 'none';
      if (offerInput) offerInput.value = '';
      // Zusätzliche Sicherheit: Falls offerNameTarget ein Input ist, auch diesen leeren
      if (offerNameTarget && offerNameTarget.tagName === 'INPUT') {
        offerNameTarget.value = '';
      }
      
      if (roomElement && roomElement.style.display === 'none' && wrapper) {
        wrapper.style.display = 'none';
      }
      
      return false;
    }
  });
