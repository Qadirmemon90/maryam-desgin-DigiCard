const DEFAULT_PROFILE = {
  brandName: "Boutique Maryam",
  username: "boutiquemaryam.pk",
  logoUrl: "assets/logo.png",
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
  whatsapp: "https://wa.me/923000000000",
  tiktok: "https://www.tiktok.com/",
  pinterest: "https://www.pinterest.com/",
  website: "https://boutiquemaryam.pk/",
  themeBg: "#ffffff",
  pageBg: "#faf9fb",
  buttonBg: "#ffffff",
  textColor: "#0f0f14"
};

const DEFAULT_LINKS = [
  { title: "Luxury Pret Collection", url: "#", image: "assets/logo.png", icon: "🛍️", badge: "New", active: true, featured: true, order: 1, description: "Handcrafted luxury ready-to-wear silhouettes designed with fine fabrics and artisanal detailing." },
  { title: "Unstitched Lawn | Festive Edit", url: "#", image: "assets/logo.png", icon: "🌸", badge: "Festive", active: true, featured: false, order: 2, description: "Delicate digital prints, airy lawn textures, and pure chiffon dupattas for seasonal celebrations." },
  { title: "Ready To Wear | Daily Glam", url: "#", image: "assets/logo.png", icon: "✨", badge: "Trending", active: true, featured: false, order: 3, description: "Effortless casual chic pieces designed for modern daily styling and breathable comfort." },
  { title: "Jewelry & Statement Accessories", url: "#", image: "assets/logo.png", icon: "💎", badge: "Hot", active: true, featured: false, order: 4, description: "Curated heirloom-quality jewelry and embellishments to complete your festive ensemble." }
];

(function () {
  firebase.initializeApp(window.firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(console.error);

  document.addEventListener("DOMContentLoaded", function () {
    const els = {
      loginScreen: document.getElementById("loginScreen"),
      adminScreen: document.getElementById("adminScreen"),
      email: document.getElementById("email"),
      password: document.getElementById("password"),
      togglePasswordBtn: document.getElementById("togglePasswordBtn"),
      loginBtn: document.getElementById("loginBtn"),
      loginBtnText: document.getElementById("loginBtnText"),
      logoutBtn: document.getElementById("logoutBtn"),
      loginMsg: document.getElementById("loginMsg"),
      globalMsg: document.getElementById("globalMsg"),
      adminUserText: document.getElementById("adminUserText"),
      adminPanelEyebrow: document.getElementById("adminPanelEyebrow"),
      adminPanelTitle: document.getElementById("adminPanelTitle"),
      saveProfileBtn: document.getElementById("saveProfileBtn"),
      addLinkBtn: document.getElementById("addLinkBtn"),
      seedBtn: document.getElementById("seedBtn"),
      profileForm: document.getElementById("profileForm"),
      logoUrlInput: document.getElementById("logoUrlInput"),
      profileLogoFile: document.getElementById("profileLogoFile"),
      uploadProfileLogoBtn: document.getElementById("uploadProfileLogoBtn"),
      cloudinaryStatus: document.getElementById("cloudinaryStatus"),
      cloudinaryHelp: document.getElementById("cloudinaryHelp"),
      draftArea: document.getElementById("draftArea"),
      linksAdmin: document.getElementById("linksAdmin")
    };

    let currentLinks = [];
    const expandedCards = new Set();
    let unsubProfile = null;
    let unsubLinks = null;

    const PANEL_META = {
      collectionsSection: { eyebrow: "Collections", title: "Manage Boutique Links", showAdd: true },
      profileSection: { eyebrow: "Profile", title: "Profile & Visual Identity", showAdd: false },
      overviewSection: { eyebrow: "Cloudinary", title: "Media Upload Hub", showAdd: false }
    };

    function escapeHtml(str) {
      return String(str || "").replace(/[&<>"']/g, function (m) {
        return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m];
      });
    }

    function authError(error) {
      const code = error && error.code ? error.code : "";
      if (code === "auth/invalid-login-credentials" || code === "auth/wrong-password" || code === "auth/user-not-found" || code === "auth/invalid-credential") {
        return "Invalid email or password. Please verify your admin account credentials in Firebase Authentication.";
      }
      if (code === "auth/operation-not-allowed") return "Email/Password sign-in provider is not enabled in Firebase Authentication console.";
      if (code === "auth/invalid-email") return "Please enter a valid email address.";
      if (code === "auth/too-many-requests") return "Too many unsuccessful login attempts. Please wait a few moments and try again.";
      return error.message || "Authentication failed.";
    }

    function showLoginError(message) {
      els.loginMsg.textContent = message;
      els.loginMsg.classList.remove("hidden");
    }

    function hideLoginError() {
      els.loginMsg.textContent = "";
      els.loginMsg.classList.add("hidden");
    }

    function showGlobal(message, isError) {
      if (!els.globalMsg) return;
      els.globalMsg.textContent = message;
      els.globalMsg.className = "mb-4 status-box " + (isError ? "status-error" : "status-info");
      els.globalMsg.classList.remove("hidden");
      els.globalMsg.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setTimeout(function () { els.globalMsg.classList.add("hidden"); }, 5500);
    }

    function switchPanel(panelId) {
      const panels = Array.from(document.querySelectorAll(".admin-panel"));
      const links = Array.from(document.querySelectorAll("[data-panel-link]"));
      const activeId = PANEL_META[panelId] ? panelId : "collectionsSection";
      const meta = PANEL_META[activeId];

      panels.forEach(function (panel) {
        panel.classList.toggle("is-active", panel.id === activeId);
      });
      links.forEach(function (link) {
        link.classList.toggle("is-active", link.dataset.panelLink === activeId);
      });

      if (els.adminPanelEyebrow) els.adminPanelEyebrow.textContent = meta.eyebrow;
      if (els.adminPanelTitle) els.adminPanelTitle.textContent = meta.title;
      if (els.addLinkBtn) els.addLinkBtn.classList.toggle("hidden", !meta.showAdd);
    }

    function cloudinaryReady() {
      return window.cloudinaryConfig &&
        window.cloudinaryConfig.cloudName &&
        window.cloudinaryConfig.uploadPreset &&
        !window.cloudinaryConfig.cloudName.includes("PASTE_") &&
        !window.cloudinaryConfig.uploadPreset.includes("PASTE_");
    }

    function updateCloudinaryStatus() {
      if (!els.cloudinaryStatus || !els.cloudinaryHelp) return;
      if (cloudinaryReady()) {
        els.cloudinaryStatus.textContent = "Connected & Ready";
        els.cloudinaryStatus.className = "admin-chip admin-chip-live";
        els.cloudinaryHelp.textContent = "Cloudinary integration is active. Images upload directly to folder '" + (window.cloudinaryConfig.folder || "boutique") + "'.";
      } else {
        els.cloudinaryStatus.textContent = "Cloud Name Missing";
        els.cloudinaryStatus.className = "admin-chip admin-chip-muted";
        els.cloudinaryHelp.textContent = "To enable cloud uploads, paste your Cloudinary cloudName into js/cloudinary-config.js.";
      }
    }

    async function uploadToCloudinary(file) {
      if (!cloudinaryReady()) {
        throw new Error("Cloudinary Cloud Name is missing. Please set cloudName in js/cloudinary-config.js.");
      }

      const cfg = window.cloudinaryConfig;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", cfg.uploadPreset);
      if (cfg.folder) formData.append("folder", cfg.folder);

      const endpoint = "https://api.cloudinary.com/v1_1/" + cfg.cloudName + "/image/upload";
      const res = await fetch(endpoint, { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error && data.error.message ? data.error.message : "Cloudinary upload failed.");
      }

      return data.secure_url;
    }

    async function seedIfEmpty(force) {
      const profileRef = db.collection("settings").doc("profile");
      const profileSnap = await profileRef.get();
      if (!profileSnap.exists) await profileRef.set(DEFAULT_PROFILE);

      const linksSnap = await db.collection("links").limit(1).get();
      if (force || linksSnap.empty) {
        const batch = db.batch();
        DEFAULT_LINKS.forEach(function (item) {
          const ref = db.collection("links").doc();
          batch.set(ref, {
            ...item,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        });
        await batch.commit();
      }
    }

    function fillProfileForm(data) {
      const profile = { ...DEFAULT_PROFILE, ...(data || {}) };
      Array.from(els.profileForm.elements).forEach(function (input) {
        if (input.name && profile[input.name] !== undefined) {
          input.value = profile[input.name];
        }
      });
    }

    function getCardHtml(link, isDraft) {
      const id = isDraft ? "draft" : link.id;
      const expanded = isDraft || expandedCards.has(id);
      const statusText = link.active === false ? "Hidden" : "Live";
      const badgeText = link.badge ? escapeHtml(link.badge) : "No badge";
      const descriptionText = link.description ? escapeHtml(link.description) : "No description yet";
      const imgSrc = escapeHtml(link.image || "assets/logo.png");

      if (!expanded) {
        return `
          <div class="collection-card collection-card-compact" data-card="${id}">
            <div class="flex flex-wrap items-center gap-4">
              <img data-preview="${id}" src="${imgSrc}" class="preview-dot" alt="" onerror="this.src='assets/logo.png'">
              <div class="min-w-[200px] flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h4 class="text-sm font-bold text-gray-900">${escapeHtml(link.title || "Untitled Collection")}</h4>
                  ${link.badge ? `<span class="admin-chip">${badgeText}</span>` : ''}
                  <span class="admin-chip ${link.active === false ? "admin-chip-muted" : "admin-chip-live"}">${statusText}</span>
                  ${link.featured ? `<span class="admin-chip" style="background:#fef3c7; color:#b45309; border-color:#fde68a;">Featured</span>` : ''}
                </div>
                <p class="mt-1 line-clamp-1 text-xs text-gray-500">${descriptionText}</p>
                <p class="mt-1 text-[11px] font-semibold text-gray-400">Order: ${Number(link.order || 0)} · ${escapeHtml(link.url || "No URL")}</p>
              </div>
              <div class="flex flex-wrap items-center gap-1.5 ml-auto">
                <button type="button" data-edit="${id}" class="btn-secondary btn-tight" title="Edit this collection card">Edit</button>
                <button type="button" data-duplicate="${id}" class="btn-secondary btn-tight" title="Duplicate this card">Duplicate</button>
                <button type="button" data-delete="${id}" class="btn-danger btn-tight" title="Delete card">Delete</button>
              </div>
            </div>
          </div>
        `;
      }

      return `
        <div class="collection-card ${isDraft ? "is-draft" : ""}" data-card="${id}">
          <div class="mb-5 flex items-center gap-3 pb-3 border-b border-gray-100">
            <img data-preview="${id}" src="${imgSrc}" class="preview-dot" alt="" onerror="this.src='assets/logo.png'">
            <div class="min-w-0 flex-1">
              <h4 class="truncate text-base font-black text-gray-900">${isDraft ? "New Collection Card" : escapeHtml(link.title || "Untitled Collection")}</h4>
              <p class="text-xs text-gray-400">${isDraft ? "Fill in collection details and save to publish." : "Configure title, links, badges, and cover image."}</p>
            </div>
            <span class="rounded-full bg-pink-100 px-3 py-1 text-xs font-black text-pink-700">${isDraft ? "Draft" : statusText}</span>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <label class="field-label">
              <span>Collection Title *</span>
              <input data-id="${id}" data-field="title" value="${escapeHtml(link.title || "")}" placeholder="Example: Luxury Pret Collection" class="input" />
            </label>

            <label class="field-label">
              <span>Display Order (Lowest displays first)</span>
              <input type="number" data-id="${id}" data-field="order" value="${Number(link.order || 1)}" class="input" />
            </label>

            <label class="field-label sm:col-span-2">
              <span>Destination URL (Product or Store Collection Link) *</span>
              <input data-id="${id}" data-field="url" value="${escapeHtml(link.url || "")}" placeholder="https://boutiquemaryam.pk/collections/luxury-pret" class="input" />
            </label>

            <label class="field-label sm:col-span-2">
              <span>Thumbnail Image URL</span>
              <input data-id="${id}" data-field="image" value="${escapeHtml(link.image || "assets/logo.png")}" placeholder="https://res.cloudinary.com/..." class="input image-input" />
              <div class="upload-row">
                <input data-file="${id}" type="file" accept="image/*" class="hidden collection-file" />
                <button type="button" data-upload="${id}" class="btn-small">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  <span>Upload Image to Cloudinary</span>
                </button>
                <span data-upload-status="${id}" class="upload-note">JPG, PNG, or WEBP supported</span>
              </div>
            </label>

            <label class="field-label">
              <span>Icon / Emoji</span>
              <input data-id="${id}" data-field="icon" value="${escapeHtml(link.icon || "")}" placeholder="🛍️" class="input" />
            </label>

            <label class="field-label">
              <span>Promotional Badge (Optional)</span>
              <input data-id="${id}" data-field="badge" value="${escapeHtml(link.badge || "")}" placeholder="New / Sale / Festive / Hot" class="input" />
            </label>

            <label class="field-label sm:col-span-2">
              <span>Short Description</span>
              <textarea data-id="${id}" data-field="description" placeholder="Brief note about this collection (fabrics, embroidery, occasion)..." class="input textarea">${escapeHtml(link.description || "")}</textarea>
            </label>

            <label class="field-label">
              <span>Visibility Status</span>
              <select data-id="${id}" data-field="active" class="input">
                <option value="true" ${link.active !== false ? "selected" : ""}>Live (Visible to visitors)</option>
                <option value="false" ${link.active === false ? "selected" : ""}>Hidden (Draft)</option>
              </select>
            </label>

            <label class="field-label">
              <span>Featured Highlight</span>
              <select data-id="${id}" data-field="featured" class="input">
                <option value="false" ${link.featured !== true ? "selected" : ""}>Standard Link</option>
                <option value="true" ${link.featured === true ? "selected" : ""}>Featured Highlight (Subtle Glow &amp; Border)</option>
              </select>
            </label>
          </div>

          <!-- AI Copywriter Box -->
          <div class="ai-writer-box mt-4">
            <div>
              <p class="ai-writer-title">✨ AI Fashion Copywriter</p>
              <p class="ai-writer-note">Generates luxury boutique description, badge, and icon based on your title or link.</p>
            </div>
            <button type="button" data-ai="${id}" class="btn-ai">Generate Copy</button>
          </div>

          <!-- Action Buttons -->
          <div class="mt-5 flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
            ${
              isDraft
                ? '<button data-create="draft" class="btn-primary">Save New Collection</button><button data-cancel-draft="draft" class="btn-secondary">Cancel</button>'
                : '<button data-save="' + link.id + '" class="btn-primary">Save Changes</button><button data-collapse="' + link.id + '" class="btn-secondary">Close</button><button data-duplicate="' + link.id + '" class="btn-secondary">Duplicate</button><button data-delete="' + link.id + '" class="btn-danger ml-auto">Delete</button>'
            }
          </div>
        </div>
      `;
    }

    function titleCaseWords(value) {
      return String(value || "")
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\w\S*/g, function (word) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
    }

    function readValue(id, field) {
      const input = document.querySelector('[data-id="' + id + '"][data-field="' + field + '"]');
      return input ? input.value.trim() : "";
    }

    function writeValue(id, field, value) {
      const input = document.querySelector('[data-id="' + id + '"][data-field="' + field + '"]');
      if (input) input.value = value;
    }

    function deriveTitleFromUrl(url) {
      const clean = String(url || "").split("?")[0].replace(/\/$/, "");
      const part = clean.split("/").filter(Boolean).pop() || "";
      return titleCaseWords(part);
    }

    function generateCollectionCopy(id) {
      const existingTitle = readValue(id, "title");
      const urlTitle = deriveTitleFromUrl(readValue(id, "url"));
      const title = existingTitle || urlTitle || "Boutique Collection";
      const lower = title.toLowerCase();
      let icon = "🛍️";
      let badge = "New";
      let description = "Curated luxury boutique collection featuring timeless silhouettes, artisanal fabrics, and modern elegance.";

      if (lower.includes("eid") || lower.includes("festive") || lower.includes("ramadan")) {
        icon = "✨";
        badge = "Festive Edit";
        description = "Celebrate joyous moments in graceful festive attire, detailed with refined handwork and opulent finishes.";
      } else if (lower.includes("lawn") || lower.includes("unstitched") || lower.includes("summer")) {
        icon = "🌸";
        badge = "Fresh Drop";
        description = "Breathable unstitched lawn ensembles adorned with delicate florals, schiffli embroidery, and chiffon dupattas.";
      } else if (lower.includes("pret") || lower.includes("ready") || lower.includes("stitched")) {
        icon = "👗";
        badge = "Ready To Wear";
        description = "Effortless luxury ready-to-wear designs crafted for polished silhouettes, tailored comfort, and day-to-evening style.";
      } else if (lower.includes("jewel") || lower.includes("accessor") || lower.includes("clutch")) {
        icon = "💎";
        badge = "Statement";
        description = "Handcrafted jewelry and heirloom accessories designed to add subtle radiance and opulence to every look.";
      } else if (lower.includes("sale") || lower.includes("discount") || lower.includes("clearance")) {
        icon = "🏷️";
        badge = "Exclusive Sale";
        description = "Special limited-time offers on our most coveted boutique pieces. Discover luxury fashion at exceptional value.";
      } else if (lower.includes("chikankari") || lower.includes("embroider") || lower.includes("velvet") || lower.includes("silk")) {
        icon = "🧵";
        badge = "Artisanal";
        description = "Exquisite threadwork and sumptuous fabrics crafted with meticulous heritage techniques for a truly royal feel.";
      }

      writeValue(id, "title", title);
      writeValue(id, "icon", icon);
      writeValue(id, "badge", badge);
      writeValue(id, "description", description);
      showGlobal("✨ AI Copywriter generated title, badge, and description.", false);
    }

    function readFields(id) {
      const inputs = Array.from(document.querySelectorAll('[data-id="' + id + '"]'));
      const payload = {};
      inputs.forEach(function (input) {
        const field = input.dataset.field;
        if (field === "order") payload[field] = Number(input.value || 0);
        else if (field === "active" || field === "featured") payload[field] = input.value === "true";
        else payload[field] = input.value;
      });
      payload.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
      return payload;
    }

    function showDraftCard() {
      switchPanel("collectionsSection");
      const draft = {
        title: "",
        url: "",
        image: "assets/logo.png",
        icon: "🛍️",
        badge: "New",
        description: "",
        active: true,
        featured: false,
        order: currentLinks.length + 1
      };
      els.draftArea.innerHTML = getCardHtml(draft, true);
      els.draftArea.classList.remove("hidden");
      els.draftArea.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function renderAdminLinks(links) {
      if (!links.length) {
        els.linksAdmin.innerHTML =
          '<div class="rounded-xl border border-dashed border-gray-200 bg-gray-50/70 p-8 text-center text-xs text-gray-500">' +
          '<p class="font-bold text-gray-700 text-sm">No collections created yet</p>' +
          '<p class="mt-1">Click <strong>+ Add Collection</strong> to create your first digital visiting card link.</p>' +
          '</div>';
        return;
      }

      els.linksAdmin.innerHTML = links
        .slice()
        .sort(function (a, b) { return Number(a.order || 0) - Number(b.order || 0); })
        .map(function (link) { return getCardHtml(link, false); })
        .join("");
    }

    async function saveProfile() {
      try {
        els.saveProfileBtn.disabled = true;
        const payload = Object.fromEntries(new FormData(els.profileForm).entries());
        await db.collection("settings").doc("profile").set(payload, { merge: true });
        showGlobal("Profile settings saved successfully. Digital card updated.", false);
      } catch (error) {
        showGlobal("Profile save error: " + error.message, true);
      } finally {
        els.saveProfileBtn.disabled = false;
      }
    }

    // Color theme preset handler
    const THEME_PRESETS = {
      rose: { themeBg: "#ffffff", pageBg: "#faf9fb", buttonBg: "#ffffff", textColor: "#0f0f14" },
      noir: { themeBg: "#16161b", pageBg: "#0f0f12", buttonBg: "#22222a", textColor: "#ffffff" },
      gold: { themeBg: "#fcf9f2", pageBg: "#f7f1e3", buttonBg: "#ffffff", textColor: "#1e1a12" },
      ivory: { themeBg: "#ffffff", pageBg: "#f8f9fa", buttonBg: "#ffffff", textColor: "#111827" }
    };

    document.querySelectorAll(".palette-preset-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const presetKey = btn.dataset.preset;
        const preset = THEME_PRESETS[presetKey];
        if (!preset) return;
        Object.keys(preset).forEach(function (key) {
          const input = els.profileForm.querySelector('[name="' + key + '"]');
          if (input) input.value = preset[key];
        });
        showGlobal("Applied " + btn.textContent.trim() + " color palette. Click Save Profile to apply.", false);
      });
    });

    function startAdminListeners() {
      if (unsubProfile) unsubProfile();
      if (unsubLinks) unsubLinks();

      unsubProfile = db.collection("settings").doc("profile").onSnapshot(function (snap) {
        fillProfileForm(snap.exists ? snap.data() : DEFAULT_PROFILE);
      }, function (error) {
        showGlobal("Profile load error: " + error.message, true);
      });

      unsubLinks = db.collection("links").orderBy("order", "asc").onSnapshot(function (snap) {
        currentLinks = snap.docs.map(function (d) { return { id: d.id, ...d.data() }; });
        renderAdminLinks(currentLinks);
      }, function (error) {
        els.linksAdmin.innerHTML =
          '<div class="rounded-xl bg-red-50 p-4 text-xs text-red-700">' +
          '<strong>Error loading collections:</strong> ' + escapeHtml(error.message) +
          '</div>';
      });
    }

    function stopAdminListeners() {
      if (unsubProfile) unsubProfile();
      if (unsubLinks) unsubLinks();
      unsubProfile = null;
      unsubLinks = null;
    }

    els.togglePasswordBtn.addEventListener("click", function () {
      const show = els.password.type === "password";
      els.password.type = show ? "text" : "password";
      els.togglePasswordBtn.textContent = show ? "Hide" : "Show";
    });

    els.loginBtn.addEventListener("click", async function () {
      hideLoginError();
      const email = els.email.value.trim();
      const password = els.password.value;
      if (!email || !password) return showLoginError("Please enter both email and password.");

      try {
        els.loginBtn.disabled = true;
        els.loginBtnText.textContent = "Signing in...";
        await auth.signInWithEmailAndPassword(email, password);
      } catch (error) {
        showLoginError(authError(error));
      } finally {
        els.loginBtn.disabled = false;
        els.loginBtnText.textContent = "Sign In to Dashboard";
      }
    });

    els.password.addEventListener("keydown", function (e) {
      if (e.key === "Enter") els.loginBtn.click();
    });

    els.logoutBtn.addEventListener("click", function () { auth.signOut(); });
    els.saveProfileBtn.addEventListener("click", saveProfile);
    els.addLinkBtn.addEventListener("click", showDraftCard);

    document.body.addEventListener("click", function (e) {
      const panelLink = e.target.closest("[data-panel-link]");
      if (!panelLink) return;
      switchPanel(panelLink.dataset.panelLink);
    });

    els.seedBtn.addEventListener("click", async function () {
      if (confirm("Populate initial demo collections and profile into Firestore?")) {
        try {
          await seedIfEmpty(true);
          showGlobal("Demo boutique collections added successfully.", false);
        } catch (error) {
          showGlobal("Demo creation error: " + error.message, true);
        }
      }
    });

    els.uploadProfileLogoBtn.addEventListener("click", function () {
      els.profileLogoFile.click();
    });

    els.profileLogoFile.addEventListener("change", async function () {
      const file = els.profileLogoFile.files[0];
      if (!file) return;

      try {
        els.uploadProfileLogoBtn.disabled = true;
        els.uploadProfileLogoBtn.innerHTML = '<span>Uploading...</span>';
        const url = await uploadToCloudinary(file);
        els.logoUrlInput.value = url;
        showGlobal("Logo uploaded to Cloudinary. Click Save Profile to apply.", false);
      } catch (error) {
        showGlobal("Logo upload error: " + error.message, true);
      } finally {
        els.uploadProfileLogoBtn.disabled = false;
        els.uploadProfileLogoBtn.innerHTML =
          '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>' +
          '<span>Upload Logo to Cloudinary</span>';
        els.profileLogoFile.value = "";
      }
    });

    document.body.addEventListener("input", function (e) {
      if (e.target.classList.contains("image-input")) {
        const id = e.target.dataset.id;
        const img = document.querySelector('[data-preview="' + id + '"]');
        if (img) img.src = e.target.value || "assets/logo.png";
      }
    });

    document.body.addEventListener("click", async function (e) {
      const target = e.target.closest("[data-edit], [data-collapse], [data-ai], [data-cancel-draft], [data-upload], [data-create], [data-save], [data-duplicate], [data-delete]");
      if (!target) return;

      if (target.dataset.edit) {
        expandedCards.add(target.dataset.edit);
        renderAdminLinks(currentLinks);
        const card = document.querySelector('[data-card="' + target.dataset.edit + '"]');
        if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      if (target.dataset.collapse) {
        expandedCards.delete(target.dataset.collapse);
        renderAdminLinks(currentLinks);
        return;
      }

      if (target.dataset.ai) {
        generateCollectionCopy(target.dataset.ai);
        return;
      }

      if (target.dataset.cancelDraft) {
        els.draftArea.innerHTML = "";
        els.draftArea.classList.add("hidden");
        return;
      }

      if (target.dataset.upload) {
        const id = target.dataset.upload;
        const fileInput = document.querySelector('[data-file="' + id + '"]');
        if (fileInput) fileInput.click();
        return;
      }

      try {
        if (target.dataset.create) {
          const payload = readFields("draft");
          if (!payload.title || !payload.url) {
            showGlobal("Collection Title and Destination URL are required.", true);
            return;
          }
          payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
          await db.collection("links").add(payload);
          els.draftArea.innerHTML = "";
          els.draftArea.classList.add("hidden");
          showGlobal("New collection card created successfully.", false);
        }

        if (target.dataset.save) {
          const id = target.dataset.save;
          const payload = readFields(id);
          if (!payload.title || !payload.url) {
            showGlobal("Collection Title and Destination URL are required.", true);
            return;
          }
          await db.collection("links").doc(id).update(payload);
          currentLinks = currentLinks.map(function (item) {
            return item.id === id ? { ...item, ...payload } : item;
          });
          expandedCards.delete(id);
          renderAdminLinks(currentLinks);
          showGlobal("Collection card updated successfully.", false);
        }

        if (target.dataset.duplicate) {
          const item = currentLinks.find(function (x) { return x.id === target.dataset.duplicate; });
          if (item) {
            const copy = { ...item };
            delete copy.id;
            copy.title = (copy.title || "Collection") + " (Copy)";
            copy.order = currentLinks.length + 1;
            copy.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            copy.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection("links").add(copy);
            showGlobal("Collection card duplicated.", false);
          }
        }

        if (target.dataset.delete) {
          if (confirm("Are you sure you want to delete this collection card?")) {
            await db.collection("links").doc(target.dataset.delete).delete();
            showGlobal("Collection card deleted.", false);
          }
        }
      } catch (error) {
        showGlobal("Error: " + error.message, true);
      }
    });

    document.body.addEventListener("change", async function (e) {
      if (!e.target.classList.contains("collection-file")) return;

      const id = e.target.dataset.file;
      const file = e.target.files[0];
      if (!file) return;

      const status = document.querySelector('[data-upload-status="' + id + '"]');
      const imageInput = document.querySelector('[data-id="' + id + '"][data-field="image"]');
      const preview = document.querySelector('[data-preview="' + id + '"]');

      try {
        if (status) status.textContent = "Uploading to Cloudinary...";
        const url = await uploadToCloudinary(file);
        if (imageInput) imageInput.value = url;
        if (preview) preview.src = url;
        if (status) status.textContent = "Uploaded! Click Save Changes.";
        showGlobal("Image uploaded. Remember to click Save Changes to persist.", false);
      } catch (error) {
        if (status) status.textContent = "Upload failed.";
        showGlobal("Cloudinary upload error: " + error.message, true);
      } finally {
        e.target.value = "";
      }
    });

    auth.onAuthStateChanged(async function (user) {
      if (user) {
        els.loginScreen.classList.add("hidden");
        els.adminScreen.classList.remove("hidden");
        els.adminUserText.textContent = user.email || "admin@boutique.pk";
        try {
          await seedIfEmpty(false);
          startAdminListeners();
        } catch (error) {
          showGlobal("Firebase initialization note: " + error.message, true);
        }
      } else {
        stopAdminListeners();
        els.adminScreen.classList.add("hidden");
        els.loginScreen.classList.remove("hidden");
      }
    });

    switchPanel("collectionsSection");
    updateCloudinaryStatus();
  });
})();
