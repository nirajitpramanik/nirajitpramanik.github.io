document.addEventListener('DOMContentLoaded', () => {
    // Get all necessary DOM elements
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.terminal-content');
    const initialLoading = document.getElementById('initial-loading');
    const contentContainer = document.getElementById('content-container');
    
    // Hide all content initially
    contents.forEach(content => {
      content.style.display = 'none';
    });
    
    // Show initial loading animation
    initialLoading.style.display = 'flex';
    
    // Function to simulate command typing
    function typeCommand(element, command, onComplete) {
      let charIndex = 0;
      element.textContent = '$ ';
      
      function type() {
        if (charIndex < command.length) {
          element.textContent += command[charIndex];
          charIndex++;
          setTimeout(type, 50); // Typing speed (50ms between characters)
        } else {
          if (onComplete) onComplete();
        }
      }
      
      type();
    }
    
    // Function to show content with loading effect
    function showContent(outputElement) {
      outputElement.style.opacity = '0';
      outputElement.style.display = 'block';
      
      // Add loading text
      const loadingText = document.createElement('div');
      loadingText.className = 'loading-text';
      loadingText.textContent = '> Loading...';
      outputElement.parentElement.insertBefore(loadingText, outputElement);
      
      // Show actual content after delay
      setTimeout(() => {
        loadingText.remove();
        outputElement.style.opacity = '1';
        outputElement.style.transition = 'opacity 0.5s ease-in';
      }, 1000); // 1 second loading time
    }
    
    // Function to handle tab switching
    function switchTab(tab) {
      // Remove active class from all tabs and hide contents
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => {
        c.classList.remove('active');
        c.style.display = 'none';
      });
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Get and show corresponding content section
      const contentId = tab.getAttribute('data-tab');
      const contentSection = document.getElementById(contentId);
      contentSection.classList.add('active');
      contentSection.style.display = 'block';
      
      // Get command and output elements
      const commandElement = contentSection.querySelector('.command');
      const outputElement = contentSection.querySelector('.output');
      
      // Reset and hide output
      outputElement.style.display = 'none';
      commandElement.textContent = '';
      
      // Type command and show content
      const command = tab.textContent;
      typeCommand(commandElement, command, () => {
        showContent(outputElement);
      });
    }
    
    // Initial loading sequence
    setTimeout(() => {
      // Hide loading animation
      initialLoading.style.display = 'none';
      
      // Show content container
      contentContainer.style.display = 'block';
      contentContainer.style.opacity = '1';
      
      // Show first tab content
      const activeTab = document.querySelector('.tab.active');
      if (activeTab) {
        const whoamiContent = document.getElementById(activeTab.getAttribute('data-tab'));
        whoamiContent.style.display = 'block';
        
        // Type initial command
        const whoamiCommand = whoamiContent.querySelector('.command');
        const whoamiOutput = whoamiContent.querySelector('.output');
        
        typeCommand(whoamiCommand, 'whoami', () => {
          showContent(whoamiOutput);
        });
      }
    }, 3000); // 3 second initial loading time
    
    // Add click handlers to all tabs
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        switchTab(tab);
      });
    });
    
    // Add keyboard navigation for tabs
    document.addEventListener('keydown', (e) => {
      const activeTab = document.querySelector('.tab.active');
      if (!activeTab) return;
      
      const tabArray = Array.from(tabs);
      const currentIndex = tabArray.indexOf(activeTab);
      
      if (e.key === 'ArrowRight' && currentIndex < tabArray.length - 1) {
        switchTab(tabArray[currentIndex + 1]);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        switchTab(tabArray[currentIndex - 1]);
      }
    });
    
    // Handle window resize for responsive behavior
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Adjust terminal height if needed
        const terminal = document.querySelector('.terminal');
        const terminalBody = document.querySelector('.terminal-body');
        if (window.innerHeight < 600) {
          terminalBody.style.height = '50vh';
        } else {
          terminalBody.style.height = '60vh';
        }
      }, 250);
    });
    
    // Add touch support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
    
    function handleSwipe() {
      const SWIPE_THRESHOLD = 50;
      const activeTab = document.querySelector('.tab.active');
      if (!activeTab) return;
      
      const tabArray = Array.from(tabs);
      const currentIndex = tabArray.indexOf(activeTab);
      
      if (touchEndX < touchStartX - SWIPE_THRESHOLD && currentIndex < tabArray.length - 1) {
        // Swipe left
        switchTab(tabArray[currentIndex + 1]);
      } else if (touchEndX > touchStartX + SWIPE_THRESHOLD && currentIndex > 0) {
        // Swipe right
        switchTab(tabArray[currentIndex - 1]);
      }
    }
  });