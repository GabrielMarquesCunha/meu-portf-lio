
const face = document.querySelector(".myface img");
let angle = 0;

face.addEventListener("click", () => {
  angle += 360;
  face.style.transform = `rotateY(${angle}deg)`;
});

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
          console.log("Ativou:", section);
        } else {
          section.classList.remove("ativo");
        }
      })
    }
    animaScroll();
    window.addEventListener("scroll", animaScroll);
  }
}
initAnimacaoScroll();



const swiper = new Swiper('.swiper', {
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
})

const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.querySelector(".close");


document.querySelectorAll(".expand-img").forEach(img => {
  img.addEventListener("click", () => {
    modal.style.display = "block";
    modalImg.src = img.src;
  });
});

// Fecha modal
closeBtn.onclick = function() {
  modal.style.display = "none";
}

// Fecha clicando fora da imagem
modal.onclick = function(e) {
  if (e.target === modal) {
    modal.style.display = "none";
  }
}

/* COMENTINHAAAAAAAAAAAAAS E ESTRELAS */ 

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("space");
  const ctx = canvas.getContext("2d");

  let stars = [];
  let comets = [];
  const numStars = 150; // quantidade de estrelas
  const cometChance = 0.002; // chance de nascer um cometa por frame

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Cria as estrelas
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.2,
      alpha: Math.random(),
      alphaChange: 0.02 * (Math.random() - 0.5)
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    ctx.fillStyle = "white";
    stars.forEach(star => {
      star.alpha += star.alphaChange;
      if (star.alpha <= 0 || star.alpha >= 1) {
        star.alphaChange *= -1;
      }
      ctx.globalAlpha = star.alpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Reset alpha global
    ctx.globalAlpha = 1;

    // Criar cometas aleatórios
    if (Math.random() < cometChance) {
      comets.push({
        x: Math.random() * canvas.width,
        y: -50,
        length: 200,
        speed: 6 + Math.random() * 4,
        angle: Math.PI / 4, // 45°
      });
    }

    // Desenhar cometas
    for (let i = comets.length - 1; i >= 0; i--) {
      let comet = comets[i];
      let dx = Math.cos(comet.angle) * comet.speed;
      let dy = Math.sin(comet.angle) * comet.speed;

      comet.x += dx;
      comet.y += dy;

      // Gradiente do cometa
      let gradient = ctx.createLinearGradient(comet.x, comet.y, comet.x - dx * comet.length, comet.y - dy * comet.length);
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
 /* FIM COMENTINHAAAAAAAAAAAAAS E ESTRELAS */ 



 document.addEventListener("DOMContentLoaded", () => {
  const blackhole = document.getElementById("blackhole");
  const section = document.getElementById("blackhole-section");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        blackhole.classList.add("show");  
      } else {
        blackhole.classList.remove("show"); 
      }
    });
  }, { threshold: 0.3 }); 

  observer.observe(section);
});


 
const eye = document.querySelector(".eye-core");
const container = document.querySelector(".cosmic-eye");


function moveEyeRandomly() {
  const range = 10; // quanto o olho pode se mover
  const offsetX = (Math.random() - 0.5) * 2 * range;
  const offsetY = (Math.random() - 0.5) * 2 * range;

  eye.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;

 
  const delay = 1500 + Math.random() * 2000;
  setTimeout(moveEyeRandomly, delay);
}


moveEyeRandomly();

// redirecionamento
container.addEventListener("click", () => {
  container.style.filter = "brightness(0.8)";
  setTimeout(() => {
    window.location.href = "blackhole.html";
  }, 800);
});
