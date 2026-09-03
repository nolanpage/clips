// Gallery: Init
document.addEventListener('DOMContentLoaded', function() {
  function isMobile() {
    return window.matchMedia('(max-width: 575.98px)').matches;
  }

  function getSlidesInView(element, prefix) {
    const re = new RegExp('carousel-slides-in-view--' + prefix + '-(\\d+)', 'i');
    const match = Array.from(element.classList).map(function(cls) {
      return cls.match(re);
    }).filter(Boolean)[0];
    if (match && match[1]) return parseInt(match[1], 10);
    return 1;
  }

  function getPrevNextButtonsOption(gallery) {
    return !gallery.classList.contains('carousel-prevnext--hide');
  }

  function getPaginationOption(gallery) {
    return !gallery.classList.contains('carousel-pagination--hide');
  }

  function getLoopOption(gallery) {
    return !gallery.classList.contains('carousel-loop--false');
  }

  function getAutoPlayOption(gallery) {
    return !gallery.classList.contains('carousel-autoplay--false');
  }

  document.querySelectorAll('.gallery').forEach(function(gallery) {
    const isCarousel = gallery.classList.contains('carousel');
    const isLightbox = gallery.classList.contains('gallery-lightbox--enabled');

    const BUTTON_DISABLED = true;
    const BUTTON_OPACITY_DISABLED = '0.25';
    const BUTTON_ENABLED = false;
    const BUTTON_OPACITY_ENABLED = '1';
    const ESC_KEY_DISABLED = true;
    const ESC_KEY_ENABLED = false;

    // ----------- Carousel Logic -----------
    if (isCarousel) {
      let flkty = null;
      let currentMode = isMobile() ? 'mobile' : 'desktop';
      let disableEscapeKey = false;

      function initCarousel() {
        const prefix = isMobile() ? 'mobile' : 'desktop';
        const autoPlayOpts = getAutoPlayOption(gallery);
        const groupCells = getSlidesInView(gallery, prefix) || 1;
        const prevNextButtons = getPrevNextButtonsOption(gallery);
        const pageDots = getPaginationOption(gallery);
        const loop = getLoopOption(gallery);
        const fullscreenOpt = gallery.classList.contains('gallery-lightbox--enabled');

        if (flkty) {
          flkty.destroy();
          flkty = null;
        }


        flkty = new Flickity(gallery, {
          adaptiveHeight: true,
          autoPlay: autoPlayOpts,
          cellAlign: 'left',
          contain: true,
          draggable: true,
          fullscreen: fullscreenOpt,
          groupCells: groupCells,
          imagesLoaded: true,
          lazyLoad: false,
          pageDots: pageDots,
          pauseAutoPlayOnHover: autoPlayOpts, // Note: Added option by default to improve UX.
          percentPosition: true,
          prevNextButtons: prevNextButtons,
          setGallerySize: true,
          wrapAround: loop
        });


        flkty.on('ready', function() {
          const fullscreenButton = gallery.querySelector('.flickity-button.flickity-fullscreen-button');
          const closeButton = gallery.querySelector('.flickity-button.flickity-fullscreen-exit-button');

          if (fullscreenButton) {
            fullscreenButton.disabled = BUTTON_ENABLED;
            fullscreenButton.style.opacity = BUTTON_OPACITY_ENABLED;
          }

          if (closeButton) {
            closeButton.disabled = BUTTON_ENABLED;
            closeButton.style.opacity = BUTTON_OPACITY_ENABLED;
          }
        });

        if (fullscreenOpt) {

          const fullscreenButton = gallery.querySelector('.flickity-button.flickity-fullscreen-button');

          function setButtonState(button, isEnabled) {
            if (!button) return;
            button.disabled = !isEnabled;
            button.style.opacity = isEnabled ? BUTTON_OPACITY_ENABLED : BUTTON_OPACITY_DISABLED;
          }

          // Function: Handle ESC Key
          function handleEscapeKey(e) {
            if (disableEscapeKey && (e.key === 'Escape' || e.key === 'Esc')) {
              e.stopImmediatePropagation();
              e.preventDefault();
              return false;
            }
          }

          // Function: Open / Close button state
          function handleTransitionButtons() {
            const fsButton = fullscreenButton;

            flkty.on('scroll', function() {
              const cfsButton = gallery.querySelector('.flickity-button.flickity-fullscreen-button-exit');

              setButtonState(fsButton, false);
              setButtonState(cfsButton, false);
              disableEscapeKey = ESC_KEY_DISABLED;
            });

            flkty.on('settle', function() {
              const cfsButton = gallery.querySelector('.flickity-button.flickity-fullscreen-button-exit');

              setButtonState(fsButton, true);
              setButtonState(cfsButton, true);
              disableEscapeKey = ESC_KEY_ENABLED;
            });
          }

          // Call this function after setting up fullscreenButton
          handleTransitionButtons();

          document.addEventListener('keydown', handleEscapeKey, true);

          flkty.on('fullscreenChange', function(isFullscreen) {
            const prefix = isMobile() ? 'mobile' : 'desktop';
            const groupCells = getSlidesInView(gallery, prefix) || 1;

            if (isFullscreen) {
              //Fullscreen Load
              flkty.options.groupCells = false;
              flkty.options.cellAlign = 'center';
              imagesLoaded(gallery, function() {
                flkty.resize();
                flkty.reposition();

                // Re-enable close button once fullscreen is initialized
                setTimeout(() => {
                  const closeButton = gallery.querySelector('.flickity-button.flickity-fullscreen-button-exit');

                  if (closeButton) {
                    closeButton.disabled = BUTTON_ENABLED;
                    closeButton.style.opacity = BUTTON_OPACITY_ENABLED;
                    disableEscapeKey = ESC_KEY_ENABLED;
                  }
                }, 150); // small delay ensures Flickity is fully rendered
              });
            } else {
              //Fullscreen Exit
              flkty.options.groupCells = groupCells;
              flkty.options.cellAlign = 'left';
              imagesLoaded(gallery, function() {
                flkty.resize();
                flkty.reposition();

                // Enable fullscreen and close buttons only after slide settles
                const enableButtons = function() {
                  const fullscreenButton = gallery.querySelector('.flickity-button.flickity-fullscreen-button');
                  const closeButton = gallery.querySelector('.flickity-button.flickity-fullscreen-button-exit');

                  if (fullscreenButton) {
                    fullscreenButton.disabled = BUTTON_ENABLED;
                    fullscreenButton.style.opacity = BUTTON_OPACITY_ENABLED;
                  }

                  if (closeButton) {
                    closeButton.disabled = BUTTON_ENABLED;
                    closeButton.style.opacity = BUTTON_OPACITY_ENABLED;
                  }

                  disableEscapeKey = ESC_KEY_ENABLED;
                  flkty.off('settle', enableButtons);
                };

                if (flkty.isAnimating) {
                  flkty.on('settle', enableButtons);
                } else {
                  enableButtons();
                }
              });
            }
          });
        }
      }

      // Function: Window Resize
      function handleResize() {
        const newMode = isMobile() ? 'mobile' : 'desktop';

        if (flkty && flkty.isFullscreen) {
          if (window.imagesLoaded) {
            imagesLoaded(gallery, function() {
              flkty.resize();
              flkty.reposition();
            });
          } else {
            flkty.resize();
            flkty.reposition();
          }
        } else {
          if (newMode !== currentMode) {
            currentMode = newMode;
            initCarousel();
          }
        }

        // Ensure fullscreen and close buttons are properly re-enabled after resize
        setTimeout(() => {
          const fullscreenButton = gallery.querySelector('.flickity-button.flickity-fullscreen-button');
          const closeButton = gallery.querySelector('.flickity-button.flickity-fullscreen-button-exit');

          if (fullscreenButton) {
            fullscreenButton.disabled = BUTTON_ENABLED;
            fullscreenButton.style.opacity = BUTTON_OPACITY_ENABLED;
          }

          if (closeButton) {
            closeButton.disabled = BUTTON_ENABLED;
            closeButton.style.opacity = BUTTON_OPACITY_ENABLED;
          }

          disableEscapeKey = ESC_KEY_ENABLED; // ensure ESC can close fullscreen after resize
        }, 200);
      }

      let resizeTimeout;

      window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 150);
      });

      if (window.imagesLoaded) {
        imagesLoaded(gallery, function() {
          initCarousel();
        });
      } else {
        initCarousel();
      }
    }

    // ----------- Lightbox Logic -----------
    else if (isLightbox && !isCarousel) {
      let lightboxFlkty = null;
      let originalGalleryColumnsClass = '';

      function setupFullscreenHandler() {
        if (!lightboxFlkty) return;

        lightboxFlkty.on('fullscreenChange', function(isFullscreen) {
          if (isFullscreen) {
            // Remove desktop column class
            gallery.classList.forEach(function(cls) {
              if (/^gallery-columns-/.test(cls)) {
                originalGalleryColumnsClass = cls;
                gallery.classList.remove(cls);
              }
            });
          } else {

            // Restore desktop column class
            if (originalGalleryColumnsClass) {
              gallery.classList.add(originalGalleryColumnsClass);
            }

            // Remove inline styles from gallery items
            gallery.querySelectorAll('.gallery-item').forEach(function(item) {
              item.style.width = '';
              item.style.transition = '';
            });

            // Destroy Flickity instance
            if (lightboxFlkty) {
              lightboxFlkty.destroy();
              lightboxFlkty = null;
            }
          }

          // Recalculate layout after fullscreen change
          setTimeout(function() {
            if (lightboxFlkty) {
              lightboxFlkty.resize();
              lightboxFlkty.reposition();
            }
          }, 100);
        });
      }

      gallery.querySelectorAll('.gallery-item').forEach(function(item, index) {
        item.addEventListener('click', function() {

          function initLightbox() {
            const loop = getLoopOption(gallery);

            if (!lightboxFlkty) {
              lightboxFlkty = new Flickity(gallery, {
                adaptiveHeight: true,
                cellAlign: 'center',
                contain: true,
                draggable: true,
                imagesLoaded: true,
                fullscreen: true,
                groupCells: false,
                lazyLoad: false,
                pageDots: true,
                prevNextButtons: true,
                wrapAround: loop
              });

              setupFullscreenHandler();
            }

            lightboxFlkty.select(index, false, true); // select slide without animation
            lightboxFlkty.viewFullscreen();

            // Fade in the fullscreen overlay to remove flicker
            const fsOverlay = document.querySelector('.flickity-fullscreen');
            if (fsOverlay) {
              fsOverlay.style.opacity = 0;
              fsOverlay.style.transition = 'opacity 0.25s ease';
              fsOverlay.getBoundingClientRect(); // force reflow
              fsOverlay.style.opacity = 1;
            }

            setTimeout(function() {
              if (lightboxFlkty) {
                lightboxFlkty.resize();
                lightboxFlkty.reposition();
              }
            }, 300);
          }

          if (window.imagesLoaded) {
            imagesLoaded(gallery, function() {
              initLightbox();
            });
          } else {
            initLightbox();
          }
        });
      });
    }
  });
});
