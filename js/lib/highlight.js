mixins.highlight = {
    data() {
        return { copying: false };
    },
    created() {
        hljs.configure({ ignoreUnescapedHTML: true });
        this.renderers.push(this.highlight);
    },
    methods: {
        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        highlight() {
            let codes = document.querySelectorAll("pre");
            for (let i of codes) {
                if (i.querySelector("table") || i.querySelector(".code-content")) {
                    continue;
                }
                let codeElement = i.querySelector("code");
                let code = codeElement ? codeElement.textContent || codeElement.innerText : i.textContent || i.innerText;
                let language = "plaintext";
                let classList = codeElement ? [...codeElement.classList] : [...i.classList];
                for (let cls of classList) {
                    if (cls.startsWith("language-")) {
                        language = cls.replace("language-", "");
                        break;
                    } else if (cls.startsWith("lang-")) {
                        language = cls.replace("lang-", "");
                        break;
                    }
                }
                let highlighted;
                try {
                    highlighted = hljs.highlight(code, { language }).value;
                } catch {
                    highlighted = code;
                }
                let highlightedLines = highlighted.split('\n');
                let htmlLines = highlightedLines.map((line, idx) => {
                    return `<div class="code-line"><span class="line-number">${idx + 1}</span><span class="line-content">${line || ' '}</span></div>`;
                }).join('\n');
                i.innerHTML = `
                <div class="code-content hljs">${htmlLines}</div>
                <div class="language">${language}</div>
                <div class="copycode">
                    <i class="fa-solid fa-copy fa-fw"></i>
                    <i class="fa-solid fa-check fa-fw"></i>
                </div>
                `;
                let content = i.querySelector(".code-content");
                hljs.lineNumbersBlock(content, { singleLine: true });
                let copycode = i.querySelector(".copycode");
                copycode.addEventListener("click", async () => {
                    if (this.copying) return;
                    this.copying = true;
                    copycode.classList.add("copied");
                    await navigator.clipboard.writeText(code);
                    await this.sleep(1000);
                    copycode.classList.remove("copied");
                    this.copying = false;
                });
            }
        },
    },
};
