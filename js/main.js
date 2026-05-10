const app = Vue.createApp({
    mixins: Object.values(mixins),
    data() {
        return {
            loading: true,
            hiddenMenu: false,
            showMenuItems: false,
            menuColor: false,
            scrollTop: 0,
            renderers: [],
            currentMusicIndex: 0,
            musicList: [
                '/music/002.ogg',
                '/music/019.ogg',
                '/music/044.ogg',
                '/music/070.ogg',
                '/music/071.ogg',
                '/music/072.ogg',
                '/music/074.ogg'
            ],
            isPlaying: false
        };
    },
    created() {
        window.addEventListener("load", () => {
            this.loading = false;
        });
    },
    mounted() {
        window.addEventListener("scroll", this.handleScroll, true);
        this.render();
        this.initMusicPlayer();
    },
    methods: {
        render() {
            for (let i of this.renderers) i();
        },
        handleScroll() {
            let wrap = this.$refs.homePostsWrap;
            let newScrollTop = document.documentElement.scrollTop;
            if (this.scrollTop < newScrollTop) {
                this.hiddenMenu = true;
                this.showMenuItems = false;
            } else this.hiddenMenu = false;
            if (wrap) {
                if (newScrollTop <= window.innerHeight - 100) this.menuColor = true;
                else this.menuColor = false;
                if (newScrollTop <= 400) wrap.style.top = "-" + newScrollTop / 5 + "px";
                else wrap.style.top = "-80px";
            }
            this.scrollTop = newScrollTop;
        },
        initMusicPlayer() {
            const audio = document.getElementById('music-audio');
            const prevBtn = document.getElementById('music-prev');
            const nextBtn = document.getElementById('music-next');
            const toggleBtn = document.getElementById('music-toggle');
            const progressBar = document.querySelector('.music-progress-bar');
            const progressFill = document.querySelector('.music-progress-fill');
            const progressThumb = document.querySelector('.music-progress-thumb');
            const currentTimeEl = document.querySelector('.current-time');
            const totalTimeEl = document.querySelector('.total-time');
            
            if (audio) {
                audio.addEventListener('ended', () => {
                    this.playNext();
                });
                
                audio.addEventListener('play', () => {
                    this.isPlaying = true;
                    if (toggleBtn) {
                        toggleBtn.querySelector('i').className = 'fa-solid fa-pause';
                    }
                });
                
                audio.addEventListener('pause', () => {
                    this.isPlaying = false;
                    if (toggleBtn) {
                        toggleBtn.querySelector('i').className = 'fa-solid fa-play';
                    }
                });
                
                audio.addEventListener('loadedmetadata', () => {
                    if (totalTimeEl) {
                        totalTimeEl.textContent = this.formatTime(audio.duration);
                    }
                });
                
                audio.addEventListener('timeupdate', () => {
                    if (currentTimeEl) {
                        currentTimeEl.textContent = this.formatTime(audio.currentTime);
                    }
                    if (progressFill && progressThumb && audio.duration) {
                        const progress = (audio.currentTime / audio.duration) * 100;
                        progressFill.style.width = progress + '%';
                        progressThumb.style.left = progress + '%';
                    }
                });
            }
            
            if (progressBar) {
                progressBar.addEventListener('click', (e) => {
                    if (!audio) return;
                    const rect = progressBar.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    audio.currentTime = percent * audio.duration;
                });
            }
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => this.playPrev());
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => this.playNext());
            }
            
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => this.togglePlay());
            }
        },
        formatTime(seconds) {
            if (isNaN(seconds) || !isFinite(seconds)) {
                return '0:00';
            }
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        },
        playMusic(index) {
            const audio = document.getElementById('music-audio');
            if (audio && index >= 0 && index < this.musicList.length) {
                this.currentMusicIndex = index;
                const source = audio.querySelector('source');
                if (source) {
                    source.src = this.musicList[index];
                    audio.load();
                    audio.play();
                }
            }
        },
        playPrev() {
            let newIndex = this.currentMusicIndex - 1;
            if (newIndex < 0) {
                newIndex = this.musicList.length - 1;
            }
            this.playMusic(newIndex);
        },
        playNext() {
            let newIndex = this.currentMusicIndex + 1;
            if (newIndex >= this.musicList.length) {
                newIndex = 0;
            }
            this.playMusic(newIndex);
        },
        togglePlay() {
            const audio = document.getElementById('music-audio');
            if (audio) {
                if (this.isPlaying) {
                    audio.pause();
                } else {
                    audio.play();
                }
            }
        }
    },
});
app.mount("#layout");
