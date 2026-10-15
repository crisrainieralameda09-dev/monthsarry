const memories = [
  {
    title: "My favorite kind of ordinary",
    note: "It doesn't have to be a big adventure. If I'm beside you, even a regular day turns into a favorite memory.",
    affirmation: "You make the everyday feel like something special.",
    photos: [
      "pictures/06907e89-92db-443d-b212-c712716ef227.jpg",
      "pictures/3a733ac9-773e-4b44-91de-c41d70f50296.jpg",
    ],
    alts: ["Smiling together over a meal", "A close-up selfie together outdoors"],
  },
  {
    title: "A little closer, every day",
    note: "Some of my happiest moments are the simple ones: being close, sharing a smile, and knowing we're right where we're meant to be.",
    affirmation: "Your love feels like my favorite place to come home to.",
    photos: [
      "pictures/627120ea-01a9-47b2-87ca-f22caf4903c9.jpg",
      "pictures/78a99089-519f-4363-9487-8a4b262acbff.jpg",
    ],
    alts: ["A bright selfie together outdoors", "A playful selfie together at home"],
  },
  {
    title: "The moments that make me smile",
    note: "The silly faces, the little laughs, the way we can be completely ourselves. I wouldn't trade these moments for anything.",
    affirmation: "You are still the person who makes me smile the easiest.",
    photos: [
      "pictures/97023c00-8fcd-46ce-b364-95a69c801e7a.jpg",
      "pictures/9e366712-3126-4a09-b5e2-96d7cf9e6e12.jpg",
    ],
    alts: ["Sharing a kiss and a smile in a selfie", "Making silly faces together for a photo"],
  },
  {
    title: "My favorite teammate",
    note: "Through every season and every version of us, I'm grateful to have you beside me. We're better at this life together.",
    affirmation: "I believe in you, I'm proud of you, and I'm always on your side.",
    photos: [
      "pictures/b534619b-f2e3-4a52-83c8-1dca2bcf7612.jpg",
      "pictures/bd87f6ef-1b9f-4a7f-b119-c49219693c34.jpg",
    ],
    alts: ["A playful close-up selfie together", "Smiling together on an afternoon out"],
  },
  {
    title: "And still, my person",
    note: "Forty-seven months in, my answer is still you. Thank you for every memory we've made and for all the ones waiting for us.",
    affirmation: "I choose you, I cherish you, and I'm so glad we're us.",
    photos: [
      "pictures/d1e7ff7f-7666-4e23-97e2-f1dc775c88e0.jpg",
      "pictures/fdaec466-4835-4342-b82a-4caa5b5a80c2.jpg",
    ],
    alts: ["A happy selfie together at home", "A close and cozy selfie together"],
  },
];

const memoryList = document.querySelector("#memory-list");

for (const [index, memory] of memories.entries()) {
  const chapter = document.createElement("article");
  chapter.className = "memory-chapter reveal";
  chapter.innerHTML = `
    <div class="memory-photos">
      <img class="memory-photo memory-photo-one" src="${memory.photos[0]}" alt="${memory.alts[0]}" loading="lazy" />
      <img class="memory-photo memory-photo-two" src="${memory.photos[1]}" alt="${memory.alts[1]}" loading="lazy" />
    </div>
    <div class="memory-copy">
      <span class="chapter-number">little moment ${String(index + 1).padStart(2, "0")}</span>
      <h3>${memory.title}</h3>
      <p>${memory.note}</p>
      <div class="affirmation"><span aria-hidden="true">♥</span><span>${memory.affirmation}</span></div>
    </div>
  `;
  memoryList.append(chapter);
}

const revealElements = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.16 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const progressBar = document.querySelector("#progress-bar");

function updateScrollProgress() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

const song = document.querySelector("#our-song");
const musicPlayer = document.querySelector(".music-player");
const musicToggle = document.querySelector("#music-toggle");
const musicStatus = document.querySelector("#music-status");

function updateMusicPlayingState() {
  musicPlayer.classList.add("is-playing");
  musicToggle.setAttribute("aria-label", "Pause Ngiti by The Juans");
  musicToggle.setAttribute("aria-pressed", "true");
  musicStatus.textContent = "playing";
}

function updateMusicPausedState(status) {
  musicPlayer.classList.remove("is-playing");
  musicToggle.setAttribute("aria-label", "Play Ngiti by The Juans");
  musicToggle.setAttribute("aria-pressed", "false");
  musicStatus.textContent = status;
}

let waitingForAutoplayGesture = false;

async function startSong() {
  try {
    await song.play();
    waitingForAutoplayGesture = false;
    updateMusicPlayingState();
  } catch (error) {
    if (error.name === "NotAllowedError") {
      musicStatus.textContent = "tap anywhere to start the music";
      if (!waitingForAutoplayGesture) {
        waitingForAutoplayGesture = true;
        document.addEventListener("pointerdown", resumeSongAfterGesture);
        document.addEventListener("keydown", resumeSongAfterGesture);
      }
      return;
    }

    musicStatus.textContent = "Couldn't play the song. Check that the audio file is available.";
    console.error("Unable to play the anniversary song:", error);
  }
}

function resumeSongAfterGesture(event) {
  if (event.type === "keydown" && event.repeat) {
    return;
  }

  if (event.target.closest?.("#music-toggle")) {
    return;
  }

  document.removeEventListener("pointerdown", resumeSongAfterGesture);
  document.removeEventListener("keydown", resumeSongAfterGesture);
  startSong();
}

musicToggle.addEventListener("click", async () => {
  if (song.paused) {
    document.removeEventListener("pointerdown", resumeSongAfterGesture);
    document.removeEventListener("keydown", resumeSongAfterGesture);
    waitingForAutoplayGesture = false;
    await startSong();
  } else {
    song.pause();
    updateMusicPausedState("paused");
  }
});

song.addEventListener("ended", () => {
  updateMusicPausedState("tap to play");
});

startSong();

const letterButton = document.querySelector("#letter-button");
const loveLetter = document.querySelector("#love-letter");

letterButton.addEventListener("click", () => {
  const isExpanded = letterButton.getAttribute("aria-expanded") === "true";
  letterButton.setAttribute("aria-expanded", String(!isExpanded));
  loveLetter.hidden = isExpanded;
  letterButton.innerHTML = isExpanded
    ? 'Open my heart <span aria-hidden="true">♥</span>'
    : 'Close my heart <span aria-hidden="true">♡</span>';

  if (!isExpanded) {
    loveLetter.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "nearest" });
  }
});

const photoDialog = document.querySelector("#photo-dialog");
const photoDialogImage = document.querySelector("#photo-dialog-image");
const photoDialogCaption = document.querySelector("#photo-dialog-caption");
const photoDialogClose = document.querySelector("#photo-dialog-close");
let activePhotoTrigger = null;

document.querySelectorAll(".hero-photo, .memory-photo").forEach((photo) => {
  photo.setAttribute("role", "button");
  photo.setAttribute("tabindex", "0");
  photo.setAttribute("aria-label", `View larger: ${photo.alt}`);
  photo.title = "Click to view this photo";

  const openPhotoPreview = () => {
    activePhotoTrigger = photo;
    photoDialogImage.src = photo.currentSrc || photo.src;
    photoDialogImage.alt = photo.alt;
    photoDialogCaption.textContent = photo.alt;
    photoDialog.showModal();
  };

  photo.addEventListener("click", () => {
    openPhotoPreview();
  });

  photo.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPhotoPreview();
    }
  });
});

photoDialogClose.addEventListener("click", () => photoDialog.close());

photoDialog.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    photoDialog.close();
  }
});

photoDialog.addEventListener("click", (event) => {
  if (event.target === photoDialog) {
    photoDialog.close();
  }
});

photoDialog.addEventListener("close", () => {
  photoDialogImage.removeAttribute("src");
  activePhotoTrigger?.focus();
  activePhotoTrigger = null;
});
