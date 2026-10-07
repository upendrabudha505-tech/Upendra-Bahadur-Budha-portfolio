/**
 * ============================================================================
 * UPENDRA BAHADUR BUDHA — STANDALONE PORTFOLIO SCRIPT (script.js)
 * Handles theme switching, mobile navigation, profile photo upload,
 * and academic project image uploads with localStorage persistence.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle (Dark / Light Mode)
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
    });
  }

  // 2. [1] CHANGE PROFILE PHOTO (Interactive File Input)
  const profileInput = document.getElementById('profile-upload-input');
  const profileImg = document.getElementById('main-profile-image');
  const savedProfile = localStorage.getItem('upendra_custom_profile_photo');
  if (savedProfile && profileImg) {
    profileImg.src = savedProfile;
  }

  if (profileInput && profileImg) {
    profileInput.addEventListener('change', (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          profileImg.src = reader.result;
          localStorage.setItem('upendra_custom_profile_photo', reader.result);
        }
      };
      reader.readAsDataURL(file);
    });
  }
});
