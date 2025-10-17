// Girar imagem do rosto ao clicar
const face = document.querySelector(".myface img");
let angle = 0;
face.addEventListener("click", () => {
  angle += 360;
  face.style.transform = `rotateY(${angle}deg)`;
});

// Animação de scroll para ativar seções
function initAnimacaoScroll() {
  const sections = document.querySelectorAll(".js-scroll");
  if (sections.length) {
    const windowMetade = window.innerHeight * 0.8;
    function animaScroll() {
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        const isSectionVisible = sectionTop - windowMetade < 0;
        if (isSectionVisible) {
          section.classList.add("ativo");
        } else {
          section.classList.remove("ativo");
        }
      });
    }
    animaScroll();
    window.addEventListener("scroll", animaScroll);
  }
}
initAnimacaoScroll();

// Swiper (carrossel)
const swiper = new Swiper(".swiper", {
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// Modal de imagem expandida
const imgModal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");
const closeImgBtn = document.querySelector(".close");

document.querySelectorAll(".expand-img").forEach((img) => {
  img.addEventListener("click", () => {
    imgModal.style.display = "block";
    modalImg.src = img.src;
  });
});

closeImgBtn.onclick = () => {
  imgModal.style.display = "none";
};

imgModal.onclick = (e) => {
  if (e.target === imgModal) {
    imgModal.style.display = "none";
  }
};

// Fundo animado: estrelas e cometas
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("space");
  const ctx = canvas.getContext("2d");

  let stars = [];
  let comets = [];
  const numStars = 150;
  const cometChance = 0.002;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Estrelas
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.2,
      alpha: Math.random(),
      alphaChange: 0.02 * (Math.random() - 0.5),
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    stars.forEach((star) => {
      star.alpha += star.alphaChange;
      if (star.alpha <= 0 || star.alpha >= 1) {
        star.alphaChange *= -1;
      }
      ctx.globalAlpha = star.alpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;

    // Cometas
    if (Math.random() < cometChance) {
      comets.push({
        x: Math.random() * canvas.width,
        y: -50,
        length: 200,
        speed: 6 + Math.random() * 4,
        angle: Math.PI / 4,
      });
    }

    for (let i = comets.length - 1; i >= 0; i--) {
      let comet = comets[i];
      let dx = Math.cos(comet.angle) * comet.speed;
      let dy = Math.sin(comet.angle) * comet.speed;

      comet.x += dx;
      comet.y += dy;

      let gradient = ctx.createLinearGradient(
        comet.x,
        comet.y,
        comet.x - dx * comet.length,
        comet.y - dy * comet.length
      );
      gradient.addColorStop(0, "rgba(255,255,255,0.8)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(comet.x, comet.y);
      ctx.lineTo(comet.x - dx * comet.length, comet.y - dy * comet.length);
      ctx.stroke();

      if (comet.x > canvas.width + 200 || comet.y > canvas.height + 200) {
        comets.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
});

// Modal Gaia
document.addEventListener("DOMContentLoaded", () => {
  const gaiaModal = document.getElementById("gaiaModal");
  const openGaiaModalBtn = document.getElementById("openGaiaModal");
  const closeGaiaBtn = gaiaModal.querySelector(".close");

  openGaiaModalBtn.onclick = () => gaiaModal.style.display = "block";
  closeGaiaBtn.onclick = () => gaiaModal.style.display = "none";
  window.onclick = (e) => {
    if (e.target === gaiaModal) gaiaModal.style.display = "none";
  };

 
});

// Modal Hemominas com navegação de imagens
document.addEventListener("DOMContentLoaded", () => {
  const hemominasModal = document.getElementById("hemominasModal");
  const openBtn = document.getElementById("openHemominasModal");
  const closeBtn = hemominasModal?.querySelector(".close");
  const prevBtn = hemominasModal?.querySelector(".prev");
  const nextBtn = hemominasModal?.querySelector(".next");
  const slides = hemominasModal ? Array.from(hemominasModal.querySelectorAll(".carousel .slide")) : [];
  let current = 0;

  function showSlide(index) {
   
    const currentSlide = slides[current];
    if (currentSlide && currentSlide.tagName === "VIDEO") currentSlide.pause();

    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    current = index;
  }

  openBtn?.addEventListener("click", () => {
    hemominasModal.style.display = "flex";
    showSlide(current);
  });

  closeBtn?.addEventListener("click", () => {
 
    const s = slides[current];
    if (s && s.tagName === "VIDEO") s.pause();
    hemominasModal.style.display = "none";
  });

  window.addEventListener("click", e => {
    if (e.target === hemominasModal) {
      const s = slides[current];
      if (s && s.tagName === "VIDEO") s.pause();
      hemominasModal.style.display = "none";
    }
  });

  nextBtn?.addEventListener("click", () => showSlide((current + 1) % slides.length));
  prevBtn?.addEventListener("click", () => showSlide((current - 1 + slides.length) % slides.length));

  document.addEventListener("keydown", (e) => {
    if (getComputedStyle(hemominasModal).display === "none") return;
    if (e.key === "ArrowRight") showSlide((current + 1) % slides.length);
    if (e.key === "ArrowLeft") showSlide((current - 1 + slides.length) % slides.length);
    if (e.key === "Escape") {
      const s = slides[current];
      if (s && s.tagName === "VIDEO") s.pause();
      hemominasModal.style.display = "none";
    }
  });
});