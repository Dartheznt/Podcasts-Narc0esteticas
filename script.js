(function IIFE() {
  const list = [
    {
      id: 1,
      url:
        "https://ia600300.us.archive.org/12/items/bocanada-podcast/Bocanada%20Podcast.mp3",
      author: "Intros del Patrón",
      title: "Bocanada",
      cover:
        "https://i.postimg.cc/hv6JM5sL/Bocanada.png"
    },
    {
      id: 2,
      url:
        "https://ia600305.us.archive.org/25/items/desenredando-el-narco/Desenredando%20el%20narco.mp3",
      author: "Narcocultura en Colombia",
      title: "Desenredando el narco",
      cover:
        "https://i.postimg.cc/1t4jSXx5/Desenredando-elnarco.png"
    },
    {
      id: 3,
      url:
        "https://ia902803.us.archive.org/16/items/la-madrina-poder-y-violencia-en-el-mundo-del-narcotrafico/La%20madrina_Poder%20y%20violencia%20en%20el%20mundo%20del%20narcotr%C3%A1fico.mp3",
      author: "La madrina",
      title: "Podcast",
      cover:
        "https://i.postimg.cc/htdCp6Lv/La-madrina.png"
    },
    {
      id: 4,
      url:
        "https://ia600206.us.archive.org/4/items/lenguas-picadas-el-mafioso-adolescente/Lenguas%20picadas%2C%20_El%20mafioso%20adolescente.mp3",
      author: "El mafioso adolescente",
      title: "Lenguas picadas",
      cover:
        "https://i.postimg.cc/SxnWr9pH/Lenguas-picadas.png"
    },
    {
      id: 5,
      url:
      "https://ia902803.us.archive.org/6/items/literatura-para-todos/Literatura%20para%20todos.mp3",
      author: "En diálogo con nuestro pequeño narco",
      title: "Literatura para todos",
      cover:
        "https://i.postimg.cc/655N3dkV/Tochtli.png"
    },
    {
      id: 6,
      url:
       "https://ia902800.us.archive.org/22/items/narrativas-cruzadas/Narrativas%20cruzadas.mp3",
         author: "Narrativas del narco",
      title: "Narrativas cruzadas",
      cover:
        "https://i.postimg.cc/Z5tFHcJ7/Narrativas-cruzadas.png"
    },
    {
      id: 7,
      url:
        "https://ia600206.us.archive.org/33/items/podcast-metastasis-breaking-bad/Podcast%20Metastasis-Breaking%20Bad.mp3",
      author: "Metástasis",
      title: "Los pepes",
      cover:
        "https://i.postimg.cc/Tw8kD6pV/Los-pepes.png"
    },
    {
      id: 8,
      url:
       "https://ia601608.us.archive.org/32/items/sin-nombre_202602/Sin%20nombre.mp3",
      author: "Karina García",
      title: "Sin nombre",
      cover:
        "https://i.postimg.cc/1XgqHxkN/Karina-Garcia.png"
    }
  ];

  let currentId = 0;
  let isPlaying = false;
  let isLoop = true;
  let isShuffle = false;
  let currentAudio = "music1";
  let timer = null;
  let loopOne = false;

  const currentTimeIndicator = document.querySelector(".music-time__current");
  const leftTimeIndicator = document.querySelector(".music-time__last");
  const progressBar = document.getElementById("length");
  const playBtn = document.querySelector(".play");
  const cover = document.querySelector(".cover");
  const title = document.querySelector(".music-player__title");
  const author = document.querySelector(".music-player__author");
  const trackSelector = document.getElementById("trackSelector");

  const loopBtn = document.getElementById("loop");
  const shuffleBtn = document.getElementById("shuffle");
  const forwardBtn = document.getElementById("forward");
  const backwardBtn = document.getElementById("backward");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const progressDiv = document.getElementById("progress");
  const wrapperDisplay = document.querySelector(".wrapper");
  const pageLoader = document.querySelector(".loader");
  const container = document.querySelector(".c-containter");
  const alreadyVisited = sessionStorage.getItem("visited");

  

 function whenImageLoaded(img) {
  // mostrar loader
  wrapperDisplay.style.display = "flex";

  // preparar fade
  img.style.visibility = "hidden";
  img.style.opacity = "0";
  img.style.transition = "opacity 0.5s ease-out";

  // limpiar listeners anteriores
  img.onload = null;
  img.onerror = null;

  img.onload = () => {
    wrapperDisplay.style.display = "none";

    img.style.visibility = "visible";

    // forzar reflow para que el fade funcione
    img.offsetHeight;

    img.style.opacity = "1";
  };

  img.onerror = () => {
    wrapperDisplay.style.display = "none";
    img.style.visibility = "visible";
    img.style.opacity = "1";
  };
}





  function play(e) {
    if (!isPlaying) {
      // console.log('play');
      e.target.src =
        "https://snowleo208.github.io/100-Days-of-Code/7.%20Music%20Player/img/pause.svg";
      e.target.alt = "Pause";
      isPlaying = true;
      document.getElementById(currentAudio).play();
      showTime();
    } else {
      // console.log('pause');
      e.target.src =
        "https://snowleo208.github.io/100-Days-of-Code/7.%20Music%20Player/img/play.svg";
      e.target.alt = "Play";
      document.getElementById(currentAudio).pause();
      isPlaying = false;
      clearInterval(timer);
    }
  }

  function buildTrackMenu() {

  trackSelector.innerHTML = "";

  list.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${item.title} — ${item.author}`;
    trackSelector.appendChild(option);
  });

  trackSelector.value = currentId;
    }
    
    trackSelector.addEventListener("change", e => {
  currentId = Number(e.target.value);

  document.getElementById(currentAudio).pause();
  isPlaying = false;
  clearInterval(timer);

  playBtn.src =
    "https://snowleo208.github.io/100-Days-of-Code/7.%20Music%20Player/img/play.svg";
  playBtn.alt = "Play";

  init();
});

  function changeBar() {
    const audio = document.getElementById(currentAudio);
    const percentage = (audio.currentTime / audio.duration).toFixed(3);
    progressBar.style.transition = "";
    // console.log(audio.currentTime);

    //set current time
    const minute = Math.floor(audio.currentTime / 60);
    const second = Math.floor(audio.currentTime % 60);
    const leftTime = audio.duration - audio.currentTime;
    currentTimeIndicator.innerHTML =
      ("0" + minute).substr(-2) + ":" + ("0" + second).substr(-2);

    //set left time
    const leftMinute = Math.floor(leftTime / 60);
    const leftSecond = Math.floor(leftTime % 60);

    leftTimeIndicator.innerHTML =
      ("0" + leftMinute).substr(-2) + ":" + ("0" + leftSecond).substr(-2);

    //set time bar
    progressBar.style.width = percentage * 100 + "%";
  }

  function showTime() {
    timer = setInterval(() => changeBar(), 500);
  }

 function nextMusic(mode) {
  playBtn.src =
    "https://snowleo208.github.io/100-Days-of-Code/7.%20Music%20Player/img/play.svg";
  playBtn.alt = "Play";

  document.getElementById(currentAudio).pause();
  isPlaying = false;
  clearInterval(timer);

  if (isShuffle) {
    let newId;
    do {
      newId = Math.floor(Math.random() * list.length);
    } while (newId === currentId);

    currentId = newId;
  } else {
    if (mode === "next") {
      currentId = currentId + 1 >= list.length ? 0 : currentId + 1;
    } else {
      currentId = currentId - 1 < 0 ? list.length - 1 : currentId - 1;
    }
  }

  init();
}

  function shuffle(e) {
    isShuffle = !isShuffle;
    if (isShuffle) {
      e.target.parentNode.classList.add("is-loop");
    } else {
      e.target.parentNode.classList.remove("is-loop");
    }
  }

  function backward() {
    const audio = document.getElementById(currentAudio);
    audio.currentTime -= 5;
    if (!isPlaying) {
      changeBar();
    }
  }

  function forward() {
    const audio = document.getElementById(currentAudio);
    audio.currentTime += 5;
    if (!isPlaying) {
      changeBar();
    }
  }

  function stopMusic() {
    playBtn.src =
      "https://snowleo208.github.io/100-Days-of-Code/7.%20Music%20Player/img/play.svg";
    playBtn.alt = "Play";
    isPlaying = false;
  }

  function goToNextMusic() {
  if (isShuffle && !loopOne) {
    let newId;
    do {
      newId = Math.floor(Math.random() * list.length);
    } while (newId === currentId);

    currentId = newId;
  } else if (!loopOne) {
    currentId = currentId + 1 >= list.length ? 0 : currentId + 1;
  }

  init();
  document.getElementById(currentAudio).play();
}

  function loop(e) {
    const audio = document.getElementById(currentAudio);

    if (!isLoop && !loopOne) {
      isLoop = true;
      loopOne = false;
      // console.log('is loop');
      e.target.parentNode.classList.add("is-loop");
      e.target.src =
        "https://snowleo208.github.io/100-Days-of-Code/7.%20Music%20Player/img/loop.svg";
      audio.loop = false;
      audio.onended = e => goToNextMusic();
      console.log(isLoop, loopOne);
    } else if (isLoop && !loopOne) {
      // console.log('is loop one');
      isLoop = true;
      loopOne = true;
      e.target.parentNode.classList.add("is-loop");
      e.target.src =
        "https://snowleo208.github.io/100-Days-of-Code/7.%20Music%20Player/img/loopone.svg";
      audio.loop = true;
      audio.onended = e => goToNextMusic();
      console.log(isLoop, loopOne);
    } else {
      // console.log('not loop');
      isLoop = false;
      loopOne = false;
      e.target.parentNode.classList.remove("is-loop");
      e.target.src =
        "https://snowleo208.github.io/100-Days-of-Code/7.%20Music%20Player/img/loop.svg";
      audio.loop = false;
      audio.onended = e => stopMusic();
      console.log(isLoop, loopOne);
    }
  }

  function progress(e) {
    const audio = document.getElementById(currentAudio);
    //get current position and minus progress bar's x position to get current position in progress bar
    const pos =
      (e.pageX - progressDiv.getClientRects()[0].x) /
      progressDiv.getClientRects()[0].width;
    audio.currentTime = pos * audio.duration;
    changeBar();
  }

  buildTrackMenu();

  function init() {
    //reset music duration and setup audio
    const audio =
      document.getElementById(currentAudio) === null
        ? new Audio()
        : document.getElementById(currentAudio);
    audio.src = list[currentId].url;
    audio.id = currentAudio;
    document.getElementById(currentAudio) === null
      ? document.body.appendChild(audio)
      : "";

    progressBar.style.transition = "none";
    progressBar.style.width = "0%";
    document.getElementById(currentAudio).currentTime = 0;

    title.innerHTML = list[currentId].title;
    author.innerHTML = list[currentId].author;
    whenImageLoaded(cover);
    cover.src = list[currentId].cover;

    //set current time
    audio.addEventListener("loadedmetadata", function() {
      const leftMinute = Math.floor(audio.duration / 60);
      const leftSecond = Math.floor(audio.duration % 60);
      currentTimeIndicator.innerHTML = "00:00";
      leftTimeIndicator.innerHTML =
        ("0" + leftMinute).substr(-2) + ":" + ("0" + leftSecond).substr(-2);
      progressBar.style.transition = "";
    });

    //set loop
    document.getElementById(currentAudio).onended = e => goToNextMusic(e);
    trackSelector.value = currentId;
  }

  playBtn.addEventListener("click", play);
  loopBtn.addEventListener("click", loop);

  shuffleBtn.addEventListener("click", shuffle);
  forwardBtn.addEventListener("click", forward);
  backwardBtn.addEventListener("click", backward);

  prevBtn.addEventListener("click", e => nextMusic("prev"));
  nextBtn.addEventListener("click", e => nextMusic("next"));
  progressDiv.addEventListener("click", e => {
    progress(e);
  });


if (!alreadyVisited && pageLoader) {

  pageLoader.style.display = "flex";
  pageLoader.style.opacity = "1";
  pageLoader.style.pointerEvents = "all";

  sessionStorage.setItem("visited", "true");

  setTimeout(() => {
    pageLoader.style.opacity = "0";
    pageLoader.style.pointerEvents = "none";

    setTimeout(() => {
      pageLoader.style.display = "none";
      container.style.opacity = "1";
    }, 600);
  }, 5000);

} else {
  if (pageLoader) pageLoader.style.display = "none";
  container.style.opacity = "1";
}


  init();
})();