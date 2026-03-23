fetch("data/repos.json")
    .then(res => res.json())
    .then(repos => {
        const carousel = document.getElementById("carousel");

        // Duplicamos para que haya ancho y efecto bucle
        const circularRepos = [...repos, ...repos, ...repos];

        circularRepos.forEach(repo => {
            const div = document.createElement("div");
            div.className = "repo";

            const screenshot = `https://opengraph.githubassets.com/1/${repo.github.replace("https://github.com/", "")}`;

            div.innerHTML = `
                <img class="thumb" src="${screenshot}" alt="Miniatura de ${repo.name}">
                <h3>${repo.name}</h3>
                <p>${repo.description}</p>

                <div class="buttons">
                    <a class="github" href="${repo.github}" target="_blank">
                        <svg viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.81.06 1.24.83 1.24.83.72 1.23 1.89.88 2.35.67.07-.52.28-.88.5-1.08-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.6 7.6 0 018 4.79c.68.003 1.37.092 2.01.27 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.45.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z"/>
                        </svg>
                        GitHub
                    </a>

                    ${repo.demo ? `
                    <a class="demo" href="${repo.demo}" target="_blank">
                        <svg viewBox="0 0 16 16" fill="currentColor">
                            <path d="M6 2l6 6-6 6V2z"/>
                        </svg>
                        Demo
                    </a>` : ""}
                </div>
            `;

            carousel.appendChild(div);
        });

        requestAnimationFrame(() => {
            carousel.scrollLeft = 0;

            const speed = 1.2; // suficiente para que el navegador lo aplique
            let paused = false;
            let resumeTimeout;

            function autoScroll() {
                if (!paused) {
                    carousel.scrollLeft += speed;

                    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
                    if (carousel.scrollLeft >= maxScroll - 2) {
                        carousel.scrollLeft = 0;
                    }
                }

                requestAnimationFrame(autoScroll);
            }

            function userInteracted() {
                paused = true;
                clearTimeout(resumeTimeout);
                resumeTimeout = setTimeout(() => {
                    paused = false;
                }, 1500);
            }

            // Botones manuales
            document.getElementById("btn-left").onclick = () => {
                userInteracted();
                carousel.scrollBy({ left: -200, behavior: "smooth" });
            };

            document.getElementById("btn-right").onclick = () => {
                userInteracted();
                carousel.scrollBy({ left: 200, behavior: "smooth" });
            };

            // Scroll manual (rueda, touch, arrastre)
            carousel.addEventListener("wheel", userInteracted);
            carousel.addEventListener("mousedown", userInteracted);
            carousel.addEventListener("touchstart", userInteracted);

            autoScroll();
        });
    });
