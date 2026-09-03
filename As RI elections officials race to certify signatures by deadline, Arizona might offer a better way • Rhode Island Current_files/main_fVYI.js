    // Clicking magnifiying class triggers header search bar

    document
      .querySelectorAll('.headerSearchToggle')
      .forEach((el) => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          const topNavContainer = document.querySelector('.topNavContainer');
          el.setAttribute('aria-expanded', true);
          if (topNavContainer !== undefined) {
            topNavContainer.classList.add('searchActive');
          }
          const targetInputId = el.id === 'mobileHeaderSearchToggle' ? 'mobileHeaderSearchInput' : 'headerSearchInput';
          const targetInput = document.getElementById(targetInputId);
          if (targetInput) {
            targetInput.focus();
          }
        });
      });

    function copyLinkShare(value) {
        var tempInput = document.createElement("input");
        tempInput.style = "position: absolute; left: -1000px; top: -1000px";
        tempInput.value = value;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        alert("Link Copied To Clipboard");
    }
