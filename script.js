/**
 * Goat.tv - Daily Goat Video Player
 * A new adorable goat video every day at 11:59 PM CST!
 */

// =============================================================================
// CURATED GOAT VIDEOS - All verified to be working, short, and adorable!
// 
// HOW TO ADD MORE VIDEOS:
// 1. Go to YouTube and search for "baby goats playing" or "fainting goats"
// 2. Find a short video (under 1 minute is best)
// 3. Copy the video ID from the URL (the part after "v=" or after "youtu.be/")
//    Example: https://youtube.com/watch?v=ABC123xyz → ID is "ABC123xyz"
// 4. Add it to the list below: { id: 'ABC123xyz', title: 'Description' }
// =============================================================================
const GOAT_VIDEOS = [
  // VERIFIED WORKING VIDEO
  { id: 'f_3Utmj4RPU', title: 'Funny Fainting Goats' },
  { id: 'mtOD19C7J48', title: 'goat vid 1' }, 
  { id: 'nlYlNF30bVg', title: 'goat vid 2' }, 
  { id: 'nlYlNF30bVg', title: 'goat vid 3'}, 
  { id: 'OOOtPToJ6pc', title: 'goat vid 4'}, 
  { id: 'CL86kq16vpA', title: 'goat vid 5'}, 
  { id: '09Gfo5B0z50', title: 'goat vid 6'}, 
  { id: 'Y66i5TgH_r4', title: 'goat vid 7'},
  { id: 'W6EEXdiVaM4', title: 'Cutest Animal Goat Kid' },
  { id: 'nh1yvwvMLbI', title: 'Funny Goat Tongue' },
  { id: 'NaIrB-6XxNI', title: 'Quick Goat Clip' },
  { id: 'nNFzkpIM4OA', title: 'Cute Baby Lamb and Goat' },
  { id: 'OELoOaN33ks', title: 'Funny Goat Fail' },
  { id: '1MxSH9_M_aI', title: 'Top Goat Moments' },
  { id: '535Eiovot_c', title: 'Goat Making Faces' },
  { id: 'T4qBwFM65zc', title: 'Cute Goat Kids Playing' },
  { id: '6D-95s9NPMg', title: 'Baby Goat Jumping and Galloping' },
  { id: '_rXqYNSr98U', title: 'Bouncy Jumping Baby Goat' },
  { id: '0rylGW24JE4', title: 'Happy Baby Goat' },
  { id: 'wmTMYUAggPE', title: 'Baby Pygmy Goats Running' },
  { id: 'jKuE6hKBUCY', title: 'Goats Jumping for Joy' },
  { id: 'L21Cbor6JIY', title: 'Baby Goat House Jump' },
  { id: 'fmTNs6kktzo', title: 'Tiny Goat and Dog' },
  { id: 'Kn14Q0gbCGI', title: 'Sideways Hopping Goats' },
  { id: 'F3uYgYq1uWQ', title: 'Hopping Baby Goats' },
  { id: 'y6Bsk9xHv2k', title: 'Leaps and Bounces Compilation' },
  { id: 'ScCa7fZ-xPA', title: 'Pygmy Goats in the Grass' },
  { id: 'Z8jk2KWsoMk', title: 'Adorable Baby Goat Interaction' }
  // Add more verified videos here by finding them on YouTube and copying the video ID
  // Example: { id: 'VIDEO_ID_HERE', title: 'Description' },
];

// Site launch date (for counting goat video days)
// Note: JavaScript months are 0-indexed (0=Jan, 11=Dec)
const SITE_LAUNCH_DATE = new Date(2025, 11, 30); // December 30, 2025

// YouTube Player reference
let player = null;
let isMuted = true;

// Stats
let heartCount = 0;
let globalHeartCount = 0;
const GLOBAL_HEARTS_STORAGE_KEY = 'goattv_global_hearts_v2';

// Track current video to detect changes
let currentVideoIndex = null;

// Calendar state
let currentWeekStart = null;
let selectedDate = null;

// Goat sounds
const goatSound = new Audio('assets/goat-sound-390298.m4a');
const shareSound = new Audio('assets/goatsound2.m4a');

/**
 * Get the current "goat day" - changes at 11:59 PM CST
 * Returns a number representing the day for video selection
 */
function getGoatDay() {
  const now = new Date();
  
  const cstOptions = { timeZone: 'America/Chicago', hour: 'numeric', minute: 'numeric', hour12: false };
  const cstTime = new Intl.DateTimeFormat('en-US', cstOptions).format(now);
  const [hours, minutes] = cstTime.split(':').map(Number);
  
  const cstDateOptions = { timeZone: 'America/Chicago', year: 'numeric', month: 'numeric', day: 'numeric' };
  const cstDateStr = new Intl.DateTimeFormat('en-US', cstDateOptions).format(now);
  const [month, day, year] = cstDateStr.split('/').map(Number);
  
  let goatDay = new Date(year, month - 1, day);
  
  if (hours === 23 && minutes >= 59) {
    goatDay.setDate(goatDay.getDate() + 1);
  }
  
  const referenceDate = new Date(2025, 11, 30); // December 30, 2025 (month is 0-indexed)
  const daysSinceReference = Math.floor((goatDay - referenceDate) / (1000 * 60 * 60 * 24));
  
  return daysSinceReference;
}

/**
 * Get days since site launched (for goat video counter)
 */
function getDaysSinceLaunch() {
  const now = new Date();
  const diffTime = now - SITE_LAUNCH_DATE;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1); // At least 1 video shown
}

/**
 * Get today's goat video based on the day
 */
function getTodaysGoat() {
  const goatDay = getGoatDay();
  const videoIndex = goatDay % GOAT_VIDEOS.length;
  return GOAT_VIDEOS[videoIndex];
}

/**
 * Update the mute button icon
 */
function updateMuteButton() {
  const muteBtn = document.getElementById('mute-btn');
  const volumeIcon = muteBtn?.querySelector('.volume-icon');
  
  if (volumeIcon) {
    if (isMuted) {
      volumeIcon.classList.add('muted');
    } else {
      volumeIcon.classList.remove('muted');
    }
    muteBtn.title = isMuted ? 'Click to unmute' : 'Click to mute';
  }
}

/**
 * Toggle mute/unmute
 */
function toggleMute() {
  if (!player) return;
  
  if (isMuted) {
    player.unMute();
    isMuted = false;
  } else {
    player.mute();
    isMuted = true;
  }
  
  updateMuteButton();
  console.log(`🐐 Sound ${isMuted ? 'muted' : 'unmuted'}!`);
}

/**
 * Load hearts for a specific video
 */
function loadHeartsForVideo(videoId) {
  const hearts = localStorage.getItem(`goattv_hearts_${videoId}`);
  return hearts ? parseInt(hearts, 10) : 0;
}

/**
 * Save hearts for a specific video
 */
function saveHeartsForVideo(videoId, count) {
  localStorage.setItem(`goattv_hearts_${videoId}`, count.toString());
}

/**
 * Load global hearts
 */
function loadGlobalHearts() {
  const savedGlobalHearts = localStorage.getItem(GLOBAL_HEARTS_STORAGE_KEY);
  globalHeartCount = savedGlobalHearts ? parseInt(savedGlobalHearts, 10) : 0;
}

/**
 * Load and display stats
 */
function loadStats() {
  // Load global heart count
  loadGlobalHearts();
  
  // Update displays
  updateStatsDisplay();
}

/**
 * Update stats display
 */
function updateStatsDisplay() {
  const heartCountEl = document.getElementById('heart-count');
  
  if (heartCountEl) {
    heartCountEl.textContent = `x${globalHeartCount}`;
  }
}

/**
 * Increment heart count
 */
function incrementHearts() {
  // Increment per-video heart count
  const videoId = GOAT_VIDEOS[currentVideoIndex].id;
  let videoHearts = loadHeartsForVideo(videoId);
  videoHearts++;
  saveHeartsForVideo(videoId, videoHearts);
  
  // Increment global heart count
  globalHeartCount++;
  localStorage.setItem(GLOBAL_HEARTS_STORAGE_KEY, globalHeartCount.toString());
  
  // Update displays
  const heartCountEl = document.getElementById('heart-count');
  if (heartCountEl) {
    heartCountEl.textContent = `x${globalHeartCount}`;
    // Trigger pop animation
    heartCountEl.classList.remove('pop');
    void heartCountEl.offsetWidth; // Force reflow
    heartCountEl.classList.add('pop');
  }
  
  // Re-render calendar to show updated hearts on date
  if (currentWeekStart) {
    renderCalendar(currentWeekStart);
  }
}

/**
 * Create goat emoji burst animation
 */
function createGoatBurst() {
  const burstContainer = document.getElementById('goat-burst');
  if (!burstContainer) return;
  
  const goatEmojis = ['🐐', '🐐', '🐐', '❤️', '🐐', '💕', '🐐'];
  const numEmojis = 8 + Math.floor(Math.random() * 5); // 8-12 emojis
  
  for (let i = 0; i < numEmojis; i++) {
    const emoji = document.createElement('span');
    emoji.className = 'goat-emoji';
    emoji.textContent = goatEmojis[Math.floor(Math.random() * goatEmojis.length)];
    
    // Random starting offset (1-3 pixels in any direction)
    const startOffsetX = (Math.random() - 0.5) * 100;
    const startOffsetY = (Math.random() - 0.5) * 100;
    
    // Random direction and rotation
    const angle = (Math.random() * 360) * (Math.PI / 180);
    const distance = 40 + Math.random() * 60;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - 20; // Bias upward
    const rot = (Math.random() - 0.5) * 60;
    
    emoji.style.left = `${startOffsetX}px`;
    emoji.style.top = `${startOffsetY}px`;
    emoji.style.setProperty('--tx', `${tx}px`);
    emoji.style.setProperty('--ty', `${ty}px`);
    emoji.style.setProperty('--rot', `${rot}deg`);
    emoji.style.animationDelay = `${Math.random() * 0.1}s`;
    
    burstContainer.appendChild(emoji);
    
    // Remove after animation
    setTimeout(() => {
      emoji.remove();
    }, 1600);
  }
}

/**
 * Handle heart button click
 */
function handleHeartClick() {
  createGoatBurst();
  incrementHearts();
  playGoatSound();
  console.log('❤️ Love sent! Total hearts:', heartCount);
}

/**
 * Play goat sound effect (heart button)
 */
function playGoatSound() {
  // Reset to start if already playing
  goatSound.currentTime = 0;
  goatSound.play().catch(err => {
    // Ignore autoplay errors (user hasn't interacted yet)
    console.log('🐐 Sound blocked - user interaction required first');
  });
}

/**
 * Play share sound effect
 */
function playShareSound() {
  shareSound.currentTime = 0;
  shareSound.play().catch(err => {
    console.log('🐐 Sound blocked - user interaction required first');
  });
}

/**
 * Show toast notification
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/**
 * Get the current video's YouTube URL
 */
function getCurrentVideoUrl() {
  const video = getTodaysGoat();
  return `https://www.youtube.com/watch?v=${video.id}`;
}

/**
 * Check if device is mobile
 */
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
}

/**
 * Handle share button click
 */
async function handleShareClick() {
  playShareSound();
  const videoUrl = getCurrentVideoUrl();
  const shareData = {
    title: 'Goat.tv - Check out this goat video!',
    text: 'Watch this adorable goat! 🐐',
    url: videoUrl
  };
  
  // Mobile: Use Web Share API if available
  if (isMobileDevice() && navigator.share) {
    try {
      await navigator.share(shareData);
      console.log('🐐 Shared successfully!');
    } catch (err) {
      // User cancelled or error - fall back to clipboard
      if (err.name !== 'AbortError') {
        copyToClipboard(videoUrl);
      }
    }
  } else {
    // Desktop: Copy to clipboard
    copyToClipboard(videoUrl);
  }
}

/**
 * Copy URL to clipboard and show toast
 */
async function copyToClipboard(url) {
  try {
    await navigator.clipboard.writeText(url);
    showToast('vid link copied to clipboard, you goat 🐐');
    console.log('📋 Link copied:', url);
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showToast('vid link copied to clipboard, you goat 🐐');
  }
}

/**
 * Called by YouTube API when player is ready
 */
function onPlayerReady(event) {
  // Start playing muted (required for autoplay)
  event.target.mute();
  event.target.playVideo();
  isMuted = true;
  updateMuteButton();
  
  console.log(`🐐 Today's goat video: ${getTodaysGoat().title}`);
}

/**
 * Called by YouTube API when player state changes
 */
function onPlayerStateChange(event) {
  // Loop the video when it ends
  if (event.data === YT.PlayerState.ENDED) {
    player.playVideo();
  }
}

/**
 * Initialize the YouTube player
 */
function initPlayer() {
  const goatDay = getGoatDay();
  currentVideoIndex = goatDay % GOAT_VIDEOS.length;
  const video = GOAT_VIDEOS[currentVideoIndex];
  
  console.log(`🐐 Initializing player with video index ${currentVideoIndex}: ${video.title}`);
  
  player = new YT.Player('goat-video', {
    videoId: video.id,
    playerVars: {
      autoplay: 1,
      mute: 1,
      loop: 1,
      playlist: video.id,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      disablekb: 1,
      fs: 0
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

/**
 * Calculate time until next video change (11:59 PM CST)
 */
function getTimeUntilNextGoat() {
  const now = new Date();
  
  const cstOptions = { 
    timeZone: 'America/Chicago', 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric',
    hour: 'numeric', 
    minute: 'numeric', 
    second: 'numeric',
    hour12: false 
  };
  
  const cstStr = new Intl.DateTimeFormat('en-US', cstOptions).format(now);
  
  const match = cstStr.match(/(\d+)\/(\d+)\/(\d+),?\s*(\d+):(\d+):(\d+)/);
  if (!match) return null;
  
  const [, , , , hours, minutes, seconds] = match.map(Number);
  
  const targetHour = 23;
  const targetMinute = 59;
  
  const currentSeconds = hours * 3600 + minutes * 60 + seconds;
  const targetSeconds = targetHour * 3600 + targetMinute * 60;
  
  let secondsUntilTarget;
  if (currentSeconds < targetSeconds) {
    secondsUntilTarget = targetSeconds - currentSeconds;
  } else {
    secondsUntilTarget = (24 * 3600 - currentSeconds) + targetSeconds;
  }
  
  return secondsUntilTarget * 1000;
}

/**
 * Schedule the next video change
 */
function scheduleNextGoat() {
  const timeUntilNext = getTimeUntilNextGoat();
  
  if (timeUntilNext) {
    console.log(`🐐 Next goat video in ${Math.round(timeUntilNext / 1000 / 60)} minutes`);
    
    setTimeout(() => {
      checkAndUpdateVideo();
      scheduleNextGoat();
    }, timeUntilNext);
  }
}

/**
 * Check if the video needs to change and update if so
 */
function checkAndUpdateVideo() {
  const goatDay = getGoatDay();
  const videoIndex = goatDay % GOAT_VIDEOS.length;
  
  // Only update if the video has actually changed
  if (currentVideoIndex !== videoIndex) {
    console.log(`🐐 New goat day! Switching from video ${currentVideoIndex} to ${videoIndex}`);
    currentVideoIndex = videoIndex;
    const video = GOAT_VIDEOS[videoIndex];
    
    if (player && player.loadVideoById) {
      player.loadVideoById(video.id);
    }
    updateStatsDisplay();
  }
}

/**
 * Periodic check every minute to catch video changes
 * This handles cases where the page was left open but timer drifted
 */
function startPeriodicCheck() {
  setInterval(() => {
    checkAndUpdateVideo();
  }, 60000); // Check every minute
}

/**
 * Handle visibility change - check for new video when tab becomes visible
 */
function handleVisibilityChange() {
  if (!document.hidden) {
    console.log('🐐 Tab became visible, checking for new video...');
    checkAndUpdateVideo();
  }
}

/**
 * Get the video index for a specific date
 */
function getVideoIndexForDate(date) {
  const referenceDate = new Date(2025, 11, 30); // December 30, 2025
  const daysSinceReference = Math.floor((date - referenceDate) / (1000 * 60 * 60 * 24));
  return daysSinceReference % GOAT_VIDEOS.length;
}

/**
 * Load video by date
 */
function loadVideoByDate(date) {
  const videoIndex = getVideoIndexForDate(date);
  const video = GOAT_VIDEOS[videoIndex];
  
  if (player && player.loadVideoById) {
    player.loadVideoById(video.id);
    currentVideoIndex = videoIndex;
    selectedDate = new Date(date);
    
    // Update calendar display
    renderCalendar(currentWeekStart);
    
    console.log(`🐐 Loaded video for ${date.toDateString()}: ${video.title}`);
  }
}

/**
 * Render the calendar for a given week
 */
function renderCalendar(weekStart) {
  const calendarDays = document.getElementById('calendar-days');
  if (!calendarDays) return;
  
  calendarDays.innerHTML = '';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const launchDate = new Date(2025, 11, 30); // December 30, 2025
  launchDate.setHours(0, 0, 0, 0);
  
  // Create 7 day cells
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    date.setHours(0, 0, 0, 0);
    
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';
    
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = date.getDate();
    dayEl.appendChild(dayNumber);
    
    // Check if date is disabled (before launch or after today)
    if (date < launchDate || date > today) {
      dayEl.classList.add('disabled');
    } else {
      // Get video for this date
      const videoIndex = getVideoIndexForDate(date);
      const video = GOAT_VIDEOS[videoIndex];
      const videoHearts = loadHeartsForVideo(video.id);
      
      if (videoHearts > 0) {
        const heartsEl = document.createElement('div');
        heartsEl.className = 'day-hearts';
        heartsEl.textContent = `♥${videoHearts}`;
        dayEl.appendChild(heartsEl);
      }
      
      // Click handler
      dayEl.addEventListener('click', () => {
        loadVideoByDate(date);
      });
      
      // Hover handler for tooltip
      dayEl.addEventListener('mouseenter', (e) => {
        showCalendarTooltip(e, date, video.title);
      });
      
      dayEl.addEventListener('mouseleave', () => {
        hideCalendarTooltip();
      });
    }
    
    // Mark today
    if (date.getTime() === today.getTime()) {
      dayEl.classList.add('today');
    }
    
    // Mark selected date
    if (selectedDate && date.getTime() === selectedDate.getTime()) {
      dayEl.classList.add('selected');
    }
    
    calendarDays.appendChild(dayEl);
  }
}

/**
 * Show calendar tooltip
 */
function showCalendarTooltip(event, date, videoTitle) {
  const tooltip = document.getElementById('calendar-tooltip');
  if (!tooltip) return;
  
  const dateStr = date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  tooltip.querySelector('.tooltip-date').textContent = dateStr;
  tooltip.querySelector('.tooltip-title').textContent = videoTitle;
  
  const rect = event.target.getBoundingClientRect();
  tooltip.style.left = `${rect.left + rect.width / 2}px`;
  tooltip.style.top = `${rect.top - 10}px`;
  tooltip.style.transform = 'translate(-50%, -100%)';
  
  tooltip.classList.add('visible');
}

/**
 * Hide calendar tooltip
 */
function hideCalendarTooltip() {
  const tooltip = document.getElementById('calendar-tooltip');
  if (tooltip) {
    tooltip.classList.remove('visible');
  }
}

/**
 * Update calendar title
 */
function updateCalendarTitle(weekStart) {
  const titleEl = document.getElementById('calendar-title');
  if (!titleEl) return;
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const monthStart = weekStart.toLocaleDateString('en-US', { month: 'short' });
  const monthEnd = weekEnd.toLocaleDateString('en-US', { month: 'short' });
  const yearStart = weekStart.getFullYear();
  const yearEnd = weekEnd.getFullYear();
  
  if (monthStart === monthEnd) {
    titleEl.textContent = `Week of ${monthStart} ${weekStart.getDate()}, ${yearStart}`;
  } else if (yearStart === yearEnd) {
    titleEl.textContent = `${monthStart} ${weekStart.getDate()} - ${monthEnd} ${weekEnd.getDate()}, ${yearStart}`;
  } else {
    titleEl.textContent = `${monthStart} ${weekStart.getDate()}, ${yearStart} - ${monthEnd} ${weekEnd.getDate()}, ${yearEnd}`;
  }
}

/**
 * Go to previous week
 */
function goToPreviousWeek() {
  const newWeekStart = new Date(currentWeekStart);
  newWeekStart.setDate(currentWeekStart.getDate() - 7);
  
  // Don't allow navigation before week of December 28, 2025
  const earliestWeek = new Date(2025, 11, 28); // December 28, 2025
  if (newWeekStart < earliestWeek) {
    return;
  }
  
  currentWeekStart = newWeekStart;
  updateCalendarTitle(currentWeekStart);
  renderCalendar(currentWeekStart);
  updateNavigationButtons();
}

/**
 * Go to next week
 */
function goToNextWeek() {
  const newWeekStart = new Date(currentWeekStart);
  newWeekStart.setDate(currentWeekStart.getDate() + 7);
  
  currentWeekStart = newWeekStart;
  updateCalendarTitle(currentWeekStart);
  renderCalendar(currentWeekStart);
  updateNavigationButtons();
}

/**
 * Update navigation button states
 */
function updateNavigationButtons() {
  const prevBtn = document.getElementById('prev-week');
  const nextBtn = document.getElementById('next-week');
  
  if (!prevBtn || !nextBtn) return;
  
  // Disable previous button if at earliest allowed week
  const earliestWeek = new Date(2025, 11, 28); // December 28, 2025
  prevBtn.disabled = currentWeekStart <= earliestWeek;
}

/**
 * Initialize calendar to current week
 */
function initCalendar() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Find the start of the week (Sunday)
  const dayOfWeek = today.getDay();
  currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - dayOfWeek);
  
  // Set selected date to today
  selectedDate = new Date(today);
  
  updateCalendarTitle(currentWeekStart);
  renderCalendar(currentWeekStart);
  
  // Set up navigation buttons
  const prevBtn = document.getElementById('prev-week');
  const nextBtn = document.getElementById('next-week');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', goToPreviousWeek);
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', goToNextWeek);
  }
  
  // Update button states
  updateNavigationButtons();
}

/**
 * Called by YouTube IFrame API when ready
 */
function onYouTubeIframeAPIReady() {
  initPlayer();
  scheduleNextGoat();
  startPeriodicCheck();
  
  // Listen for tab visibility changes to check for new video
  document.addEventListener('visibilitychange', handleVisibilityChange);
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Load YouTube IFrame API
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
  // Set up share button click handler
  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', handleShareClick);
  }
  
  // Set up mute button click handler
  const muteBtn = document.getElementById('mute-btn');
  if (muteBtn) {
    muteBtn.addEventListener('click', toggleMute);
  }
  
  // Set up heart button click handler
  const heartBtn = document.getElementById('heart-btn');
  if (heartBtn) {
    heartBtn.addEventListener('click', handleHeartClick);
  }
  
  // Load and display stats
  loadStats();
  
  // Initialize calendar
  initCalendar();
  
  // Fun console message
  console.log('🐐 Welcome to Goat.tv! 🐐');
  console.log('For the G.O.A.T. mother-in-law! 💕');
});
