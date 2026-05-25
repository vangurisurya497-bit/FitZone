// FitZone Main Application Controller

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. SPA ROUTING & TRANSITIONS
  // ==========================================
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.view-section');
  const navMenu = document.getElementById('nav-menu');
  const hamburgerBtn = document.getElementById('hamburger-btn');

  function navigateTo(hash) {
    const targetId = hash.replace('#', '') || 'home';
    let targetSection = document.getElementById(targetId);

    if (!targetSection) return;

    // Remove active class from all links and sections
    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${targetId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    sections.forEach(sec => {
      sec.classList.remove('active');
    });

    // Show target section
    targetSection.classList.add('active');
    
    // Smooth scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Handle header visual scroll reset
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Monitor hash changes
  window.addEventListener('hashchange', () => {
    navigateTo(window.location.hash);
  });

  // Handle initial page load hash
  if (window.location.hash) {
    navigateTo(window.location.hash);
  } else {
    navigateTo('#home');
  }

  // Intercept trigger buttons/links
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-trigger') || e.target.closest('.nav-trigger')) {
      const el = e.target.classList.contains('nav-trigger') ? e.target : e.target.closest('.nav-trigger');
      const href = el.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        window.location.hash = href;
      }
    }
  });


  // ==========================================
  // 2. MOBILE HAMBURGER MENU
  // ==========================================
  hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('active');
      navMenu.classList.remove('active');
      window.location.hash = link.getAttribute('href');
    });
  });


  // ==========================================
  // 3. HEADER SCROLL EFFECT
  // ==========================================
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });


  // ==========================================
  // 4. OFFER COUNTDOWN TIMER (Urgent/Perpetual)
  // ==========================================
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');

  // Set counter to end at midnight tonight for perpetual urgency
  function getMidnightEnd() {
    const end = new Date();
    end.setHours(24, 0, 0, 0); // Tonight at midnight
    // If it's already too close, add 24 hours
    if (end.getTime() - Date.now() < 2 * 60 * 60 * 1000) {
      end.setDate(end.getDate() + 1);
    }
    return end.getTime();
  }

  const countDownDate = getMidnightEnd();

  function updateTimer() {
    const now = Date.now();
    const distance = countDownDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');

    if (distance < 0) {
      clearInterval(timerInterval);
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
    }
  }

  updateTimer();
  const timerInterval = setInterval(updateTimer, 1000);


  // ==========================================
  // 5. BEFORE/AFTER SLIDER
  // ==========================================
  const slider = document.getElementById('comparison-slider');
  const afterImage = document.getElementById('image-after');
  const handle = document.getElementById('slider-handle');

  if (slider && afterImage && handle) {
    let isDragging = false;

    function setSliderPosition(x) {
      const rect = slider.getBoundingClientRect();
      let offsetX = x - rect.left;
      
      // Keep within bounds
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      afterImage.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    }

    // Mouse Events
    handle.addEventListener('mousedown', () => { isDragging = true; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    
    slider.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    // Touch Events for Mobile
    handle.addEventListener('touchstart', () => { isDragging = true; });
    window.addEventListener('touchend', () => { isDragging = false; });
    
    slider.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.touches[0].clientX);
    });

    // Handle clicks directly on the slider track
    slider.addEventListener('click', (e) => {
      if (e.target === handle || handle.contains(e.target)) return;
      setSliderPosition(e.clientX);
    });
  }


  // ==========================================
  // 6. CLASS FILTERING
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const classCards = document.querySelectorAll('.class-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      classCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // ==========================================
  // 7. BMI CALCULATOR TOOL
  // ==========================================
  const calcBmiBtn = document.getElementById('btn-calc-bmi');
  const bmiWeightInput = document.getElementById('bmi-weight');
  const bmiHeightInput = document.getElementById('bmi-height');
  const bmiResultBox = document.getElementById('bmi-result-box');
  const bmiResultVal = document.getElementById('bmi-result-val');
  const bmiResultCat = document.getElementById('bmi-result-cat');
  const bmiResultDesc = document.getElementById('bmi-result-desc');

  if (calcBmiBtn) {
    calcBmiBtn.addEventListener('click', () => {
      const weight = parseFloat(bmiWeightInput.value);
      const height = parseFloat(bmiHeightInput.value);

      if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        showToast('Please enter valid numeric height and weight values.', 'error');
        return;
      }

      // Formula: Weight (kg) / Height(m)^2
      const heightMeters = height / 100;
      const bmi = (weight / (heightMeters * heightMeters)).toFixed(1);

      bmiResultVal.textContent = bmi;
      bmiResultBox.style.display = 'block';

      let category = '';
      let desc = '';
      let color = 'var(--primary)';

      if (bmi < 18.5) {
        category = 'Underweight';
        desc = 'Your weight index is lower than typical. Focus on a slight caloric surplus and strength training.';
        color = 'var(--accent)';
      } else if (bmi >= 18.5 && bmi < 24.9) {
        category = 'Normal Range';
        desc = 'Excellent! You hold a highly functional physical bodyweight balance. Keep training consistent!';
        color = 'var(--primary)';
      } else if (bmi >= 25 && bmi < 29.9) {
        category = 'Overweight';
        desc = 'Slightly elevated weight parameters. Consider pairing cardio HIIT with a minor caloric deficit.';
        color = 'var(--accent)';
      } else {
        category = 'Obese Range';
        desc = 'Higher fat tissue density markers. We recommend enrolling in personal training and dietary plans.';
        color = 'var(--accent)';
      }

      bmiResultCat.textContent = category;
      bmiResultCat.style.color = color;
      bmiResultVal.style.color = color;
      bmiResultVal.style.textShadow = `0 0 15px ${color}`;
      bmiResultDesc.textContent = desc;

      showToast(`BMI Calculated: ${bmi} (${category})`);
    });
  }


  // ==========================================
  // 8. INTERACTIVE MUSCLE TARGET MAP
  // ==========================================
  const musclePaths = document.querySelectorAll('.muscle-path');
  const muscleTitle = document.getElementById('muscle-title');
  const muscleDesc = document.getElementById('muscle-desc');
  const muscleWorkouts = document.getElementById('muscle-workouts');

  const muscleData = {
    shoulders: {
      name: 'Deltoids & Shoulders',
      desc: 'Important for pressing power and upper frame width. Standard targeting builds joint stability.',
      workouts: [
        { name: 'Overhead Barbell Press', detail: '3 Sets x 8 Reps' },
        { name: 'Dumbbell Lateral Raise', detail: '4 Sets x 15 Reps' },
        { name: 'Cable Face Pulls', detail: '3 Sets x 12 Reps' }
      ],
      trainer: 'Coach Marcus'
    },
    chest: {
      name: 'Pectoral Muscles',
      desc: 'The center of upper body pushing strength. High density fiber targeting is best achieved via barbell/dumbbell variations.',
      workouts: [
        { name: 'Flat Barbell Bench Press', detail: '4 Sets x 6 Reps' },
        { name: 'Incline Dumbbell Flys', detail: '3 Sets x 10 Reps' },
        { name: 'Weighted Chest Dips', detail: '3 Sets x Failure' }
      ],
      trainer: 'Coach Marcus'
    },
    abs: {
      name: 'Abdominals & Core',
      desc: 'Crucial for full-body coordination and posture support. A strong core increases lift safety.',
      workouts: [
        { name: 'Hanging Leg Raises', detail: '3 Sets x 15 Reps' },
        { name: 'Ab Wheel Rollouts', detail: '3 Sets x 12 Reps' },
        { name: 'Plank Holds', detail: '3 Sets x 2 Mins' }
      ],
      trainer: 'Coach Aria'
    },
    arms: {
      name: 'Biceps & Triceps',
      desc: 'Comprised of arm pull and push flexors. Training these builds definition and compound stability.',
      workouts: [
        { name: 'Alternating Dumbbell Curl', detail: '3 Sets x 12 Reps' },
        { name: 'Tricep Rope Overhead Extension', detail: '4 Sets x 10 Reps' },
        { name: 'Preacher Barbell Curls', detail: '3 Sets x 10 Reps' }
      ],
      trainer: 'Coach Marcus'
    },
    legs: {
      name: 'Quadriceps, Hamstrings & Calves',
      desc: 'The foundation of absolute human force and athleticism. Heavy leg work raises natural metabolism.',
      workouts: [
        { name: 'Barbell Back Squats', detail: '4 Sets x 8 Reps' },
        { name: 'Romanian Deadlifts', detail: '3 Sets x 10 Reps' },
        { name: 'Seated Calf Raises', detail: '4 Sets x 20 Reps' }
      ],
      trainer: 'Coach Serena / Marcus'
    }
  };

  musclePaths.forEach(path => {
    path.addEventListener('click', () => {
      // Toggle highlight active status
      musclePaths.forEach(p => p.classList.remove('selected'));
      path.classList.add('selected');

      const muscleKey = path.getAttribute('data-muscle');
      const data = muscleData[muscleKey];

      if (data) {
        muscleTitle.textContent = data.name;
        muscleDesc.innerHTML = `${data.desc} <br><br><strong>Lead Speciality Trainer:</strong> ${data.trainer}`;
        
        // Clear workout list
        muscleWorkouts.innerHTML = '';
        data.workouts.forEach(work => {
          const li = document.createElement('li');
          li.className = 'workout-item';
          li.innerHTML = `
            <span class="workout-bullet"></span>
            <span class="workout-name">${work.name}</span>
            <span class="workout-detail">${work.detail}</span>
          `;
          muscleWorkouts.appendChild(li);
        });
      }
    });
  });


  // ==========================================
  // 9. PRICING MONTHLY / ANNUAL TOGGLE
  // ==========================================
  const pricingToggle = document.getElementById('pricing-toggle');
  const monthlyLabel = document.getElementById('monthly-label');
  const annualLabel = document.getElementById('annual-label');
  const priceBasic = document.getElementById('price-basic');
  const pricePremium = document.getElementById('price-premium');
  const priceElite = document.getElementById('price-elite');

  if (pricingToggle) {
    pricingToggle.addEventListener('change', () => {
      const isAnnual = pricingToggle.checked;
      
      if (isAnnual) {
        monthlyLabel.classList.remove('active');
        annualLabel.classList.add('active');
        
        priceBasic.textContent = priceBasic.getAttribute('data-annual');
        pricePremium.textContent = pricePremium.getAttribute('data-annual');
        priceElite.textContent = priceElite.getAttribute('data-annual');
      } else {
        monthlyLabel.classList.add('active');
        annualLabel.classList.remove('active');
        
        priceBasic.textContent = priceBasic.getAttribute('data-monthly');
        pricePremium.textContent = pricePremium.getAttribute('data-monthly');
        priceElite.textContent = priceElite.getAttribute('data-monthly');
      }
    });
  }


  // ==========================================
  // 10. CLASS BOOKING FORM MODAL ACTIONS
  // ==========================================
  const modalOverlay = document.getElementById('booking-modal-overlay');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const displayClassInput = document.getElementById('display-class-name');
  const bookingClassInput = document.getElementById('booking-class-name');
  const bookingForm = document.getElementById('class-booking-form');

  // Event listener for opening modal
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('open-booking-modal')) {
      const className = e.target.getAttribute('data-class');
      displayClassInput.value = className;
      bookingClassInput.value = className;
      modalOverlay.classList.add('open');
    }
  });

  closeModalBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('open');
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('open');
    }
  });

  // AJAX Submit Booking Form
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const bookingData = {
      name: document.getElementById('book-name').value,
      email: document.getElementById('book-email').value,
      phone: document.getElementById('book-phone').value,
      fitnessClass: bookingClassInput.value,
      timeSlot: document.getElementById('book-time').value
    };

    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showToast(`Success! Your slot for "${bookingData.fitnessClass}" is confirmed.`);
        bookingForm.reset();
        modalOverlay.classList.remove('open');
      } else {
        showToast(data.message || 'Error scheduling slot.', 'error');
      }
    })
    .catch(err => {
      console.error(err);
      showToast('Connection failed. Please check backend server status.', 'error');
    });
  });


  // ==========================================
  // 11. PROGRESS TRACKING DATA & CANVAS CHART
  // ==========================================
  const chartCanvas = document.getElementById('progress-chart');
  const progressLogForm = document.getElementById('progress-log-form');
  const pFormDate = document.getElementById('p-form-date');
  const pFormWeight = document.getElementById('p-form-weight');
  const pFormFat = document.getElementById('p-form-fat');

  const pStatStart = document.getElementById('p-stat-start');
  const pStatCurrent = document.getElementById('p-stat-current');
  const pStatDiff = document.getElementById('p-stat-diff');

  // Pre-fill today's date
  if (pFormDate) {
    pFormDate.value = new Date().toISOString().split('T')[0];
  }

  let progressData = [];

  function fetchProgressAndDraw() {
    fetch('/api/progress')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.progress.length > 0) {
          progressData = resData.progress;
          updateProgressDashboardStats();
          drawWeightChart();
        }
      })
      .catch(err => console.error('Failed to load tracking data:', err));
  }

  function updateProgressDashboardStats() {
    if (progressData.length === 0) return;
    
    const firstEntry = progressData[0];
    const latestEntry = progressData[progressData.length - 1];

    const startW = firstEntry.weight;
    const currentW = latestEntry.weight;
    const diff = (currentW - startW).toFixed(1);

    pStatStart.textContent = `${startW} kg`;
    pStatCurrent.textContent = `${currentW} kg`;
    pStatDiff.textContent = `${diff > 0 ? '+' : ''}${diff} kg`;

    if (diff < 0) {
      pStatDiff.style.color = '#00FF66'; // Green for weight loss
    } else if (diff > 0) {
      pStatDiff.style.color = 'var(--accent)'; // Red for weight gain
    } else {
      pStatDiff.style.color = 'var(--white)';
    }
  }

  function drawWeightChart() {
    if (!chartCanvas) return;
    const ctx = chartCanvas.getContext('2d');
    if (!ctx) return;

    // Make canvas responsive to display sizes
    const rect = chartCanvas.getBoundingClientRect();
    chartCanvas.width = rect.width * window.devicePixelRatio;
    chartCanvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const w = rect.width;
    const h = rect.height;

    // Clear Canvas
    ctx.clearRect(0, 0, w, h);

    if (progressData.length === 0) {
      ctx.fillStyle = '#888';
      ctx.font = '14px Outfit';
      ctx.textAlign = 'center';
      ctx.fillText('No progress logs logged yet.', w / 2, h / 2);
      return;
    }

    // Chart margins
    const margin = { top: 25, right: 30, bottom: 35, left: 35 };
    const chartW = w - margin.left - margin.right;
    const chartH = h - margin.top - margin.bottom;

    // Extract weights
    const weights = progressData.map(d => d.weight);
    const minW = Math.min(...weights) - 1;
    const maxW = Math.max(...weights) + 1;
    const rangeW = maxW - minW || 1;

    // 1. Draw horizontal grid lines and Y-axis labels
    const gridLines = 4;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#888';
    ctx.font = '10px Outfit';
    ctx.textAlign = 'right';

    for (let i = 0; i <= gridLines; i++) {
      const ratio = i / gridLines;
      const y = margin.top + chartH * (1 - ratio);
      const val = (minW + rangeW * ratio).toFixed(1);

      // Grid line
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(w - margin.right, y);
      ctx.stroke();

      // Label
      ctx.fillText(`${val}kg`, margin.left - 8, y + 3);
    }

    // Calculate coordinate points
    const points = [];
    const count = progressData.length;

    progressData.forEach((entry, idx) => {
      const xRatio = count > 1 ? idx / (count - 1) : 0.5;
      const x = margin.left + chartW * xRatio;
      
      const yRatio = (entry.weight - minW) / rangeW;
      const y = margin.top + chartH * (1 - yRatio);

      points.push({ x, y, date: entry.date, weight: entry.weight });
    });

    // 2. Draw main neon connecting line
    ctx.strokeStyle = '#00D4FF';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Set glow shadow
    ctx.shadowColor = 'rgba(0, 212, 255, 0.4)';
    ctx.shadowBlur = 10;

    ctx.beginPath();
    points.forEach((pt, idx) => {
      if (idx === 0) {
        ctx.moveTo(pt.x, pt.y);
      } else {
        ctx.lineTo(pt.x, pt.y);
      }
    });
    ctx.stroke();

    // Disable shadow for text/dots
    ctx.shadowBlur = 0;

    // 3. Draw gradient area under the line
    if (points.length > 0) {
      const gradient = ctx.createLinearGradient(0, margin.top, 0, h - margin.bottom);
      gradient.addColorStop(0, 'rgba(0, 212, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 212, 255, 0.0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(points[0].x, h - margin.bottom);
      points.forEach(pt => {
        ctx.lineTo(pt.x, pt.y);
      });
      ctx.lineTo(points[points.length - 1].x, h - margin.bottom);
      ctx.closePath();
      ctx.fill();
    }

    // 4. Draw data points and weight tag labels
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = '10px Outfit';

    points.forEach((pt, idx) => {
      // Draw outer point ring
      ctx.strokeStyle = '#00D4FF';
      ctx.lineWidth = 2;
      ctx.fillStyle = '#0A0A0A';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw date on X-axis (only draw some to avoid cluttering)
      if (count <= 6 || idx % Math.ceil(count / 5) === 0 || idx === count - 1) {
        ctx.fillStyle = '#888';
        const formattedDate = pt.date.substring(5); // Show MM-DD
        ctx.fillText(formattedDate, pt.x, h - 10);
      }

      // Draw value on hover or always if list is small
      if (count <= 10) {
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${pt.weight}`, pt.x, pt.y - 8);
      }
    });
  }

  // Handle Log submit
  if (progressLogForm) {
    progressLogForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const newLog = {
        weight: pFormWeight.value,
        bodyFat: pFormFat.value,
        date: pFormDate.value
      };

      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showToast('Progress log recorded successfully!');
          pFormWeight.value = '';
          pFormFat.value = '';
          pFormDate.value = new Date().toISOString().split('T')[0];
          
          progressData = data.progress;
          updateProgressDashboardStats();
          drawWeightChart();
        } else {
          showToast(data.message || 'Failed to save log', 'error');
        }
      })
      .catch(err => {
        console.error(err);
        showToast('Connection failed. Please check server.', 'error');
      });
    });
  }

  // Initialize progress and draw
  fetchProgressAndDraw();


  // ==========================================
  // 12. CONTACT / ENQUIRY FORM SUBMISSION
  // ==========================================
  const contactForm = document.getElementById('contact-enquiry-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const contactData = {
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        phone: document.getElementById('contact-phone').value,
        message: document.getElementById('contact-msg').value
      };

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showToast('Enquiry message received. We will get back shortly!');
          contactForm.reset();
        } else {
          showToast(data.message || 'Error sending enquiry.', 'error');
        }
      })
      .catch(err => {
        console.error(err);
        showToast('Connection failed. Please check server.', 'error');
      });
    });
  }


  // ==========================================
  // 13. NEWSLETTER FORM
  // ==========================================
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you for subscribing to FitZone updates!');
      newsletterForm.reset();
    });
  }


  // ==========================================
  // 14. VIDEO BACKGROUND TOGGLER
  // ==========================================
  const toggleVideoBtn = document.getElementById('toggle-video-btn');
  const videoBgContainer = document.getElementById('video-bg-container');
  const bgVideo = document.getElementById('bg-video');

  if (toggleVideoBtn && videoBgContainer && bgVideo) {
    toggleVideoBtn.addEventListener('click', () => {
      if (bgVideo.paused) {
        bgVideo.play();
        videoBgContainer.classList.remove('dimmed');
        toggleVideoBtn.classList.remove('off');
        toggleVideoBtn.querySelector('.toggle-text').textContent = 'Video BG: ON';
      } else {
        bgVideo.pause();
        videoBgContainer.classList.add('dimmed');
        toggleVideoBtn.classList.add('off');
        toggleVideoBtn.querySelector('.toggle-text').textContent = 'Video BG: OFF';
      }
    });
  }


  // ==========================================
  // 15. TOAST NOTIFICATION UTILITY
  // ==========================================
  const toastBox = document.getElementById('toast-message-box');

  function showToast(message, type = 'success') {
    if (!toastBox) return;

    toastBox.textContent = message;
    if (type === 'error') {
      toastBox.classList.add('error');
    } else {
      toastBox.classList.remove('error');
    }

    toastBox.classList.add('show');

    setTimeout(() => {
      toastBox.classList.remove('show');
    }, 4000);
  }

  // Draw chart on window resize to keep it sharp and responsive
  window.addEventListener('resize', () => {
    if (progressData.length > 0) {
      drawWeightChart();
    }
  });

});
