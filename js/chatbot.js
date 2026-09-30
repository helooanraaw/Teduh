/**
 * TEDUH DIGITAL PLATFORM
 * Berkas: js/chatbot.js
 * Deskripsi: Asisten Cerdas Konsultasi Pohon Peneduh, Cuaca Mikro & Edukasi Lingkungan
 *
 * ==========================================================================
 * SUMBER KARYA & ATRIBUSI MEDIA / ASET VISUAL (OPEN LICENSE):
 * 1. Pustaka & Framework Eksternal:
 *    - GSAP & ScrollTrigger: GreenSock (Standard Web Animation License).
 *    - Lenis Smooth Scroll: Studio Freight / Darkroom Engineering (MIT License).
 *    - Leaflet.js: Vladimir Agafonkin (BSD-2-Clause License).
 * 2. Layanan Peta & Citra Satelit:
 *    - Google Hybrid Satellite Map Tile Server (Google Maps / Earth Engine).
 *    - CartoDB Dark Matter & Voyager Tiles: CartoDB & Kontributor OpenStreetMap (CC BY 3.0 / ODbL).
 * 3. Media Fotografi & Dokumentasi Lapangan (assets/*):
 *    - Unsplash, Pexels, Wikimedia Commons, Freepik (Open License / CC BY-SA 4.0 / Free Commercial Rights).
 * 4. Identitas Grafis & Ilustrasi Digital:
 *    - Aset Vektor Orisinal & Maskot Tim Pengembang Teduh.
 * ==========================================================================
 */

(function () {
  "use strict";

  var knowledgeBase = [
    {
      id: "kenapa_pohon_sejuk",
      keywords: [
        "kenapa sejuk",
        "kenapa dingin",
        "menurunkan suhu",
        "evapotranspirasi",
        "radiasi",
        "kenapa pohon",
        "fungsi pohon",
        "kenapa bisa sejuk",
        "mekanisme",
        "cara kerja pohon",
        "proses sejuk",
        "pendinginan",
        "manfaat pohon",
        "bisa menurunkan suhu",
        "kenapa bisa dingin",
      ],
      answer:
        "Pohon menurunkan suhu lingkungan (sekitar 2°C hingga 5°C) melalui dua proses alami utama 🌱:\n\n1. **Naungan Kanopi Daun** 🍃: Daun rimbun menahan 80–90% radiasi sinar matahari langsung agar tidak diserap dan dipantulkan oleh lantai semen atau aspal.\n2. **Evapotranspirasi Alami** 💧: Daun menguapkan air tanah ke udara sekitar. Proses penguapan ini menyerap panas di udara dan menghasilkan pendinginan nyata layaknya AC alami lingkungan.",
      linkText: null,
      linkUrl: null,
    },
    {
      id: "pohon_cepat_teduh",
      keywords: [
        "rekomendasi pohon",
        "pohon cepat",
        "pilihan bibit",
        "ketapang kencana",
        "pohon tanjung",
        "tabebuia",
        "kiara payung",
        "pohon apa",
        "bibit bagus",
        "paling cepat",
        "bikin teduh",
        "jenis pohon",
        "rekomendasi",
        "pohon terbaik",
        "tanaman peneduh",
      ],
      answer:
        "Berikut 4 pilihan pohon terbaik untuk menyejukkan pekarangan rumah Anda 🌳:\n\n• **Ketapang Kencana** 🌿: Tajuk bertingkat horizontal yang lebar dan rapat, paling cepat memayungi pekarangan teras semen yang gersang.\n• **Pohon Tanjung** 🌸: Daun hijau pekat sepanjang tahun, bunga harum alami, dan sangat efektif menyaring debu polusi.\n• **Tabebuia** 🌼: Tumbuh cepat dengan perakaran bersahabat serta bunga mekar indah saat musim kemarau.\n• **Kiara Payung** ⛱️: Kanopi berbentuk kubah payung alami dengan naungan teduh maksimal untuk jalan gang atau halaman terbuka.",
      linkText: null,
      linkUrl: null,
    },
    {
      id: "kenapa_akar_aman",
      keywords: [
        "akar aman untuk fondasi",
        "aman untuk fondasi",
        "merusak fondasi",
        "akar fondasi",
        "fondasi rumah",
        "akar merusak",
        "akar pipa got",
        "akar aman",
        "akar tunggang",
        "merusak pipa",
        "aman pipa",
        "fondasi aman",
        "apakah akar aman",
        "akar",
        "fondasi",
        "pipa got",
        "tembok retak",
      ],
      answer:
        "Pohon peneduh seperti Tanjung dan Ketapang Kencana memiliki sistem **akar tunggang yang tumbuh dominan vertikal lurus ke dalam tanah** 🛡️, bukan akar papan liar yang melebar horizontal di permukaan (seperti beringin).\n\nKarena perakaran tumbuh mengarah ke dalam, akarnya tidak akan mendesak struktur fondasi rumah maupun menyumbat saluran pipa got warga, asalkan ditanam dengan jarak minimal 1.5 meter dari dinding 🏡.",
      linkText: null,
      linkUrl: null,
    },
    {
      id: "efek_semen_panas",
      keywords: [
        "kenapa aspal panas",
        "kenapa semen panas",
        "aspal panas",
        "semen panas",
        "aspal",
        "semen",
        "urban heat",
        "radiasi matahari",
        "terik",
        "lantai panas",
        "panas lantai",
        "halaman panas",
        "pekarangan semen panas",
        "kenapa lantai panas",
      ],
      answer:
        "Semen dan aspal memiliki massa termal tinggi yang menyerap energi radiasi matahari sepanjang siang ☀️. Suhu permukaannya bisa menembus **45°C–52°C**!\n\nPanas tersimpan ini terus dipancarkan ke dinding rumah hingga larut malam. Menanam pohon peneduh di pekarangan memutus paparan radiasi matahari langsung sehingga suhu lantai tetap dingin dan sejuk di bawah naungan daun 🍃.",
      linkText: null,
      linkUrl: null,
    },
    {
      id: "tanam_di_semen",
      keywords: [
        "tanam di semen",
        "menanam di semen",
        "cara menanam di halaman semen",
        "bongkar semen",
        "halaman semen",
        "pekarangan semen",
        "lubang tanam",
        "lantai semen",
        "sudah disemen",
        "cara tanam di semen",
        "cara tanam",
      ],
      answer:
        "Langkah praktis menanam pohon jika pekarangan rumah Anda sudah terlanjur tertutup semen 🛠️:\n\n1. **Bongkar Semen**: Buat bukaan semen minimal berukuran 80×80 cm (ideal 1×1 meter).\n2. **Gali Tanah**: Gali tanah dasar sedalam 60–80 cm lalu gemburkan tanah di bawahnya.\n3. **Beri Nutrisi**: Campurkan tanah subur dan kompos organik dengan rasio 2:1 🌱.\n4. **Tanam & Siram**: Masukkan bibit, padatkan tanah di sekelilingnya, siram jenuh, dan pasang ajir bambu penyangga.",
      linkText: null,
      linkUrl: null,
    },
    {
      id: "jarak_tanam",
      keywords: [
        "jarak",
        "jarak tanam",
        "jarak dari dinding",
        "jarak dari tembok",
        "jarak rumah",
        "jarak aman",
        "dinding",
        "tanam",
        "kabel",
        "tembok",
        "meter",
        "aturan",
        "selokan",
        "berapa meter",
      ],
      answer:
        "Panduan jarak tanam yang aman dan ideal di pekarangan hunian 📐:\n\n• **Dari Dinding / Tembok Rumah**: Beri jarak minimal 1.5 meter untuk pohon bertajuk sedang, atau 2.5–3 meter untuk pohon bertajuk lebar 🏡.\n• **Dari Pipa / Saluran Got**: Minimal 1.5 meter agar sirkulasi air tanah dan got tetap lancar 💧.\n• **Dari Kabel Listrik Atas**: Pangkas pucuk dahan secara berkala jika tinggi pohon sudah mendekati 4 meter agar aman dari jaringan kabel lingkungan ⚡.",
      linkText: null,
      linkUrl: null,
    },
    {
      id: "cara_cek_suhu",
      keywords: [
        "cek suhu",
        "suhu lingkungan",
        "lihat suhu",
        "radiasi",
        "suhu rumah",
        "derajat",
        "cara cek",
        "peta",
        "titik panas",
        "satelit",
        "cara baca peta",
        "konsol peta",
      ],
      answer:
        "Peta Satelit Termal Teduh mendeteksi suhu radiasi permukaan lingkungan dengan pembagian zona warna 🗺️:\n\n• **Zona Oranye/Merah (34°C–38°C+)** 🔥: Kawasan padat semen dan aspal gersang yang membutuhkan pohon kanopi lebar segera.\n• **Zona Kuning (30°C–33°C)** 🌤️: Pemukiman dengan keteduhan vegetasi sedang.\n• **Zona Hijau Gelap (26°C–29°C)** 🌿: Kawasan sejuk dan asri berkat tutupan pepohonan yang optimal.",
      linkText: null,
      linkUrl: null,
    },
    {
      id: "cuaca_iklim",
      keywords: [
        "cuaca",
        "cuaca terik",
        "cuaca panas",
        "iklim",
        "kemarau",
        "musim kemarau",
        "panas ekstrem",
        "suhu tinggi",
        "pemanasan",
        "panas terik",
        "matahari",
        "panas sekali",
        "musim panas",
        "efek cuaca",
      ],
      answer:
        "Saat cuaca terik ekstrem dan musim kemarau panjang, radiasi matahari langsung meningkatkan suhu permukaan lingkungan hingga 6°C lebih panas ☀️.\n\nSatu pohon peneduh dewasa mampu menghasilkan efek pendinginan mikro setara dengan kerja 10 pendingin ruangan kamar, sekaligus menghemat konsumsi listrik AC dan kipas angin rumah hingga 30% ❄️.",
      linkText: null,
      linkUrl: null,
    },
    {
      id: "perawatan_bibit",
      keywords: [
        "rawat",
        "merawat",
        "siram",
        "menyiram",
        "cara menyiram",
        "penyiraman",
        "pupuk",
        "memupuk",
        "kering",
        "daun rontok",
        "bibit layu",
        "cara rawat",
        "perawatan",
        "pupuk apa",
        "siraman",
      ],
      answer:
        "Tips perawatan awal bibit pohon baru tanam agar tumbuh subur dan rimbun 🌱:\n\n• **Jadwal Siram**: Siram 1–2 kali sehari pada pagi (sebelum jam 09.00) atau sore (setelah jam 16.00). Hindari menyiram saat terik di siang bolong 💧.\n• **Pemupukan**: Berikan kompos atau pupuk organik 1 bulan sekali melingkari tajuk luar 🍃.\n• **Mulsa Alami**: Taburkan serpihan daun kering di atas tanah lingkar tanam untuk menjaga kelembapan tanah.",
      linkText: null,
      linkUrl: null,
    },
    {
      id: "bibit_gratis",
      keywords: [
        "gratis",
        "bibit gratis",
        "poin",
        "hadiah",
        "klaim",
        "tukar",
        "komunitas",
        "dapat bibit",
        "cara dapat",
        "tukar poin",
        "klaim bibit",
        "hadiah bibit",
      ],
      answer:
        "Warga dapat memperoleh bibit pohon gratis dengan mengumpulkan Poin Teduh 🎁:\n\n1. **Dokumentasikan**: Ambil foto aksi penanaman pohon atau penghijauan di lingkungan rumah Anda 📸.\n2. **Bagikan**: Ceritakan aksi tanam ke menu Komunitas Teduh 👥.\n3. **Tukarkan**: Tukarkan poin yang terkumpul dengan bibit Tanjung, Ketapang Kencana, atau pipa resapan biopori di menu Hadiah 🌱.",
      linkText: null,
      linkUrl: null,
    },
    {
      id: "sapaan",
      keywords: [
        "halo",
        "hai",
        "pagi",
        "siang",
        "sore",
        "malam",
        "assalamualaikum",
        "tes",
        "bantuan",
        "menu",
        "teduh bot",
        "bot",
      ],
      answer:
        "Halo! Saya **Teduh Bot** 👋🌿. Senang bisa menyapa Anda! Anda dapat menanyakan apa saja seputar cara pohon menurunkan suhu lingkungan, jenis pohon yang aman untuk fondasi rumah, aturan jarak tanam, atau solusi pekarangan semen panas.\n\nKetik pertanyaan Anda di bawah atau pilih salah satu topik cepat berikut 😊:",
      linkText: null,
      linkUrl: null,
    },
  ];

  var quickTopics = [
    { text: "Kenapa pohon bikin sejuk?", id: "kenapa_pohon_sejuk" },
    { text: "Pohon cepat bikin teduh", id: "pohon_cepat_teduh" },
    { text: "Kenapa akar aman fondasi?", id: "kenapa_akar_aman" },
    { text: "Kenapa pekarangan semen panas?", id: "efek_semen_panas" },
    { text: "Jarak tanam aman rumah", id: "jarak_tanam" },
    { text: "Cara tanam di lantai semen", id: "tanam_di_semen" },
  ];

  document.addEventListener("DOMContentLoaded", function () {
    var fab = document.getElementById("tdChatFab");
    var windowEl = document.getElementById("tdChatWindow");
    var closeBtn = document.getElementById("tdChatClose");
    var chatBody = document.getElementById("tdChatBody");
    var chatForm = document.getElementById("tdChatForm");
    var chatInput = document.getElementById("tdChatInput");
    var tooltip = document.getElementById("tdChatTooltip");
    var mascotHead = document.getElementById("tdMascotHead");
    var mascotReaction = document.getElementById("tdMascotReaction");

    if (!fab || !windowEl || !chatBody) return;

    windowEl.setAttribute("data-lenis-prevent", "true");
    chatBody.setAttribute("data-lenis-prevent", "true");

    chatBody.addEventListener(
      "wheel",
      function (e) {
        e.stopPropagation();
      },
      { passive: true },
    );

    chatBody.addEventListener(
      "touchmove",
      function (e) {
        e.stopPropagation();
      },
      { passive: true },
    );

    var isOpen = false;

    var CLOCKWISE = [
      "right",
      "down-right",
      "down",
      "down-left",
      "left",
      "up-left",
      "up",
      "up-right",
    ];

    var DIRECTION_CELLS = {
      "up-left": "0% 0%",
      up: "50% 0%",
      "up-right": "100% 0%",
      left: "0% 50%",
      center: "50% 50%",
      right: "100% 50%",
      "down-left": "0% 100%",
      down: "50% 100%",
      "down-right": "100% 100%",
    };

    var SECTOR_ANGLE = (Math.PI * 2) / 8;
    var DEAD_ZONE = 60;
    var currentDirection = "center";

    var mascotState = {
      lastMoveTime: Date.now(),
      lastClickTime: 0,
    };

    function applyDirection(dir) {
      if (currentDirection === dir) return;
      currentDirection = dir;
      if (mascotHead) {
        mascotHead.style.backgroundPosition = DIRECTION_CELLS[dir] || "50% 50%";
      }
    }

    function updateMascotAim(clientX, clientY) {
      if (!fab || !mascotHead || isOpen) return;

      var rect = fab.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;

      var dx = clientX - centerX;
      var dy = clientY - centerY;
      var dist = Math.hypot(dx, dy);

      mascotState.lastMoveTime = Date.now();

      if (dist < DEAD_ZONE) {
        applyDirection("center");
        return;
      }

      var angle = Math.atan2(dy, dx);
      var sector = (Math.round(angle / SECTOR_ANGLE) + 8) % 8;
      var targetDir = CLOCKWISE[sector];

      applyDirection(targetDir);
    }

    window.addEventListener(
      "pointermove",
      function (e) {
        updateMascotAim(e.clientX, e.clientY);
      },
      { passive: true },
    );

    window.addEventListener(
      "touchmove",
      function (e) {
        if (e.touches && e.touches.length > 0) {
          updateMascotAim(e.touches[0].clientX, e.touches[0].clientY);
        }
      },
      { passive: true },
    );

    setInterval(function () {
      if (isOpen) return;
      var idleDuration = Date.now() - mascotState.lastMoveTime;
      if (idleDuration > 3800) {
        var idleDirs = ["left", "right", "up", "down-left", "down-right"];
        var randomDir = idleDirs[Math.floor(Math.random() * idleDirs.length)];
        applyDirection(randomDir);
        setTimeout(function () {
          if (Date.now() - mascotState.lastMoveTime > 3800) {
            applyDirection("center");
          }
        }, 900);
      }
    }, 4200);

    var reactionIndex = 0;
    var TOTAL_REACTION_FRAMES = 6;

    function setReactionFrame(idx) {
      reactionIndex =
        ((idx % TOTAL_REACTION_FRAMES) + TOTAL_REACTION_FRAMES) %
        TOTAL_REACTION_FRAMES;
      if (mascotReaction) {
        var percent = reactionIndex * 20;
        mascotReaction.style.backgroundPosition = percent + "% 50%";
      }
    }

    function triggerTactileRipple() {
      if (!fab) return;
      var ripple = document.createElement("div");
      ripple.className = "td-mascot-ripple";
      fab.appendChild(ripple);
      setTimeout(function () {
        if (ripple && ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 460);
    }

    function triggerMascotReaction() {
      var now = Date.now();
      var isRapid = now - mascotState.lastClickTime < 500;
      mascotState.lastClickTime = now;

      setReactionFrame(reactionIndex + 1);

      triggerTactileRipple();

      var targetHead = isOpen ? mascotReaction : mascotReaction || mascotHead;
      if (targetHead) {
        var animClass = isRapid ? "td-mascot-tilt" : "td-mascot-squash";
        targetHead.classList.remove("td-mascot-squash", "td-mascot-tilt");
        void targetHead.offsetWidth;
        targetHead.classList.add(animClass);
        setTimeout(function () {
          if (targetHead) targetHead.classList.remove(animClass);
        }, 420);
      }
      if (mascotHead && !isOpen) {
        mascotHead.classList.remove("td-mascot-squash", "td-mascot-tilt");
        void mascotHead.offsetWidth;
        mascotHead.classList.add("td-mascot-squash");
        setTimeout(function () {
          if (mascotHead) mascotHead.classList.remove("td-mascot-squash");
        }, 420);
      }
    }

    var closeTimeout = null;

    function toggleChat(open) {
      var shouldOpen = typeof open === "boolean" ? open : !isOpen;

      if (shouldOpen) {
        isOpen = true;
        if (closeTimeout) {
          clearTimeout(closeTimeout);
          closeTimeout = null;
        }
        windowEl.classList.remove("closing");
        windowEl.classList.add("active");
        fab.classList.add("active");
        hideTooltip();
        clearTimeout(tooltipTimer);
        setTimeout(function () {
          if (chatInput) chatInput.focus();
        }, 180);
      } else {
        if (!isOpen && !windowEl.classList.contains("active")) return;
        isOpen = false;
        fab.classList.remove("active");
        windowEl.classList.add("closing");

        if (closeTimeout) clearTimeout(closeTimeout);
        closeTimeout = setTimeout(function () {
          windowEl.classList.remove("active");
          windowEl.classList.remove("closing");
          closeTimeout = null;
        }, 250);

        clearTimeout(tooltipTimer);
        tooltipTimer = setTimeout(function () {
          showNextTooltip();
        }, 4000);
      }
    }

    fab.addEventListener("click", function (e) {
      e.stopPropagation();
      triggerMascotReaction();
      toggleChat();
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleChat(false);
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen) {
        toggleChat(false);
      }
    });

    document.addEventListener("click", function (e) {
      if (
        isOpen &&
        windowEl &&
        !windowEl.contains(e.target) &&
        !fab.contains(e.target)
      ) {
        toggleChat(false);
      }
    });

    function getCurrentTimeString() {
      var now = new Date();
      var h = now.getHours();
      var m = now.getMinutes();
      return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
    }

    function scrollToBottom() {
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function appendUserMessage(text) {
      var row = document.createElement("div");
      row.className = "td-msg-row user";

      var content = document.createElement("div");
      content.className = "td-msg-content";

      var bubble = document.createElement("div");
      bubble.className = "td-bubble";
      bubble.textContent = text;

      var time = document.createElement("span");
      time.className = "td-msg-time";
      time.textContent = getCurrentTimeString();

      content.appendChild(bubble);
      content.appendChild(time);

      var avatar = document.createElement("div");
      avatar.className = "td-msg-avatar user-avatar";
      avatar.setAttribute("aria-hidden", "true");
      avatar.innerHTML =
        '<img src="assets/avatars/john-doe.jpg" alt="Foto Profil Pengguna">';

      row.appendChild(content);
      row.appendChild(avatar);

      chatBody.appendChild(row);
      scrollToBottom();
    }

    function appendBotMessage(text, linkText, linkUrl, showChips) {
      var row = document.createElement("div");
      row.className = "td-msg-row bot";

      var avatar = document.createElement("div");
      avatar.className = "td-msg-avatar bot-avatar";
      avatar.setAttribute("aria-hidden", "true");
      avatar.innerHTML = '<img src="assets/bot/teduh-bot.png" alt="Teduh Bot">';

      var content = document.createElement("div");
      content.className = "td-msg-content";

      var bubble = document.createElement("div");
      bubble.className = "td-bubble";

      var paragraphs = text.split("\n\n");
      paragraphs.forEach(function (paraText, pIdx) {
        var p = document.createElement("p");
        p.style.margin =
          pIdx === paragraphs.length - 1 && !linkText && !showChips
            ? "0"
            : "0 0 10px 0";
        p.innerHTML = paraText
          .replace(/\n/g, "<br>")
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        bubble.appendChild(p);
      });

      if (linkText && linkUrl) {
        var link = document.createElement("a");
        link.className = "td-bubble-link-btn";
        link.href = linkUrl;
        link.innerHTML =
          "<span>" +
          linkText +
          "</span>" +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>';
        bubble.appendChild(link);
      }

      if (showChips) {
        var chipsContainer = document.createElement("div");
        chipsContainer.className = "td-chat-chips";
        quickTopics.forEach(function (topic) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "td-chip-btn";
          btn.textContent = topic.text;
          btn.setAttribute("data-topic-id", topic.id);
          btn.addEventListener("click", function () {
            handleTopicClick(topic.id, topic.text);
          });
          chipsContainer.appendChild(btn);
        });
        bubble.appendChild(chipsContainer);
      }

      var time = document.createElement("span");
      time.className = "td-msg-time";
      time.textContent = getCurrentTimeString();

      content.appendChild(bubble);
      content.appendChild(time);

      row.appendChild(avatar);
      row.appendChild(content);

      chatBody.appendChild(row);
      scrollToBottom();
    }

    function showTypingIndicator() {
      var row = document.createElement("div");
      row.className = "td-msg-row bot";
      row.id = "tdTypingIndicator";

      var avatar = document.createElement("div");
      avatar.className = "td-msg-avatar bot-avatar";
      avatar.setAttribute("aria-hidden", "true");
      avatar.innerHTML = '<img src="assets/bot/teduh-bot.png" alt="Teduh Bot">';

      var content = document.createElement("div");
      content.className = "td-msg-content";

      var bubble = document.createElement("div");
      bubble.className = "td-typing-indicator";
      bubble.innerHTML =
        '<span class="td-typing-dot"></span><span class="td-typing-dot"></span><span class="td-typing-dot"></span>';

      content.appendChild(bubble);
      row.appendChild(avatar);
      row.appendChild(content);

      chatBody.appendChild(row);
      scrollToBottom();
    }

    function removeTypingIndicator() {
      var el = document.getElementById("tdTypingIndicator");
      if (el) el.remove();
    }

    function replyWithBot(text, linkText, linkUrl, showChips) {
      showTypingIndicator();
      setTimeout(function () {
        removeTypingIndicator();
        appendBotMessage(text, linkText, linkUrl, showChips);
      }, 680);
    }

    function handleTopicClick(topicId, topicText) {
      appendUserMessage(topicText);
      var item = knowledgeBase.find(function (kb) {
        return kb.id === topicId;
      });
      if (item) {
        replyWithBot(item.answer, item.linkText, item.linkUrl, false);
      }
    }

    function findAnswer(query) {
      var lowerQuery = query.toLowerCase().trim();
      var bestItem = null;
      var bestScore = 0;

      for (var i = 0; i < knowledgeBase.length; i++) {
        var item = knowledgeBase[i];
        var score = 0;

        for (var k = 0; k < item.keywords.length; k++) {
          var kw = item.keywords[k].toLowerCase();
          if (lowerQuery.indexOf(kw) !== -1) {
            score += kw.length * kw.length;
          }
        }

        if (score > bestScore) {
          bestScore = score;
          bestItem = item;
        }
      }

      return bestScore > 0 ? bestItem : null;
    }

    if (chatForm && chatInput) {
      chatForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var message = chatInput.value.trim();
        if (!message) return;

        appendUserMessage(message);
        chatInput.value = "";

        var found = findAnswer(message);
        if (found) {
          replyWithBot(found.answer, found.linkText, found.linkUrl, false);
        } else {
          replyWithBot(
            'Saya siap membantu menjelaskan alasan ilmiah kenapa pohon menyejukkan suhu, rekomendasi bibit aman fondasi, aturan jarak tanam, serta penanganan lantai semen panas 🌱✨.\n\nCoba tanyakan dengan kata kunci seperti *"kenapa sejuk"*, *"pohon apa"*, *"akar pipa"*, atau pilih salah satu topik cepat di bawah:',
            null,
            null,
            true,
          );
        }
      });
    }

    var TOOLTIP_MESSAGES = [
      "Tanyakan Teduh Bot! 😉",
      "Halo! Ada yang bisa saya bantu? 😊",
      "Tanya seputar pohon & suhu di sini! 🌿",
      "Butuh rekomendasi pohon teduh? 🌳",
    ];
    var currentTooltipIndex = 0;
    var tooltipTimer = null;

    function hideTooltip() {
      if (!tooltip) return;
      tooltip.classList.remove("visible");
    }

    function showNextTooltip() {
      if (!tooltip || isOpen) return;
      currentTooltipIndex = (currentTooltipIndex + 1) % TOOLTIP_MESSAGES.length;
      tooltip.textContent = TOOLTIP_MESSAGES[currentTooltipIndex];
      tooltip.classList.add("visible");

      clearTimeout(tooltipTimer);
      tooltipTimer = setTimeout(function () {
        hideTooltip();
        tooltipTimer = setTimeout(function () {
          showNextTooltip();
        }, 6500);
      }, 5500);
    }

    tooltipTimer = setTimeout(function () {
      if (!isOpen && tooltip) {
        tooltip.textContent = TOOLTIP_MESSAGES[0];
        tooltip.classList.add("visible");
        tooltipTimer = setTimeout(function () {
          hideTooltip();
          tooltipTimer = setTimeout(function () {
            showNextTooltip();
          }, 6500);
        }, 5500);
      }
    }, 1800);

    if (tooltip) {
      tooltip.addEventListener("click", function (e) {
        e.stopPropagation();
        hideTooltip();
        clearTimeout(tooltipTimer);
        toggleChat(true);
      });
    }

    var initialChips = chatBody.querySelectorAll(".td-chip-btn");
    initialChips.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var topicId = btn.getAttribute("data-topic-id");
        var topicText = btn.textContent;
        handleTopicClick(topicId, topicText);
      });
    });
  });
})();
